from geopy import distance
import func
import time
import OmatKoodit.sanakirja
import OmatKoodit.TeemuKoodiPeasantit

#asettaa staminan tietokantaan

def fetch_id(dragon_name):
    kursori = yhteys.cursor()
    kursori.execute(f"select id from game where dragon_name = '{dragon_name}';")
    idtuple = kursori.fetchone()
    id = idtuple[0]
    return id

def setstamina(stamina, id):
    kursori = yhteys.cursor()
    kursori.execute(f"update game set stamina_left = '{stamina}' where id = {id};")
    return

#asettaa tietokantaan nimen
def setdragonname(dragon_name, id):
    kursori = yhteys.cursor()
    kursori.execute(f"update game set dragon_name = '{dragon_name}' where id = {id};")
    return

#asettaa helsinkivantaalairin locationiksi
def go2helsinkivantaa(id):
    kursori = yhteys.cursor()
    kursori.execute(f"update game set location = 'EFHK' where id = {id};")
    return


#käyttäjälle säätilan valinta, vertaa sitä weather-arvoon, joka on riddlen oikea vastaus
#ja palauttaa valitun sään sekä booleanin True = oikein tai False = väärin
def choose_weather(weather):
    options = ["hot", "cold", "fog", "rain", "snow", "clear", "thunder", "windy"]
    while True:
        text = ("Hot or cold, rain or fog, windy or thunder, clear or snow,\n"
                    "Which of these weathers does the Dragonbound upon their Dragon bestow?\n")
        for c in text:
            print(c, end="")
            time.sleep(0.05)
        choice = input("==> ")
        if choice == weather:
            correct = True
            break
        elif choice not in options:
            text = ("The Dragonbound has faulted with their words,\n"
                  "Your Dragon must know the weather to fly you where that stirs.\n")
            for c in text:
                print(c, end="")
                time.sleep(0.05)
        else:
            correct = False
            break
    text = ("Your Dragon hears your words and ruffles its feathers,\n"
          "And senses five Lairs blessed with chosen weathers.\n\n")
    for c in text:
        print(c, end="")
        time.sleep(0.05)
    return choice, correct

#hakee tarvittavat viisi lairportia.
def fetch_lairports (weather, id):
    #alkuosio hakee randomlentokentät koordinaatteineen (sql1) ja tekee toisen listan pelkistä koordinaateista
    sql1 = f"select name, latitude_deg, longitude_deg from lairport where weather = '{weather}' order by rand() limit 5;"
    sql2 = f"select latitude_deg, longitude_deg from lairport, game where ident = location and id = {id};"
    kursori = yhteys.cursor()
    kursori.execute(sql1)
    airportslocs = kursori.fetchall()
    coordinates = []
    for airport in airportslocs:
        latlong = airport[1:]
        coordinates.append(latlong)

    #toinen osio hakee locationin koordinaatit (sql2), sekä luo listan etäisyyksistä
    kursori.execute(sql2)
    loc_coordinates = kursori.fetchall()
    distances = []
    for i in coordinates:
        km = int(distance.distance(i, loc_coordinates).km)
        distances.append(km)

    #kolmas osio luo tulostettavan listan lentokenttien nimistä ja etäisyyksistä, sekä korvaa airportit lairillä.
    lairports = [[tuple_item[0], distances[index]] for index, tuple_item in enumerate(airportslocs)]
    for i in range(len(lairports)):
        if "Air" in lairports[i][0]:
            lairports[i][0] = lairports[i][0].replace("Air","Lair")
    header = ["  | Lair of Choice", "Distance in KM"]
    lairports.insert(0, header)

    #taulukon muotoilu ja tulostus
    column_widths = [max(len(str(item)) for item in column) for column in zip(*lairports)]
    header = lairports[0]
    formatted_header = [str(item).ljust(width) for item, width in zip(header, column_widths)]
    print(" | ".join(formatted_header))
    separator = "".join("-" * (width + 1) for width in column_widths)
    print(separator)
    for index, row in enumerate(lairports[1:], start=1):
        formatted_row = [str(index).rjust(1)]
        formatted_row += [str(item).ljust(width) for item, width in zip(row, column_widths)]
        print(" | ".join(formatted_row))
    return lairports

#pelaaja valitsee aikaisemmassa funktiossa tulostetusta taulukosta lairin mihin lentää, ja funktio
#vähentää tai lisää staminaa databasessä riippuen oliko säätila-arvaus oikein. Jos valitsee rest,
#location ei muutu ja staminaa saa pienen määrän lisää.
def go2lairport(lairports, correct, id):
    kursori = yhteys.cursor()
    flew = True
    while True:
        text = ("Choose the number of your Lair or type REST ==> ")
        for c in text:
            print(c, end="")
            time.sleep(0.05)
        choice = input("")
        if choice.isnumeric():
            choice = int(choice)
            if 1<=choice<=5:
                text = (f"{lairports[choice][0]} chosen.\n")
                for c in text:
                    print(c, end="")
                    time.sleep(0.05)
                for i in range(len(lairports)):
                    if "Lair" in lairports[i][0]:
                        lairports[i][0] = lairports[i][0].replace("Lair", "Air")
                kursori.execute(f"select ident from lairport where name = '{lairports[choice][0]}';")
                newloc = kursori.fetchone()
                kursori.execute(f"update game set location = '{newloc[0]}';")
                if correct:
                    kursori.execute(f"update game set stamina_left = stamina_left + {lairports[choice][1]} where id = {id};")
                    text = OmatKoodit.sanakirja.sanakirja["correct"]
                    for c in text:
                        print(c, end="")
                        time.sleep(0.05)
                else:
                    kursori.execute(f"update game set stamina_left = stamina_left - {lairports[choice][1]} where id = {id};")
                    text = (f"Your choice made your Dragon grow weaker.\n")
                    for c in text:
                        print(c, end="")
                        time.sleep(0.05)
                break
        if choice == "REST" or choice == "rest":
            text = OmatKoodit.sanakirja.sanakirja["rest"]
            for c in text:
                print(c, end="")
                time.sleep(0.05)
            kursori.execute(f"update game set stamina_left = stamina_left + 500 where id = {id};")
            kursori.execute(f"select stamina_left from game where id = {id};")
            stamina = kursori.fetchone()
            flew = False
            OmatKoodit.TeemuKoodiPeasantit.danger(id)
            print(f"\nStamina: {stamina[0]}")
            break
        else:
            text = ("The Dragon looks at you with a baffled expression,\n"
                    "and telepathically tells you to pick a valid option.\n")
            for c in text:
                print(c, end="")
                time.sleep(0.05)
    return flew

yhteys = func.yhteys