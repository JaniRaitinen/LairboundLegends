import random
import func

yhteys = func.yhteys

# nimen haku:
def nimi():
    sql = f"select dragon_name from game where id = 1;"
    kursori = yhteys.cursor(buffered=True)
    kursori.execute(sql)
    dragon_name = kursori.fetchone()
    nimi = str(dragon_name[0])

    return nimi

#  staminan haku
def pisteet():
    sql = f"select stamina_left from game where id = 1;"
    kursori = yhteys.cursor(buffered=True)
    kursori.execute(sql)
    stamina = kursori.fetchone()
    pisteet = int(stamina[0])

    return pisteet

#  sijainnin haku
def sijainti():
    sql = f"select location from game where id = 1;"
    kursori = yhteys.cursor(buffered=True)
    kursori.execute(sql)
    location_name = kursori.fetchone()
    sijainti = str(location_name[0])

    return sijainti

def init_sanakirja():
    sanakirja["pelin_nimi"] = " ~~~~~ Dungeons & Dragons ~~~~~ "
    sanakirja["valintaruutu"] = (
        "New Game\t\t\t\tPress 1\nContinue Old Save\t\tPress 2\nQuit\t\t\t\t\tPress 3\n==> ")

    # alkulore, ennen loharin luomista
    sanakirja["alkutarina"] = (
        "Through a rift in time and space, you were transported to the fantastical world of Eldaria, a world filled with dragons and elemental magic.\n"
        "Eldaria's scholars interpret this event as the fulfillment of an ancient prophecy, designating you as the new Dragonbound,\n"
        "tasked with raising the youth of the dragons, and quiding them through their journey to Dragonhood.\n"
        "The Dracarers, who are the caretakers and guardians of the dragon hatchlings in Eldaria, have decided that you will bond with one of their young Dragons,\n"
        "and together you will soar to the skies of destiny.")

    # vaikeusasteen valinta
    sanakirja[
        "vaikeustaso1"] = "The Dracarers have always known that every young dragon is an individual, and you will choose your companion from among the youth of the dragons.\n"
    sanakirja[
        "vaikeustaso2"] = "~ Choose Your Difficulty ~\nTame\t\t\tPress 1\nA Bit Rowdy\t\tPress 2\nFeisty\t\t\tPress 3\n==> "

    # nimen valinta
    sanakirja["lohikaarmeen_nimeaminen"] = ("The fate of the Dragonbound is to be as one with their dragon companion.\n"
                                            "It is tradition in Eldaria, that upon embarking on their journey the Dragonbound will gift their companion a name.\n"
                                            "The name of your dragon will echo through eternity with the legends of your journey, so choose wisely.\n")

    # alkulore loharin luomisen jälkeen
    sanakirja["pelin_tila"] = (
        f"As the Dragonbound, armed with knowledge from our Earth, you will embark on a magical journey with {nimi()}, your faithful dragon companion.\n"
        f"Together you will face many challenges as you journey towards the Dragonhood of {nimi()}.\n"
        f"The dragons of Eldaria are highly sensitive to the elements, and they draw their power from Aetheral Tempests that are present throughout this world.\n"
        f"These tempests will manifest within patterns of the weather, and your dragon companion will have an innate sense of the power they require to advance to their Dragonhood.\n"
        f"It is the talent of the Dragonbound that you have an understanding of the needs of your companion, and you will aspire to grow with your companion.\n"
        f"The skies have darkened throughout Eldaria, and there is unrest among the people of the land.\n\n"
        f"There have been an uprise in anti-dragon movements, and the journeys of the Dragonbound are not as safe anymore as they used to be.\n"
        f"You’ll have to be careful to not attract the attention of the so-called ”Dragonbane Coalition” who seek to end your journey to Dragonhood.")

    # ennen riddleä printattava
    pre_riddle_list = [f"{nimi()} looks at you and says: ", f"Your companion talks to you: ",
                       f"You hear the words of {nimi()} in your mind: ",
                       f"Through your bond, you feel you companions wishes: ",
                       f"{nimi()} says: ", f"{nimi()} demands your attention, and says: "]

    sanakirja["pre_riddle"] = random.choice(pre_riddle_list)

    #  kun saavutaan kentälle:
    arrive_list = [f"You and {nimi()} arrive at {sijainti()}.",
                   f"As you descend from the skies, you arrive at {sijainti()}.",
                   f"Your journey takes you to {sijainti()}.",
                   f"After a long journey, you arrive at {sijainti()}.",
                   f"You have arrived at you destination {sijainti()}.",
                   f"{nimi()} brought you to {sijainti()}."]

    sanakirja["arrive"] = random.choice(arrive_list)

    #  saapuminen oikealle kentälle:
    correct_list = [
        f"You feel a change in the energy around you and see that {nimi()} is feeding on the energy currents around you, and is growing stronger.",
        f"You see that {nimi()} has aligned with the energy around you. {nimi()} has grown stronger!",
        f"{nimi()} is basking in the energy radiating from the local climate, and you see them growing stronger!",
        f"The weather here radiates a mystical power that you can feel aligning with your companion. {nimi()} is now stronger than ever!",
        f"The Aetheral Tempest here radiates with energy, and even you can feel the strength growing in your companion!)"]

    sanakirja["correct"] = random.choice(correct_list)

    #  restatessa:
    rest_list = [f"You and {nimi()} take a long rest to replenish your stamina.",
                 f"It is time for a little break. After the rest, you’re filled with fresh vigor, and are ready to continue your journey.",
                 f"You’re both worn down after a long journey, and decide to have a rest here.",
                 f"You’ve travelled far, and need a break to gather energy.",
                 f"You’ve been on the fly for a long time now, and it’s time to have a day off here.",
                 f"Everyone needs a break sometimes. After a short break you both feel your energy returning.",
                 f"The Dragon senses your fatigue and gives you time to ponder and recharges their stamina, so enjoy your slumber."]

    sanakirja["rest"] = random.choice(rest_list)

    #  Hyökkäys tulossa:

    attack_list = [f"The Dragonbane Coalition has caught rumors of your stay here.",
                   f"Your prolonged stay here has alerted the local spies of the Dragonbane Coalition.",
                   f"This town seems to have an active following of the Dragonbane Coalition.",
                   f"Operatives of the Dragonbane Coalition have been spotted lurking around the city.",
                   f"You heard rumors at the local tavern, that a unit of Dragonbane Coalition has been patrolling the town.",
                   f"While gathering supplies for your journey, you saw a member of Dragonbane Coalition asking for information about you."]

    sanakirja["attack"] = (f"{random.choice(attack_list)}\n"
                           f"If you stay here any longer, The Dragonbane Coalition will catch you and end your journey. You’ll need to move to a new destination.")

    # Pelin loppumiset:

    sanakirja["doom"] = ("The Dragonbane Coalition has caught you! Your journey ends here.")
    sanakirja["no_stamina"] = (
        f"{nimi()} has run out of energy to continue. You didn’t reach your destination, and your journey ends here.")
    sanakirja["no_turns"] = (
        "Your journey has taken too long, and there is no escape from the Dragonbane Coalition. Your journey ends here.")

    sanakirja["kotiin"] = ("Our journeys have brought us far and wide and in my strenght I have grown fair. \nWith my Dragonbound friend by my side, let us head back to Homelair.\n")

    sanakirja["back_home"] = (
        f"After long years travelling the world with your Dragon companion {nimi()}, you’ve finally back at your home lair.\n"
        f"You’ve both grown during your journeys, and have gained much wisdom and insight to the world of Eldaria.\n"
        f"The Elder Dragonbound welcome you and your companion to ascend to the ranks of the Draconian Sentinels, an elite group of Dragon warriors,\n"
        f"and your names are listed in The Chronicle of Legends, to be revered by those that aspire to Ascend in the future.")

    sanakirja["scoring"] = (
        f"Initiation to the ranks of the Draconian Sentinels is a holy ceremony, where your accomplishments are recorded to the Chonicle of Legends.\n"
        f"This is a rare event, that gathers masses of spectators, and you and {nimi()} get to bask in the glory of your accomplisments.\n"
        f"Your data recorded in the Chronicle is as follows: \n\n"
        f"{nimi()} has grown in strength and will, and is awarded with {pisteet()} points of Draconian Honor.")

    sanakirja["pelin_lopetus"] = (f"The legacy of Eldoria will live on while you’re gone. "
                                  f"Fates will see that you’ll still return to roam the skies with your faithful {nimi()} and meet the destination of your journey.")

    sanakirja["error"] = f"You who seek options beyond those shown, nowhere shall be flown.\n"




# Sanakirja

sanakirja = {}
sanakirja["pelin_nimi"] = " ~~~~~ Dungeons & Dragons ~~~~~ "
sanakirja["valintaruutu"] = ("New Game\t\t\t\tPress 1\nContinue Old Save\t\tPress 2\nQuit\t\t\t\t\tPress 3\n==> ")

# alkulore, ennen loharin luomista
sanakirja["alkutarina"] = ("Through a rift in time and space, you were transported to the fantastical world of Eldaria, a world filled with dragons and elemental magic.\n"
                           "Eldaria's scholars interpret this event as the fulfillment of an ancient prophecy, designating you as the new Dragonbound,\n"
                           "tasked with raising the youth of the dragons, and quiding them through their journey to Dragonhood.\n"
                           "The Dracarers, who are the caretakers and guardians of the dragon hatchlings in Eldaria, have decided that you will bond with one of their young Dragons,\n"
                           "and together you will soar to the skies of destiny.")

# vaikeusasteen valinta
sanakirja["vaikeustaso1"] = "The Dracarers have always known that every young dragon is an individual, and you will choose your companion from among the youth of the dragons.\n"
sanakirja["vaikeustaso2"] = "~ Choose Your Difficulty ~\nTame\t\t\tPress 1\nA Bit Rowdy\t\tPress 2\nFeisty\t\t\tPress 3\n==> "

# nimen valinta
sanakirja["lohikaarmeen_nimeaminen"] = ("The fate of the Dragonbound is to be as one with their dragon companion.\n"
                                        "It is tradition in Eldaria, that upon embarking on their journey the Dragonbound will gift their companion a name.\n"
                                        "The name of your dragon will echo through eternity with the legends of your journey, so choose wisely.\n")

# alkulore loharin luomisen jälkeen
sanakirja["pelin_tila"] = (f"As the Dragonbound, armed with knowledge from our Earth, you will embark on a magical journey with {nimi()}, your faithful dragon companion.\n"
                           f"Together you will face many challenges as you journey towards the Dragonhood of {nimi()}.\n"
                           f"The dragons of Eldaria are highly sensitive to the elements, and they draw their power from Aetheral Tempests that are present throughout this world.\n"
                           f"These tempests will manifest within patterns of the weather, and your dragon companion will have an innate sense of the power they require to advance to their Dragonhood.\n"
                           f"It is the talent of the Dragonbound that you have an understanding of the needs of your companion, and you will aspire to grow with your companion.\n"
                           f"The skies have darkened throughout Eldaria, and there is unrest among the people of the land.\n\n"
                           f"There have been an uprise in anti-dragon movements, and the journeys of the Dragonbound are not as safe anymore as they used to be.\n"
                           f"You’ll have to be careful to not attract the attention of the so-called ”Dragonbane Coalition” who seek to end your journey to Dragonhood.")

# ennen riddleä printattava
pre_riddle_list = [f"{nimi()} looks at you and says: ", f"Your companion talks to you: ",
                   f"You hear the words of {nimi()} in your mind: ", f"Through your bond, you feel you companions wishes: ",
                   f"{nimi()} says: ", f"{nimi()} demands your attention, and says: "]

sanakirja["pre_riddle"] = random.choice(pre_riddle_list)

#  kun saavutaan kentälle:
arrive_list = [f"You and {nimi()} arrive at {sijainti()}.",
                            f"As you descend from the skies, you arrive at {sijainti()}.",
                            f"Your journey takes you to {sijainti()}.",
                            f"After a long journey, you arrive at {sijainti()}.",
                            f"You have arrived at you destination {sijainti()}.",
                            f"{nimi()} brought you to {sijainti()}."]

sanakirja["arrive"] = random.choice(arrive_list)

#  saapuminen oikealle kentälle:
correct_list = [f"You feel a change in the energy around you and see that {nimi()} is feeding on the energy currents around you, and is growing stronger.",
                             f"You see that {nimi()} has aligned with the energy around you. {nimi()} has grown stronger!",
                             f"{nimi()} is basking in the energy radiating from the local climate, and you see them growing stronger!",
                             f"The weather here radiates a mystical power that you can feel aligning with your companion. {nimi()} is now stronger than ever!",
                             f"The Aetheral Tempest here radiates with energy, and even you can feel the strength growing in your companion!)"]

sanakirja["correct"] = random.choice(correct_list)

#  restatessa:
rest_list = [f"You and {nimi()} take a long rest to replenish your stamina.",
                          f"It is time for a little break. After the rest, you’re filled with fresh vigor, and are ready to continue your journey.",
                          f"You’re both worn down after a long journey, and decide to have a rest here.",
                          f"You’ve travelled far, and need a break to gather energy.",
                          f"You’ve been on the fly for a long time now, and it’s time to have a day off here.",
                          f"Everyone needs a break sometimes. After a short break you both feel your energy returning.",
                        f"The Dragon senses your fatigue and gives you time to ponder and recharges their stamina, so enjoy your slumber."]

sanakirja["rest"] = random.choice(rest_list)

#  Hyökkäys tulossa:

attack_list = [f"The Dragonbane Coalition has caught rumors of your stay here.",
                            f"Your prolonged stay here has alerted the local spies of the Dragonbane Coalition.",
                            f"This town seems to have an active following of the Dragonbane Coalition.",
                            f"Operatives of the Dragonbane Coalition have been spotted lurking around the city.",
                            f"You heard rumors at the local tavern, that a unit of Dragonbane Coalition has been patrolling the town.",
                            f"While gathering supplies for your journey, you saw a member of Dragonbane Coalition asking for information about you."]

sanakirja["attack"] = (f"{random.choice(attack_list)}\n"
                       f"If you stay here any longer, The Dragonbane Coalition will catch you and end your journey. You’ll need to move to a new destination.")

# Pelin loppumiset:

sanakirja["doom"] = ("The Dragonbane Coalition has caught you! Your journey ends here.")
sanakirja["no_stamina"] = (f"{nimi()} has run out of energy to continue. You didn’t reach your destination, and your journey ends here.")
sanakirja["no_turns"] = ("Your journey has taken too long, and there is no escape from the Dragonbane Coalition. Your journey ends here.")

sanakirja["kotiin"] = ("Our journeys have brought us far and wide and in my strenght I have grown fair. \nWith my Dragonbound friend by my side, let us head back to Homelair.\n")

sanakirja["back_home"] = (f"After long years travelling the world with your Dragon companion {nimi()}, you’ve finally back at your home lair.\n"
                          f"You’ve both grown during your journeys, and have gained much wisdom and insight to the world of Eldaria.\n"
                          f"The Elder Dragonbound welcome you and your companion to ascend to the ranks of the Draconian Sentinels, an elite group of Dragon warriors,\n"
                          f"and your names are listed in The Chronicle of Legends, to be revered by those that aspire to Ascend in the future.")

sanakirja["scoring"] = (f"Initiation to the ranks of the Draconian Sentinels is a holy ceremony, where your accomplishments are recorded to the Chonicle of Legends.\n"
                        f"This is a rare event, that gathers masses of spectators, and you and {nimi()} get to bask in the glory of your accomplisments.\n"
                        f"Your data recorded in the Chronicle is as follows: \n\n"
                        f"{nimi()} has grown in strength and will, and is awarded with {pisteet()} points of Draconian Honor.")

sanakirja["pelin_lopetus"] = (f"The legacy of Eldoria will live on while you’re gone. "
                              f"Fates will see that you’ll still return to roam the skies with your faithful {nimi()} and meet the destination of your journey.")

sanakirja["error"] = "You who seek options beyond those shown, nowhere shall be flown."