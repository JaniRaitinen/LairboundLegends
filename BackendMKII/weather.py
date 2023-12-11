import requests
import config
import os

from dotenv import load_dotenv
load_dotenv()

class Weather:

    def __init__(self, location, game):
        apiKey = os.environ.get('API_KEY')

        request = "https://api.openweathermap.org/data/2.5/weather?lat=" + \
                  str(location.latitude) + "&lon=" + str(location.longitude) + "&appid=" + apiKey
        vastaus = requests.get(request).json()
        self.main = vastaus["weather"][0]["main"]
        self.description = vastaus["weather"][0]["description"]
        self.icon = "https://openweathermap.org/img/wn/" + vastaus["weather"][0]["icon"] + ".png"
        self.temp = self.kelvin_to_celsius(vastaus["main"]["temp"])
        self.humidity = vastaus["main"]["humidity"]
        self.wind = {
            "speed": vastaus["wind"]["speed"],
            "deg": vastaus["wind"]["deg"]
        }

        self.meets_shards = []
        self.check_weather_shards(game)

    def check_weather_shards(self, game):

        for shard in game.shards:
            if shard.target == "TEMP":
                # temperature rule
                if self.temp >= shard.target_minvalue and self.temp <= shard.target_maxvalue:
                    self.meets_shards.append(shard.shard_id)
            elif shard.target == "WEATHER":
                # weather type rule
                if self.main == shard.target_text:
                    self.meets_shards.append(shard.shard_id)
            elif shard.target == "WIND":
                # wind rule
                if self.wind["speed"] >= shard.target_minvalue and self.wind["speed"] <= shard.target_maxvalue:
                    self.meets_shards.append(shard.shard_id)

        for shard in game.shards:
            if shard.reached == False and shard.shardid in self.meets_shards:
                # new shard
                sql = "INSERT INTO shard_gained VALUES ('" + game.status["id"] + "', '" + str(shard.shard_id) + "')"
                print(sql)
                cursor = config.conn.cursor()
                cursor.execute(sql)
                shard.reached = True
        return

    def kelvin_to_celsius(self, kelvin):
        return int (kelvin - 273.15)