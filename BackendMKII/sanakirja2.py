class Sanakirja:

    def __init__(self, name, loc):
        self.loc = loc
        self.name = name

    sanakirja2 = {
        "introLore": "Through a rift in time and space, you were transported to the fantastical world of Eldaria, "
                     "a world filled with dragons and elemental magic. Eldaria's scholars interpret this event as "
                     "the fulfillment of an ancient prophecy, designating you as the new Dragonbound, tasked with "
                     "raising the youth of the dragons, and quiding them through their journey to Dragonhood. The "
                     "Dracarers, who are the caretakers and guardians of the dragon hatchlings in Eldaria, "
                     "have decided that you will bond with one of their young Dragons, and together you will soar "
                     "to the skies of destiny.",
        "difficultySelection": "The Dracarers have always known that every young dragon is an individual, "
                               "and you will choose your companion from among the youth of the dragons.",
        "namingYourDragon": "The fate of the Dragonbound is to be as one with their dragon companion. It is "
                            "tradition in Eldaria, that upon embarking on their journey the Dragonbound will gift "
                            "their companion a name. The name of your dragon will echo through eternity with the "
                            "legends of your journey, so choose wisely. My dragon will be known as:",
        "gameOn": "As the Dragonbound, armed with knowledge from our Earth, you will embark on a magical journey with {"
                  "dragon_name}, your faithful dragon companion. Together you will face many challenges as you journey "
                  "towards the Dragonhood of {dragon_name}. The dragons of Eldaria are highly sensitive to the elements, "
                  "and they draw their power from Aetheral Tempests that are present throughout this world. The tempest "
                  "will manifest within patterns of the weather, and your dragon companion will have an innate sense of "
                  "the power they require to advance to their Dragonhood. It is the talent of the Dragonbound that you "
                  "have an understanding of the needs of your companion, and you will aspire to grow with your "
                  "companion.\nThe skies have darkened throughout Eldaria, and there is unrest among the people of the "
                  "land. There have been an uprise in anti-dragon movements, and the journeys of the Dragonbound are not "
                  "as safe anymore as they used to be. You’ll have to be careful to not attract the attention of the "
                  "so-called ”Dragonbane Coalition” who seek to end your journey to Dragonhood.",
        "riddleStarter": [f"{name} looks at you and says: ", f"Your companion talks to you: ",
                          f"You hear the words of {name} in your mind: ",
                          f"Through your bond, you feel you companions wishes: ",
                          f"{name} says: ", f"{name} demands your attention, and says: "],
        "riddle": {"1": ["In a place where cacti rise, My heart's true destination, can you trace?",
                         "Where the Phoenix's rebirth takes place, Name the realm where I seek my grace.",
                         "In deserts vast and skies so clear, Where do I dream of being, my dear?",
                         "In tropic lands, with mountains grand, Where do I long to make my stand?"],
                   "2": ["In the realm where shivers abound, Guess the place where my secrets are found.",
                         "In a place where breath turns to mist, The place of my dreams exist.",
                         "In a land where frosty whispers dwell, Name the realm where my stories do swell.",
                         "Where chilly winds weave tales untold, Discover the place where my mysteries unfold."],
                   "3": ["In this realm where sight is veiled, What's the land where secrets are often hailed?",
                         "Where the world is wrapped in a spectral haze, Guess the place where the unknown often plays.",
                         "In this shrouded domain where whispers cling, Name the place where obscurity takes its wing.",
                         "Where the air conceals what eyes can't see, What's the realm of enigma, can it be?"],
                   "4": ["Where skies weep their sorrow, I want to see a new tomorrow.",
                         "Invisible tears from heaven's face descend, Where am I, a mystery to comprehend?",
                         "In a domain where skies embrace gray, What's the realm where water holds sway?",
                         "In this corner of the world, where clouds convene, Guess the place where liquid curtains screen."],
                   "5": ["Where white blankets drape the earth's embrace, In this realm I’ll find my place.",
                         "Place of crystalline landscapes, pure and wide, Guess the realm where icy dreams reside.",
                         "In the silent sky, it gently cascades, What is this quiet white serenade?",
                         "In a world where cold slowly embraces the ground, Is the place where my dreams are found."],
                   "6": [
                       "Where azure stretches, free of clouds so wide, Where's the land where clear skies ever bide?",
                       "Beyond the horizon, no veil in sight, Name the realm where I take my flight.",
                       "In a realm pristine and pure, Where's the land where crystal clarity's the allure?",
                       "Where transparency is nature's grace, Show me the place where skies reveal their embrace."],
                   "7": ["Where heavenly anvils pound, My next destination will be found.",
                         "In the night’s dark canvas it briefly ignites, There I wish to take my next flight.",
                         "In this realm, heavenly veins do trace, Where's the land where light finds its space?",
                         "In a realm where the heavens growl and grow, Where's the place where sky's voice does bestow?"],
                   "8": [
                       "In this place where gales embrace the wide, Where's the realm where air, untamed, do ride?",
                       "In a place where nature's fury takes its course, Where's this land of tumultuous force?",
                       "Where the sky unleashes its fierce display, Where's the place where tempests have their say?",
                       "In this realm where zephyrs softly sway, Where's the land where breezes gently play?"]
                   },
        "lairportArrival": [f"You and {name} arrive at {loc}.",
                            f"As you descend from the skies, you arrive at {name}.",
                            f"Your journey takes you to {name}.",
                            f"After a long journey, you arrive at {loc}.",
                            f"You have arrived at you destination {loc}.",
                            f"{name} brought you to {loc}."],
        "rest": [f"You and {name} take a long rest to replenish your stamina.",
                 f"It is time for a little break. After the rest, you’re filled with fresh vigor, and are ready to "
                 f"continue your journey.",
                 f"You’re both worn down after a long journey, and decide to have a rest here.",
                 f"You’ve travelled far, and need a break to gather energy.",
                 f"You’ve been on the fly for a long time now, and it’s time to have a day off here.",
                 f"Everyone needs a break sometimes. After a short break you both feel your energy returning.",
                 f"The Dragon senses your fatigue and gives you time to ponder and recharges their stamina, so enjoy "
                 f"your slumber."],
        "attack": [f"The Dragonbane Coalition has caught rumors of your stay here.",
                   f"Your prolonged stay here has alerted the local spies of the Dragonbane Coalition.",
                   f"This town seems to have an active following of the Dragonbane Coalition.",
                   f"Operatives of the Dragonbane Coalition have been spotted lurking around the city.",
                   f"You heard rumors at the local tavern, that a unit of Dragonbane Coalition has been patrolling "
                   f"the town.",
                   f"While gathering supplies for your journey, you saw a member of Dragonbane Coalition asking for "
                   f"information about you."],
        "backHome": f"After long years travelling the world with your Dragon companion {name}, you’ve finally back at "
                    f"your home lair.\n"
                    f"You’ve both grown during your journeys, and have gained much wisdom and insight to the world of "
                    f"Eldaria.\n"
                    f"The Elder Dragonbound welcome you and your companion to ascend to the ranks of the Draconian "
                    f"Sentinels,"
                    f"an elite group of Dragon warriors,\n"
                    f"and your names are listed in The Chronicle of Legends, to be revered by those that aspire to Ascend "
                    f"in the future.",
        "endGame": f"The legacy of Eldoria will live on while you’re gone. "
                   f"Fates will see that you’ll still return to roam the skies with your faithful {name} and meet the "
                   f"destination of your journey.",
        "error": "You who seek options beyond those shown, nowhere shall be flown.\n"
    }

    def update_loc(self, loc):
        self.loc = loc
