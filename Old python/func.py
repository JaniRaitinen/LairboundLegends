import random
import mysql.connector
import config

# Paikalliset muuttujat Funktioiden toimintaan
saatilat = ("hot", "cold", "fog", "rain", "snow", "clear", "thunder", "windy")

# SQL koodi toimii Clientissä, mutta ei python skriptissä. Jotain vikana.
def initrandSaatila():
    #sql = "alter table dragon_game.lairport add weather varchar(12);"
    #kursor_one = yhteys.cursor()
    #kursor_one.execute(sql)

    for i in range(0, 450):
        randsaatila = random.choice(saatilat)
        # Asetetaan Satunnaisia Säätiloja
        sql = ("update lairport set weather ='"
               + randsaatila + "'"
               + "order by rand()"
               + "limit 1;")
        kursor_two = yhteys.cursor()
        kursor_two.execute(sql)
    # Laitetaan Loput Tyhjät johonkin säätilaan
    sql = ("update lairport set weather ='"
           + randsaatila + "'"
           + "where weather is null")
    kursor_two = yhteys.cursor()
    kursor_two.execute(sql)
    return

def poistaweather():
    sql = "UPDATE lairport set weather = NULL"
    kursor_two = yhteys.cursor()
    kursor_two.execute(sql)
    return

def haestamina(id=1):
    sql = f"select stamina_left from game where id = {id};"
    kursor = yhteys.cursor()
    kursor.execute(sql)
    tulos = kursor.fetchone()
    return tulos[0]

def haelentokentännimi(id=1):
    sql = f"select lairport.name from lairport, game where lairport.ident = game.location and game.id = {id};"
    kursor = yhteys.cursor()
    kursor.execute(sql)
    tulos = kursor.fetchone()
    return tulos[0]

# Yhteys Tietokantaan - Tällä Hetkellä toimii vain janin tietokannassa
yhteys = mysql.connector.Connect(
    host="127.0.0.1",
    port=3306,
    database="dragon_game",
    user="root",
    password=config.pwd,
    autocommit=True
    )

def former_dragons():
    sql = "select distinct dragon_name from game;"
    kursor = yhteys.cursor()
    kursor.execute(sql)
    tulos = kursor.fetchall()
    return tulos