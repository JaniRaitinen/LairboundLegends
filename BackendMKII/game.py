import config
import app
import math


class Game:

    def __init__(self, id, loc, player=None):
        self.status = {}
        self.location = []
        self.location = []

        if id == 'Null':

            # New game

            self.status = {
                "id": '1',  # ei ehkä toimi näin
                "name": player,
                "stamina": config.stamina_max,
                "danger_global": 0,
                "previous_location": config.default_starting_point,
                "health": config.health_max
            }

            # self.location.append(Airport(loc, True))
            # tarviiko?

            sql = "INSERT INTO Game VALUES ('" + self.status["id"] + "', " + str(self.status["name"])
            sql += ", " + str(self.status["stamina"]) + "', " + str(self.status["danger_global"])
            sql += ", '" + loc + "', '" + self.status["health"] + "')"
            print(sql)
            cur = app.connection.cursor()
            cur.execute(sql)

        else:

            # Load game
            sql = "SELECT id, dragon_name, stamina, danger_global, location, health FROM Game WHERE id='" + id + "'"
            print(sql)
            cur = app.connection.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.status = {
                    "id": res[0][0],
                    "name": res[0][1],
                    "stamina": res[0][2],
                    "danger_global": res[0][3],
                    "previous_location": res[0][4],
                    "health": res[0][5]
                }

                # tarvitaanko tätä?

                # old location in DB currently not used
                # apt = Airport(loc, True)
                # self.location.append(apt)
                # self.set_location(apt)

            else:
                print("Database error?")
        self.fetch_goal_info()

    def fetch_goal_info(self):

        sql = "SELECT * FROM (SELECT shard.id, shard.name, shard.description, shard.icon, shard_gained.game_id, "
        sql += "shard.target, shard.target_minvalue, shard.target_maxvalue, shard.target_text "
        sql += "FROM shard INNER JOIN shard_gained ON shard.id = shard_gained.shard_id "
        sql += "WHERE shard_gained.game_id = '" + self.status["id"] + "' "
        sql += "UNION SELECT shard.id, shard.name, shard.description, shard.icon, NULL, "
        sql += "shard.target, shard.target_minvalue, shard.target_maxvalue, shard.target_text "
        sql += "FROM shard WHERE shard.id NOT IN ("
        sql += "SELECT shard.id FROM shard INNER JOIN shard_reached ON shard.id = shard_gained.shard_id "
        sql += "WHERE shard_gained.game_id = '" + self.status["id"] + "')) AS t ORDER BY t.id;"

        print(sql)
        cur = app.connection.cursor()
        cur.execute(sql)
        res = cur.fetchall()
        for a in res:
            if a[4] == self.status["id"]:
                is_reached = True
            else:
                is_reached = False
            goal = Goal(a[0], a[1], a[2], a[3], is_reached, a[5], a[6], a[7], a[8])
            self.goals.append(goal)
        return

    def Save(self, sijainti, health, stamina):
        sql = "UPDATE Game SET location='" + sijainti.ident + "',"
        sql += "SET health='" + health + "',"
        sql += "SET stamina='" + stamina + "',"
        sql += "WHERE id=" + self.status["id"] + "'"
        print(sql)
        cur = app.connection.cursor()
        cur.execute(sql)

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