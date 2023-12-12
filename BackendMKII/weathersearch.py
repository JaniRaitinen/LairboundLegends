import math
import os
from operator import itemgetter

import requests
from geopy import distance

import config

from dotenv import load_dotenv

load_dotenv()


def closestWeather(location, targetweather):
    # find closest of current weathergoal
    sql = "SELECT ident, name, latitude_deg, longitude_deg FROM lairport"
    cursor = config.conn.cursor()
    cursor.execute(sql)
    result = cursor.fetchall()

    sql2 = f"SELECT latitude_deg, longitude_deg FROM lairport WHERE ident ='{location}'"
    cursor = config.conn.cursor()
    cursor.execute(sql2)
    location = cursor.fetchone()

    list = []
    target = None
    print(location)
    for i in result:
        entry = []
        coordinateOne = (location[0], location[1])
        coordinateTwo = (i[2], i[3])
        dist = distance.distance(coordinateOne, coordinateTwo).km
        entry.append(dist)
        entry.append(i)
        list.append(entry)
    sorted_list = sorted(list, key=itemgetter(0))
    for i in sorted_list:
        coords = i[1][2], i[1][3]
        print(coords)
        weather = checkWeather(coords, targetweather)  # tarvii oman sijainnin koordinaatit
        if weather:
            target = i
            break
    return target[1][2], target[1][3]


def checkWeather(location, targetweather):
    apiKey = os.environ.get('API_KEY')

    request = "https://api.openweathermap.org/data/2.5/weather?lat=" + \
              str(location[0]) + "&lon=" + str(location[1]) + "&appid=" + apiKey
    vastaus = requests.get(request).json()
    main = vastaus["weather"][0]["main"]
    kelvin = vastaus["main"]["temp"]
    temp = int(kelvin - 273.15)
    wind = int(vastaus["wind"]["speed"])
    print(main)

    sql = f"SELECT * FROM shard WHERE id='{targetweather}'"
    cursor = config.conn.cursor()
    cursor.execute(sql)
    resu = cursor.fetchall()
    print(targetweather)
    print(resu)
    res = resu[0]
    result = False

    if res[4] == "TEMP":
        # temperature rule
        if int(res[5]) <= temp <= int(res[6]):
            result = True
    elif res[4] == "WEATHER":
        # weather type rule
        if main == res[7]:
            result = True
    elif res[4] == "WIND":
        # wind rule
        if int(res[5]) <= wind["speed"] <= int(res[6]):
            result = True
    return result


def calculate_direction(location, targetweather):
    sql = f"SELECT latitude_deg, longitude_deg FROM lairport WHERE ident = '{location}'"
    cur = config.conn.cursor()
    cur.execute(sql)
    loc_coordinates = cur.fetchone()

    target_coordinates = closestWeather(location, targetweather)  # täs ehkä kusee jotain

    # lasketaan radiaanit
    lat1, lon1, lat2, lon2 = map(math.radians, [loc_coordinates[0], loc_coordinates[1], target_coordinates[0],
                                                target_coordinates[1]])

    # longitude-etäisyydet
    d_lon = lon2 - lon1

    # y- ja x-akselimatematiikkaa
    y = math.sin(d_lon) * math.cos(lat2)
    x = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1) * math.cos(lat2) * math.cos(d_lon))

    # radiaanit
    bearing_rad = math.atan2(y, x)

    # radiaanit takaisin asteiksi
    bearing_deg = math.degrees(bearing_rad)

    # muutetaan asteet 360-sisäiseksi
    compass_point = (bearing_deg + 360) % 360

    # palautetaan asteen mukainen oikea suunta
    cardinal_directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest", "North"]
    index = round(compass_point / 45) % 8
    direction = {"direction": cardinal_directions[index]}

    return direction
