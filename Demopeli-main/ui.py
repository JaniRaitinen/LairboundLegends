import requests
import config

def output_status(json):
    print ("================================================")
    print ("Trip ID    : " + json["status"]["id"])
    print ("Pilot      : " + json["status"]["name"])
    print ("Footprint  : " + str(json["status"]["co2"]))
    print ("Location   : " + json["location"][0]["ident"] + " - " + json["location"][0]["name"])
    print ("Link       : https://www.openstreetmap.org/#map=8/" + str(json["location"][0]["latitude"]) + "/" + str(json["location"][0]["longitude"]))
    print ("------------------------------------------------")
    print ("Weather    : " + json["location"][0]["weather"]["main"])
    print ("Temperature: " + str(json["location"][0]["weather"]["temp"]) + "'C")
    print ("Humidity   : " + str(json["location"][0]["weather"]["humidity"]))
    print ("Wind speed : " + str(json["location"][0]["weather"]["wind"]["speed"]))

    goals_met = json["location"][0]["weather"]["meets_goals"]
    for a in goals_met:
        print ("---> This weather meets a goal: " + str(a))

    print("------------------------------------------------")
    print("Weather goals:")
    goals = json["goals"]
    for a in goals:
        print (str(a["goal_id"]) + " " + a["name"] + " " + a["description"] + " " + str(a["reached"]))


    print("------------------------------------------------")
    print ("Nearby:")

    for a in json["location"]:
        if not a["active"]:
            print (a["ident"] + " - " + a["name"] + " " + str(a["distance"]) + " " + str(a["co2_consumption"]))

    print ("================================================")
    return



name = input("Enter your name (default=" + config.default_name + "): ")
if (name==""):
    name = config.default_name
initial_airport = input("Enter initial airport (default="+ config.default_starting_point + "): ")
if (initial_airport==""):
    initial_airport = config.default_starting_point

# http://127.0.0.1:5000/newgame?loc=EFKE&player=Urpopekka
request = "http://127.0.0.1:5000/newgame?loc=" + initial_airport + "&player=" + name

while True:
    print (request)
    response = requests.get(request).json()
    print(response)

    output_status(response)

    default_destination = response["location"][1]["ident"]
    destination = input("Enter next destination or 'q' to quit (default=" + default_destination + "): ")
    if destination=="":
        destination = default_destination
    elif destination=="q":
        quit()
    print ("Generating flight plan to " + destination)

    # http://127.0.0.1:5000/flyto?game=p5eiPgQPT9jbIt1TlqzH&dest=EFHK
    request = "http://127.0.0.1:5000/flyto?game=" + response["status"]["id"] + "&dest=" + destination

