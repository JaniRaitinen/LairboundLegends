import json
import os
import config
from game import Game
#from sanakirja2 import Sanakirja

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)
# lisätty cors
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

config.conn = mysql.connector.connect(
         host=os.environ.get('HOST'),
         port= 3306,
         database=os.environ.get('DB_NAME'),
         user=os.environ.get('DB_USER'),
         password=os.environ.get('DB_PASS'),
         autocommit=True
         )

def flyToLairport(gameId, destination, consumption=0, player=None):
    if gameId==0:
        game = Game(0, destination, consumption, player)
    else:
        game = Game(gameId, destination, consumption)
    game.location[0].fetchWeather(game)
    nearbyLairports = game.location[0].findNearbyLairports()
    for i in nearbyLairports:
        game.location.append(i)
    jsonData = json.dumps(game, default=lambda o: o.__dict__, indent=4)
    return jsonData

@app.route('/initGame')
def initGame():
    args = request.args
    playerName = args.get("player")
    startLocation = args.get("loc")
    jsonData = {0, startLocation, 0, playerName}
    return jsonData

@app.route('/newgame')
def newgame():
    args = request.args
    playerName = args.get("player")
    newPlayer = Game('', playerName)
    return newPlayer.status

@app.route('/loadgame')
def loadgame():
    args = request.args
    playerId = args.get("id")
    player = Game(playerId)
    return player.status


@app.route('/loaddata')
def loadData():
    sql = f"select * from game;"
    cur = config.conn.cursor()
    cur.execute(sql)
    gamedata = cur.fetchall()
    if len(gamedata) > 0:
        return gamedata
    else:
        return False

@app.route('/flyto')
def flyto():
    args = request.args
    gameId = args.get("game")
    dest = args.get("dest")
    consumption = args.get("consumption")
    jsonData = flyToLairport(gameId, dest, consumption)
    return jsonData

#  vain tätä muutettu
#@app.route('/sanakirja')
#def sanakirja2():
   # args = request.args
   # name = args.get("name")
   # loc = args.get("loc")
   # jsonData = Sanakirja(name, loc)
   # return jsonData


if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

