import config
import sys
import mysql.connector


def start_new_game():
    # Alkutarinan tulostus. Pelaaja saa valita haluaako lukea koko tarinan vai skippaako sen.
    print_story()

    # Pyydetään pelaajaa nimeämään lohikäärmeensä.
    username = get_new_dragon_name()

    # Pelaaja valitsee vaikeustason. Staminan määrä alustetaan vaikeustasovalinnan perusteella,.
    stamina_level = choose_the_difficulty()

    # Tulostetaan peliohjeet
    print("As the Dragonbound, armed with knowledge from our Earth, you will embark on a magical journey\n"
          "with {dragon_name}, your faithful dragon companion. Together you will face many challenges as you\n"
          "journey towards the Dragonhood of {dragon_name}. The dragons of Eldaria are highly sensitive to the\n"
          "elements, and they draw their power from Aetheral Tempests that are present throughout this world.\n"
          "The tempest will manifest within patterns of the weather, and your dragon companion will have an\n"
          "innate sense of the power they require to advance to their Dragonhood. It is the talent of the\n"
          "Dragonbound that you have an understanding of the needs of your companion, and you will aspire to\n"
          "grow with your companion.\n\n"
          "The skies have darkened throughout Eldaria, and there is unrest among the people of the land. There\n"
          "have been an uprise in anti-dragon movements, and the journeys of the Dragonbound are not as safe\n"
          "anymore as they used to be. You’ll have to be careful to not attract the attention of the so-called\n"
          "”Dragonbane Coalition” who seek to end your journey to Dragonhood.")

    # Aloituspaikka on oletuksena EFHK
    starting_location = "EFHK"

    # Kierrosten määrä on oletuksena 10
    remaining_turns = 10

    # Tallennetaan käyttäjänimi, staminan määrä, aloitussijainti sekä kierrosmäärä tietokantaan.
    yhteys = mysql.connector.connect(
        host="localhost",
        user="root",
        password=config.pwd,
        database="dragon_game"
    )
    kursori = yhteys.cursor()
    kursori.execute("INSERT INTO game (dragon_name, stamina_left, location, remaining_turns) VALUES (%s, %s, %s, %s)",(username, stamina_level, starting_location, remaining_turns))
    yhteys.commit()
    yhteys.close()

    # Muutetaan muuttujat sanakirjaksi ja palautetaan pelissä käytettäväksi.
    palautettavat = {"dragon_name": username,
                     "stamina_left": stamina_level,
                     "location": starting_location,
                     "remaining_turns": remaining_turns
                     }
    return palautettavat


def load_old_game():

    # Tulostetaan peliohjeet vielä kerran kertauksen vuoksi. Pelaaja voi halutessaan skipata tämän.
    print_summary()

    while True:

        # Pyydetään pelaajaa syöttämään vanhan lohikäärmeensä nimen.
        username = input("Enter your dragon's name to continue:\n> ")

        # Haetaan tietokannasta nimen perusteella kierrosmäärä, stamina sekä sijainti.
        yhteys = mysql.connector.connect(
            host="localhost",
            user="root",
            password=config.pwd,
            database="dragon_game"
        )
        kursori = yhteys.cursor()
        kursori.execute("SELECT dragon_name, remaining_turns, stamina_left, location FROM game WHERE dragon_name = %s",(username,))
        tulos = kursori.fetchone()

        # Jos haku antaa tuloksen tulostetaan tervehdysviesti ja palautetaan tulos pääohjelmalle.
        if tulos:
            username, remaining_turns, stamina, location_name = tulos
            print(f"Welcome back!\n"
                  f"Your dragon {username} is ready to continue your adventure with {stamina} stamina left.\n"
                  f"Your adventure continues from {location_name}. You still have {remaining_turns} turns to use.")
            kursori.close()
            yhteys.close()
            return tulos

        # Jos nimeä ei löydy tietokannasta tulostetaan virheilmoitus ja pyydetään pelaajaa kokeilemaan toista nimeä.
        else:
            print("Dragon name not found. Please enter a valid name.")


def print_story():
    while True:

        # Tulostetaan pelin alussa alkutarina. Pelaaja saa halutessaan skipata tarinan.
        story_choice = validate_input(
            "Would you like to read the backround story?\n"
            "Press (1) if you want to read the story.\n"
            "Press (2) if you want to skip the story.\n"
            "Press (3) if you want to exit the game.\n> ",
            ["1", "2", "3"])

        if story_choice == "1":
            print("Through a rift in time and space, you were transported to the fantastical world of Eldaria, a\n"
                  "world filled with dragons and elemental magic. Eldaria's scholars interpret this event as the\n"
                  "fulfillment of an ancient prophecy, designating you as the new Dragonbound, tasked with raising\n"
                  "the youth of the dragons,and quiding them through their journey to Dragonhood. The Dracarers, who\n"
                  "are the caretakers and guardians of the dragon hatchlings in Eldaria, have decided that you will\n"
                  "bond with one of their young Dragons, and together you will soar to the skies of destiny.")
            break

        elif story_choice == "2":
            break

        elif story_choice == "3":
            print("Good Riddance!")
            sys.exit()

    return


def get_new_dragon_name():

    # Tulostetaan pieni pohjustustarina ennen lohikäärmeen nimeämistä. Jätetään tämä loopin ulkopuolelle.
    print("The fate of the Dragonbound is to be as one with their dragon companion. It is tradition in Eldaria,\n"
          "that upon embarking on their journey the Dragonbound will gift their companion a name. The name of your\n"
          "dragon will echo through eternity with the legends of your journey, so choose wisely.")

    while True:
        # Pyydetään käyttäjää nimeämään lohikäärmeensä.
        username = input("My dragon will be known as:\n> ")

        # Tarkistetaan ettei samalla nimellä olevaa lohikäärmettä ole jo tallennettuna tietokantaan.
        yhteys = mysql.connector.connect(
            host="localhost",
            user="root",
            password=config.pwd,
            database="dragon_game"
        )
        kursori = yhteys.cursor()
        kursori.execute("SELECT dragon_name FROM game WHERE dragon_name = %s", (username,))
        tulos = kursori.fetchone()

        # Jos tietokannasta löytyy jo sama nimi pyydetään pelaajaa syöttämään uusi nimi.
        if tulos:
            print("Dragon names must be unique. Another dragon already bears this name. Please come up with another name.")

        else:
            break

    # Jos nimi on uniikki, palautetaan se.
    return username


def choose_the_difficulty():

    # Tulostetaan pieni pohjustustarina ennen vaikeustason valintaa. Jätetään loopin ulkopuolelle.
    print("The Dracarers have always known that every young dragon is an individual, and you will choose your\n"
          "companion from among the youth of the dragons.")

    while True:
        difficulty = validate_input("What kind of dragon will you choose?\n"
                                    "Tame\t\t\tPress 1\n"
                                    "A Bit Rowdy\t\tPress 2\n"
                                    "Feisty\t\t\tPress 3\n"
                                    "Exit game\t\tPress 4\n"
                                    "> ", ["1", "2", "3", "4"])

        # Alustetaan stamina valitun vaikeustason perusteella.
        if difficulty == "1":
            stamina_level = 1000
            break
        elif difficulty == "2":
            stamina_level = 750
            break
        elif difficulty == "3":
            stamina_level = 500
            break
        elif difficulty == "4":
            print("Good Riddance!")
            sys.exit()
        else:
            print("You have faulted with your words. Try again.")

    # Palautetaan stamina.
    return stamina_level


def print_summary():
    while True:

        # Pelaaja saa valita haluaako hän lukea ohjeet vielä kerran ennen vanhan pelin jatkamista.
        summary_choice = validate_input("Do you want to review your mission before continuing your adventure?\n"
                                            "Press (1) if you want to read the instructions.\n"
                                            "Press (2) if you want to skip the instuctions.\n"
                                            "Press (3) if you want to exit the game.\n"
                                            "> ", ["1", "2", "3"])

        if summary_choice == "1":
            print("Greetings, brave traveler! You've embarked on an adventure in Eldoria and discovered a\n"
                      "dragon's egg. Your goal is to raise the dragon within. The game spans ten turns, with the\n"
                      "aim of returning to the starting point. Each turn begins with a riddle from your dragon\n"
                      "companion to determine the preferred weather. You'll then choose the weather condition you\n"
                      "think your dragon prefers. If you successfully reach your chosen airport and match the\n"
                      "weather preference, your dragon's stamina increases by the distance traveled; otherwise,\n"
                      "it decreases. Best of luck on your journey!")
            break

        if summary_choice == "2":
            break

        elif summary_choice == "3":
            print("Good Riddance!")
            sys.exit()

    return


def validate_input(prompt, valid_options):
    # Tällä funktiolla tarkastetaan syötteen oikeellisuus.
    while True:
        choice = input(prompt)
        if choice in valid_options:
            return choice
        else:
            print("You have faulted with your words. Try again.")


# START MENU
def main_menu():
    try:
        choice = validate_input("How do you want to proceed?\n"
                                "Press (1) to start a new adventure.\n"
                                "Press (2) to continue with your previous dragon.\n"
                                "Press (3) to exit game.\n"
                                "> ", ["1", "2", "3"])
        if choice == "1":
            muuttujat = start_new_game()
            return muuttujat
        elif choice == "2":
            muuttujat = load_old_game()
            return muuttujat
        elif choice == "3":
            print("Good Riddance!")

    except ValueError:
        print("You have faulted with your words. Try again.")

    except mysql.connector.Error as e:
        print(f"Error in database query: {e}")


if __name__ == "__main__":
    # Tämä osio suoritetaan vain silloin kun ohjelma ajetaan mainina. Tämä on siis vain testikäyttöä varten.
    main_menu()
