import config

from lairport import Lairport
from shard import Shard


class Game:

    def __init__(self, id, player=None):
        self.status = {}
        self.location = []
        self.shards = []

        if id == '':

            # New game

            self.status = {
                "id": 0,  # ei ehkä toimi näin, mut pitäis muuttaa nouseviks numeroix sqlläs
                "name": player,
                "stamina": config.stamina_max,
                "danger_global": 0,
                "location": config.default_starting_point,
                "health": config.health_max
            }

            self.location.append(Lairport(str(self.status["location"]), True))
            # tarviiko?

            sql = "INSERT INTO game VALUES ('" + str(self.status["id"]) + "', '" + str(self.status["name"])
            sql += "', " + str(self.status["stamina"]) + ", " + str(self.status["danger_global"])
            sql += ", '" + str(self.status["location"]) + "', " + str(self.status["health"]) + ")"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)


        else:

            # Load game
            sql = "SELECT id, dragon_name, stamina, danger_global, location, health FROM Game WHERE id='" + id + "'"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.status = {
                    "id": res[0][0],
                    "name": res[0][1],
                    "stamina": res[0][2],
                    "danger_global": res[0][3],
                    "location": res[0][4],
                    "health": res[0][5]
                }

                # tarvitaanko tätä?

                # old location in DB currently not used
                apt = Lairport(str(self.status["location"]), True)
                self.location.append(apt)
                self.set_location(apt)

            else:
                print("Database error?")


    def set_location(self, location):
        sql = f"update game set location = '{location.ident}' where id='{str(self.status['id'])}'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)


    def fetch_shard_info(self):

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
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()
        for a in res:
            if a[4] == self.status["id"]:
                is_reached = True
            else:
                is_reached = False
            shard = Shard(a[0], a[1], a[2], a[3], is_reached, a[5], a[6], a[7], a[8])
            self.shards.append(shard)
        return

    def savegame(self, sijainti, health, stamina):
        sql = "UPDATE game SET location='" + sijainti.ident + "',"
        sql += "SET health='" + health + "',"
        sql += "SET stamina='" + stamina + "',"
        sql += "WHERE id=" + self.status["id"] + "'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
