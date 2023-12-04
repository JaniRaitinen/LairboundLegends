import string, random
from airport import Lairport
from goal import Shard
import config
import math


# done

class Game:

    def __init__(self, id, loc, consumption, player=None):
        self.status = {}
        self.location = []
        self.goals = []

        if id == 0:
            # new game
            # Create new game id
            letters = string.ascii_lowercase + string.ascii_uppercase + string.digits

            self.status = {
                "id": ''.join(random.choice(letters) for i in range(20)),
                "dragon_name": player,
                "stamina": config.stamina_initial,
                "health": config.hp_initial,
                "danger_global": 0,
                "previous_location": config.default_starting_point
            }

            # self.id = ''.join(random.choice(letters) for i in range(20))
            # self.footprint = config.initial_footprint
            self.location.append(Lairport(loc, True))
            # self.player = player
            # Insert new game into DB
            sql = "INSERT INTO Game VALUES ('" + self.status["id"] + "', " + str(self.status["health"])
            sql += ", " + str(self.status["stamina"]) + ", '" + loc + "', '" + self.status["dragon_name"] + "')"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            # config.conn.commit()

        else:
            # find game from DB
            sql = "SELECT id, dragon_name, stamina, health, danger_global, location FROM Game WHERE id='" + id + "'"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.status = {
                    "id": res[0][0],
                    "dragon_name": res[0][1],
                    "stamina": res[0][2],
                    "health": res[0][3],
                    "danger_global": res[0][4],
                    "previous_location": res[0][5]
                }
                # old location in DB currently not used
                apt = Lairport(loc, True)
                self.location.append(apt)
                self.set_location(apt)

            else:
                print("************** No save file found! ***************")

        # read game's goals
        self.fetch_shard_info()

    def set_location(self, sijainti):
        # self.location = sijainti
        sql = "UPDATE Game SET location='" + sijainti.ident + "' WHERE id='" + self.status["id"] + "'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        # config.conn.commit()
        # self.loc = sijainti.ident

    def fetch_shard_info(self):

        sql = "SELECT * FROM (SELECT shard.id, shard.weather, shard.name "
        sql += "FROM shard INNER JOIN shard_gained ON shard.id = shard_gained.w_id "
        sql += "WHERE shard_gained.g_id = '" + self.status["id"] + "' "
        sql += "UNION SELECT shard.id, shard.weather, shard.name "
        sql += "FROM shard WHERE shard.id NOT IN ("
        sql += "SELECT shard.id FROM shard INNER JOIN shard_gained ON shard.id = shard_gained.w_id "
        sql += "WHERE shard_gained.g_id = '" + self.status["id"] + "')) AS t ORDER BY t.id;"

        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()
        for a in res:
            if a[4] == self.status["id"]:
                is_reached = True
            else:
                is_reached = False
            goal = Shard(a[0], a[1], a[2], a[3], is_reached)
            self.goals.append(goal)
        return

    def calculate_direction(self, latitude, longitude):
        #oman sijainnin koordinaatit, esimerkkinä hki-vantaa. tähän self.locationin koordinaatit
        loc_coordinates = (60.317222, 24.963333)

        #lasketaan radiaanit
        lat1, lon1, lat2, lon2 = map(math.radians, [loc_coordinates[0], loc_coordinates[1], latitude, longitude])

        #longitude-etäisyydet
        d_lon = lon2 - lon1

        #y- ja x-akselimatematiikkaa
        y = math.sin(d_lon) * math.cos(lat2)
        x = math.cos(lat1) * math.sin(lat2) - (math.sin(lat1) * math.cos(lat2) * math.cos(d_lon))

        #radiaanit
        bearing_rad = math.atan2(y, x)

        #radiaanit takaisin asteiksi
        bearing_deg = math.degrees(bearing_rad)

        #muutetaan asteet 360-sisäiseksi
        compass_point = (bearing_deg + 360) % 360

        #palautetaan asteen mukainen oikea suunta
        cardinal_directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"]
        index = round(compass_point / 45) % 8

        return cardinal_directions[index]