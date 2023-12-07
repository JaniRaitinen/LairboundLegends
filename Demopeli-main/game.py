import string, random
from airport import Airport
from goal import Goal
import config

class Game:

    def __init__(self, id, loc, consumption, player=None):
        self.status = {}
        self.location = []
        self.goals = []

        if id==0:
            # new game
            # Create new game id
            letters = random.randint(1, 10)

            self.status = {
                "id" : str(letters),
                "name" : player,
                "co2" : {
                    "consumed" : config.co2_initial,
                    "budget" : config.co2_budget
                },
                "previous_location" : ""
            }


            #self.id = ''.join(random.choice(letters) for i in range(20))
            #self.footprint = config.initial_footprint
            self.location.append(Airport(loc, True))
            #self.player = player
            # Insert new game into DB
            print(self.status["id"])
            sql = f"INSERT INTO game VALUES ({self.status['id']}, '{self.status['name']}', {self.status['co2']['consumed']}, {self.status['id']}, '{loc}', '100');"
            #sql = "INSERT INTO game VALUES (" + self.status["id"] + ", '" + self.status["name"] + "', " + str(self.status["co2"]["consumed"])
           # sql += ", " + self.status["id"] + '" + loc + "')"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            #config.conn.commit()

        else:
            #update consumption and budget
            sql2 = "UPDATE game SET stamina = stamina + " + consumption + " WHERE id='" + id + "'"
            print(sql2)
            cur2 = config.conn.cursor()
            cur2.execute(sql2)
            # find game from DB
            sql = "SELECT id, stamina, location, dragon_name FROM game WHERE id='" + id + "'"
            print(sql)
            cur = config.conn.cursor()
            cur.execute(sql)
            res = cur.fetchall()
            if len(res) == 1:
                # game found
                self.status = {
                    "id": res[0][0],
                    "name": res[0][4],
                    "co2": {
                        "consumed": res[0][1],
                        "budget": res[0][2]
                    },
                    "previous_location" : res[0][3]
                }
                # old location in DB currently not used
                apt = Airport(loc, True)
                self.location.append(apt)
                self.set_location(apt)

            else:
                print("************** PELIÄ EI LÖYDY! ***************")

        # read game's goals
        self.fetch_goal_info()






    def set_location(self, sijainti):
        #self.location = sijainti
        sql = "UPDATE game SET location='" + sijainti.ident + "' WHERE id='" + self.status["id"] + "'"
        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        #config.conn.commit()
        #self.loc = sijainti.ident


    def fetch_goal_info(self):

        sql = "SELECT * FROM (SELECT Goal.id, Goal.name, Goal.description, Goal.icon, goal_reached.game_id, "
        sql += "Goal.target, Goal.target_minvalue, Goal.target_maxvalue, Goal.target_text "
        sql += "FROM shard INNER JOIN shard_gained ON Goal.id = goal_reached.goal_id "
        sql += "WHERE goal_reached.game_id = '" + self.status["id"] + "' "
        sql += "UNION SELECT Goal.id, Goal.name, Goal.description, Goal.icon, NULL, "
        sql += "Goal.target, Goal.target_minvalue, Goal.target_maxvalue, Goal.target_text "
        sql += "FROM shard WHERE Goal.id NOT IN ("
        sql += "SELECT Goal.id FROM shard INNER JOIN shard_gained ON Goal.id = goal_reached.goal_id "
        sql += "WHERE goal_reached.game_id = '" + self.status["id"] + "')) AS t ORDER BY t.id;"

        print(sql)
        cur = config.conn.cursor()
        cur.execute(sql)
        res = cur.fetchall()
        for a in res:
            if a[4]==self.status["id"]:
                is_reached = True
            else:
                is_reached = False
            goal = Goal(a[0], a[1], a[2], a[3], is_reached, a[5], a[6], a[7], a[8])
            self.goals.append(goal)
        return goal