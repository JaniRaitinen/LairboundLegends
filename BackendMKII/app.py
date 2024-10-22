import json
import os

import config
from game import Game
from sanakirja2 import Sanakirja
import weathersearch

import mysql.connector
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS


load_dotenv()

app = Flask(__name__)
#lisätty cors
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

def flyToLairport(gameId, dest, nextDistance=1000, player=None):
    if gameId==0:
        game = Game(0, dest, player)
    else:
        game = Game(gameId, dest)
        game.location[0].updateWeather(game)
    nearbyLairports = game.location[0].findNearbyLairports(nextDistance)
    for i in nearbyLairports:
        game.location.append(i)
    print(game)
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
    newPlayer = Game('', str(config.default_starting_point) ,playerName)
    return newPlayer.status

@app.route('/fetchid')
def fetchId():
    args = request.args
    playerName = args.get("player")
    sql = f"select id from game where dragon_name = '{playerName}';"
    cur = config.conn.cursor()
    cur.execute(sql)
    playerId = cur.fetchall()
    print(playerId)
    return playerId

@app.route('/loadgame')
def loadgame():
    args = request.args
    playerId = args.get("id")
    sql = f"select location from game where id = '{playerId}';"
    cur = config.conn.cursor()
    cur.execute(sql)
    loc = cur.fetchone()
    player = Game(playerId, loc[0])
    return player.status

@app.route('/fetchText')
def fetchText():
    args = request.args
    name = args.get("name")
    loc = args.get("loc")
    textId = args.get("textId")
    returnText = Sanakirja(name, loc).returnText(textId)
    jsonReturnText = json.dumps(returnText, default=lambda o: o.__dict__, indent=4)
    return jsonReturnText

@app.route('/fetchTextAtIndex')
def fetchTextAtIndex():
    args = request.args
    name = args.get("name")
    playerLocation = args.get("playerLocation")
    textId = args.get("textId")
    index = args.get("index")
    cursor = config.conn.cursor()
    sql = f"select name from lairport where ident='{playerLocation}';"
    cursor.execute(sql)
    locationName = cursor.fetchall()
    returnText = Sanakirja(name, locationName[0][0]).returnTextAtIndex(textId, int(index))
    jsonReturnText = json.dumps(returnText, default=lambda o: o.__dict__, indent=4)
    return jsonReturnText

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
    nextDistance = args.get("nextdis")
    jsonData = flyToLairport(gameId, dest, int(nextDistance))
    return jsonData

@app.route('/sanakirja')
def sanakirja2():
   args = request.args
   name = args.get("name")
   loc = args.get("loc")
   jsonData = Sanakirja(name, loc)
   return jsonData

@app.route('/riddle')
def riddle():
    args = request.args
    name = args.get("name")
    loc = args.get("loc")
    shards = args.get("shards")
    if not shards:
        shards = None
    riddle = Sanakirja(name, loc).random_riddle(shards)
    jsonriddle = json.dumps(riddle)
    return jsonriddle

@app.route('/closest_weather')
def get_direction():
    args = request.args
    location = args.get("loc")  # oma sijainti
    targetweather = args.get("target")  # kohdesään numero
    jsonData = weathersearch.calculate_direction(location, targetweather)
    return jsonData

if __name__ == '__main__':
    app.run(use_reloader=True, host='127.0.0.1', port=3000)

