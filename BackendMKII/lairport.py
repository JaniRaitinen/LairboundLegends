from BackendMKII.weather import Weather
import config
from geopy import distance
from operator import itemgetter


class Lairport:
    def __init__(self, ident, active=False, data=None):
        self.ident = ident
        self.active = active
        # Katsotaan ollaanko kenttä jo haettu
        if data is None:
            # Löydä lairport tietokannasta
            sql = "SELECT ident, name, latitude_deg, longtitude_deg FROM lairport WHERE ident='" + ident + "'"
            cursor = config.conn.cursor()
            cursor.execute(sql)
            result = cursor.fetchall()
            if len(result) == 1:
                # peli löytyi
                self.ident = result[0][0]
                self.name = result[0][1]
                self.latitude = float(result[0][2])
                self.longitude = float(result[0][3])
        else:
            # Tiedetään lairport
            self.name = data['name']
            self.latitude = float(data['latitude'])
            self.longitude = float(data['longitude'])

    def findNearbyLairports(self):
        # find nearby lairport depending on current stamina. not currently implemented to find depending on stamina
        sql = "SELECT ident, name, latitude_deg, longitude_deg FROM lairport WHERE latitude_deg BETWEEN "
        sql += str(self.latitude - 50000) + " AND " + str(self.latitude + 50000)
        sql += " AND longitude_deg BETWEEN "
        sql += str(self.longitude - 50000) + " AND " + str(self.longitude + 50000)
        cursor = config.conn.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        lairportList = []
        for i in result:
            if i[0] != self.ident:
                data = {'name': i[1], 'latitude': i[2], 'longitude': i[3]}
                nearbyLairport = Lairport(i[0], False, data)
                nearbyLairport.distance = self.distanceTo(nearbyLairport)
                if nearbyLairport.distance <= 50000:
                    lairportList.append(nearbyLairport)
                    nearbyLairport.stamina = self.staminaConsumption(nearbyLairport.distance)

        return lairportList

    def closestWeather(self, game, targetweather):
        # find closest of current weathergoal
        sql = "SELECT ident, name, latitude_deg, longitude_deg FROM lairport"
        cursor = config.conn.cursor()
        cursor.execute(sql)
        result = cursor.fetchall()
        list = []
        for i in result:
            i.weather = Weather(self, game)  # tarvii oman sijainnin koordinaatit
            if i.weather == targetweather:
                i.append(self.distanceTo(i))
                list.append(i)
        sorted_list = sorted(list, key=itemgetter(4))
        target = sorted_list[0]
        return target[2, 3]

    def updateWeather(self, game):
        self.weather = Weather(self, game)
        return

    def distanceTo(self, target):
        coordinateOne = (self.latitude, self.longitude)
        coordinateTwo = (target.latitude, target.longitude)
        dist = distance.distance(coordinateOne, coordinateTwo).km
        return int(dist)

    def staminaConsumption(self, km):
        consumption = km
        return consumption
