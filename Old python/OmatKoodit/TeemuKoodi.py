import random
from geopy import distance

import OmatKoodit.JaniKoodi
import func
import time

weather = "0"


# TÄMÄ PRINTTAA RIDDLEN JA VAIHTAA WEATHER-MUUTTUJAN SEN MUKAAN.

def riddle():

    weather = "0"

    riddle_hot = ("In a place where cacti rise, My heart's true destination, can you trace?",
                  "Where the Phoenix's rebirth takes place, Name the realm where I seek my grace.",
                  "In deserts vast and skies so clear, Where do I dream of being, my dear?",
                  "In tropic lands, with mountains grand, Where do I long to make my stand?")
    riddle_cold = ("In the realm where shivers abound, Guess the place where my secrets are found.",
                   "In a place where breath turns to mist, The place of my dreams exist.",
                   "In a land where frosty whispers dwell, Name the realm where my stories do swell.",
                   "Where chilly winds weave tales untold, Discover the place where my mysteries unfold.")
    riddle_fog = ("In this realm where sight is veiled, What's the land where secrets are often hailed?",
                  "Where the world is wrapped in a spectral haze, Guess the place where the unknown often plays.",
                  "In this shrouded domain where whispers cling, Name the place where obscurity takes its wing.",
                  "Where the air conceals what eyes can't see, What's the realm of enigma, can it be?")
    riddle_rain = ("Where skies weep their sorrow, I want to see a new tomorrow.",
                   "Invisible tears from heaven's face descend, Where am I, a mystery to comprehend?",
                   "In a domain where skies embrace gray, What's the realm where water holds sway?",
                   "In this corner of the world, where clouds convene, Guess the place where liquid curtains screen.")
    riddle_snow = ("Where white blankets drape the earth's embrace, In this realm I’ll find my place.",
                   "Place of crystalline landscapes, pure and wide, Guess the realm where icy dreams reside.",
                   "In the silent sky, it gently cascades, What is this quiet white serenade?",
                   "In a world where cold slowly embraces the ground, Is the place where my dreams are found.")
    riddle_clear = ("Where azure stretches, free of clouds so wide, Where's the land where clear skies ever bide?",
                    "Beyond the horizon, no veil in sight, Name the realm where I take my flight.",
                    "In a realm pristine and pure, Where's the land where crystal clarity's the allure?",
                    "Where transparency is nature's grace, Show me the place where skies reveal their embrace.")
    riddle_thunder = ("Where heavenly anvils pound, My next destination will be found.",
                      "In the night’s dark canvas it briefly ignites, There I wish to take my next flight.",
                      "In this realm, heavenly veins do trace, Where's the land where light finds its space?",
                      "In a realm where the heavens growl and grow, Where's the place where sky's voice does bestow?")
    riddle_windy = ("In this place where gales embrace the wide, Where's the realm where air, untamed, do ride?",
                    "In a place where nature's fury takes its course, Where's this land of tumultuous force?",
                    "Where the sky unleashes its fierce display, Where's the place where tempests have their say?",
                    "In this realm where zephyrs softly sway, Where's the land where breezes gently play?")

    print("")
    lohi_vari = random.randint(1, 8)

    if lohi_vari == 1:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_hot[random.randint(0,3)])
        weather = "hot"
    elif lohi_vari == 2:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_cold[random.randint(0,3)])
        weather = "cold"
    elif lohi_vari == 3:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_fog[random.randint(0,3)])
        weather = "fog"
    elif lohi_vari == 4:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_rain[random.randint(0,3)])
        weather = "rain"
    elif lohi_vari == 5:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_snow[random.randint(0,3)])
        weather = "snow"
    elif lohi_vari == 6:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_clear[random.randint(0,3)])
        weather = "clear"
    elif lohi_vari == 7:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_thunder[random.randint(0,3)])
        weather = "thunder"
    elif lohi_vari == 8:
        OmatKoodit.JaniKoodi.letterbyletter(riddle_windy[random.randint(0,3)])
        weather = "windy"

    print("")

    return weather

# JA AJETAAN TÄLLÄ:
# weather = riddle()


# TÄST ALASPÄIN ON VAA TESTAILUUN :)
#  test_arvaus = input("What is the weather that your dragon seeks? ")

#  while test_arvaus != weather:
#    print("Wrong answer.")
#    test_arvaus = input("What is the weather that your dragon seeks? ")

#  print("Correct answer!")

def endgame():

    # Hakee HKI-Vantaan koordinaatit
    sql = f"select name, latitude_deg, longitude_deg from lairport WHERE ident = 'EFHK'"
    kursori = func.yhteys.cursor()
    kursori.execute(sql)
    airportslocs = kursori.fetchall()
    coordinates = []
    for airport in airportslocs:
        latlong = airport[1:]
        coordinates.append(latlong)

    # Hakee nykysijainnin koordinaatit ja luo listan etäisyyksistä
    sql = f"select latitude_deg, longitude_deg from lairport, game where ident = location and id = 1;"
    kursori = func.yhteys.cursor()
    kursori.execute(sql)
    loc_coordinates = kursori.fetchall()
    distances = []
    for i in coordinates:
        km = int(distance.distance(i, loc_coordinates).km)
        distances.append(km)

    # Tulostaa kohteen tiedot listamuodossa:
    lairports = [[tuple_item[0], distances[index]] for index, tuple_item in enumerate(airportslocs)]
    for i in range(len(lairports)):
        if "Air" in lairports[i][0]:
            lairports[i][0] = lairports[i][0].replace("Air", "Lair")
    header = ["  | Lair of Choice", "Distance in KM"]
    lairports.insert(0, header)

    # taulukon muotoilu ja tulostus
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

    print("")

def flyhome():
    kursori = func.yhteys.cursor()
    choice = 0
    while choice != 1 or 2:
        text = ("If you wish to head to homelair, type 1. If you wish to continue your journey a little further, type 2.\n")
        for c in text:
            print(c, end="")
            time.sleep(0.05)
        choice = input("")
        if choice.isnumeric():
            choice = int(choice)
            if choice == 1:
                text = (f"Helsinki-Vantaa Lairport chosen.\n")
                for c in text:
                    print(c, end="")
                    time.sleep(0.05)

                kursori.execute(f"update game set location = 'EFHK';")

                sql = f"select latitude_deg, longitude_deg from lairport, game where ident = location and id = 1;"
                kursori = func.yhteys.cursor()
                kursori.execute(sql)
                loc_deg = kursori.fetchall()

                sql = f"select latitude_deg, longitude_deg from lairport WHERE ident = 'EFHK'"
                kursori = func.yhteys.cursor()
                kursori.execute(sql)
                hki_deg = kursori.fetchall()


                journey = distance.distance(loc_deg, hki_deg).km

                kursori.execute(f"update game set stamina_left = stamina_left - {journey};")

                break

            elif choice == 2:
                break
        else:
            text = ("The Dragon looks at you with a baffled expression,\n"
                    "and telepathically tells you to pick a valid option.")
            for c in text:
                print(c, end="")
                time.sleep(0.05)
    print("")

