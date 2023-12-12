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
    list = []
    for i in result:
        i.weather = checkWeather(i[2, 3], targetweather)  # tarvii oman sijainnin koordinaatit
        if i.weather == targetweather:
            coordinateOne = (location.latitude, location.longitude)
            coordinateTwo = (i[0], i[1])
            dist = distance.distance(coordinateOne, coordinateTwo).km
            i.append(dist)
            list.append(i)
    sorted_list = sorted(list, key=itemgetter(4))
    target = sorted_list[0]
    return target[2, 3]


def checkWeather(location, targetweather):
    apiKey = os.environ.get('API_KEY')

    request = "https://api.openweathermap.org/data/2.5/weather?lat=" + \
              str(location[0]) + "&lon=" + str(location[1]) + "&appid=" + apiKey
    vastaus = requests.get(request).json()
    main = vastaus["weather"][0]["main"]
    kelvin = vastaus["main"]["temp"]
    temp = int(kelvin - 273.15)
    wind = vastaus["wind"]["speed"]

    sql = f"SELECT * FROM shard WHERE id={targetweather}"
    cursor = config.conn.cursor()
    cursor.execute(sql)
    res = cursor.fetchall()

    if res.target == "TEMP":
        # temperature rule
        if res.target_minvalue <= temp <= res.target_maxvalue:
            result = res.shard_id
    elif res.target == "WEATHER":
        # weather type rule
        if main == res.target_text:
            result = res.shard_id
    elif res.target == "WIND":
        # wind rule
        if res.target_minvalue <= wind["speed"] <= res.target_maxvalue:
            result = res.shard_id
    return result


def calculate_direction(location, targetweather):
    sql = f"SELECT latitude_deg, longitude_deg FROM lairport WHERE ident = {location}"
    cur = config.conn.cursor()
    cur.execute(sql)
    loc_coordinates = cur.fetchall()

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

    return cardinal_directions[index]
