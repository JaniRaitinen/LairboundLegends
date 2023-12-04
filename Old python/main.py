# Tuodaan Kaikista skripteistä toiminnot
import OmatKoodit.JaniKoodi
import OmatKoodit.SanteriKoodi
# import OmatKoodit.MiraKoodi
import OmatKoodit.TeemuKoodi
import OmatKoodit.TeemuKoodiPeasantit
import OmatKoodit.sanakirja
import func


def valitse_vaikeustaso():
	while True:
		try:
			OmatKoodit.JaniKoodi.letterbyletter(OmatKoodit.sanakirja.sanakirja["vaikeustaso1"])
			vaikeustaso = int(input(OmatKoodit.sanakirja.sanakirja["vaikeustaso2"]))
			if vaikeustaso in [1, 2, 3]:
				return {1: 8000, 2:  4000, 3: 1500}[vaikeustaso]
			else:
				print(OmatKoodit.sanakirja.sanakirja["error"])
		except ValueError:
			print(OmatKoodit.sanakirja.sanakirja["error"])


# Hallinnoi pelin lopettamista
gameOn = True

# Aloitus muuttujat
id = "1"

# Game Initialization
# Randomisoi jokaiseen suurelle lentokentälle oma säätila
# Täytyy asetta Heide SQL editorissa row laskenta DYNAMIC modelle.

OmatKoodit.JaniKoodi.printriviriviltään(OmatKoodit.JaniKoodi.showimage("alttitlescreen"), 0.1)
func.initrandSaatila()

# Aloitetaan pelin pyöritys
#Ensin katsotaan pelintila ja otetaan tietokannasta vanhoja tietoja.
#Tai aloitetaan uusi peli
while True:
	try:
		valinta = int(input(OmatKoodit.sanakirja.sanakirja["valintaruutu"]))
		if valinta == 1:
			# uusi peli
			OmatKoodit.JaniKoodi.printriviriviltään(OmatKoodit.JaniKoodi.showimage("linna1"), 0.05)
			OmatKoodit.JaniKoodi.letterbyletter(OmatKoodit.sanakirja.sanakirja["alkutarina"])
			input("\nTo Continue, Press 'Enter' ==>")

			OmatKoodit.JaniKoodi.printriviriviltään(OmatKoodit.JaniKoodi.showimage("lk1"), 0.05)
			OmatKoodit.JaniKoodi.letterbyletter((OmatKoodit.sanakirja.sanakirja["lohikaarmeen_nimeaminen"]))
			dragon_nimi = input("\nMy Dragon Will Be Known As ==>")
			OmatKoodit.SanteriKoodi.setdragonname(dragon_nimi, id)
			OmatKoodit.sanakirja.init_sanakirja()
			vaikeus = valitse_vaikeustaso()
			stamina = vaikeus
			OmatKoodit.SanteriKoodi.setstamina(stamina, id)
			OmatKoodit.SanteriKoodi.go2helsinkivantaa(id)
			remainingturns = 10
			break

		elif valinta == 2:  # korvataan tämä mirakoodilla
			old_game = False
			while old_game == False:
				username = input("Enter your dragon's name to continue:\n>")
				OmatKoodit.sanakirja.init_sanakirja()

				yhteys = func.yhteys
				kursori = yhteys.cursor()
				kursori.execute("SELECT stamina_left, name FROM game, lairport WHERE dragon_name = %s", (username,))
				tulos = kursori.fetchone()

				if tulos:
					old_game = True
					stamina, location = tulos
					print("Welcome back! Your dragon's stamina is: {} and your location is: {}".format(stamina, location))
					remainingturns = 10  # Tähän sql haku tilalle

					break

				else:
					print("Dragon name not found. Failed to load data.")
			break

		elif valinta == 3:
			# lopeta peli
			print(OmatKoodit.sanakirja.sanakirja["pelin_lopetus"])
			exit()

		else:
			# virheellinen syöte
			print(OmatKoodit.sanakirja.sanakirja["error"])

	except ValueError:
		# virheellinen syöte
		print(OmatKoodit.sanakirja.sanakirja["error"])
#Gameplay
while gameOn:
	if valinta == 1:
		# INTRO
		# Ohjelma käy tämän yhden kerran lävitse, koska tämä on intro
		OmatKoodit.sanakirja.init_sanakirja()
		OmatKoodit.JaniKoodi.letterbyletter(OmatKoodit.sanakirja.sanakirja["pelin_tila"])
		input("\nTo Continue, Press 'Enter' ==>")
		# Jos on uusipeli aloitetaan gameplay introlla
		OmatKoodit.JaniKoodi.printriviriviltään(OmatKoodit.JaniKoodi.showimage("gamestartscroll1"), 0.10)
		input("To Continue, Press 'Enter' ==>")
		# Lopuksi valinta = 2, jotta siirrytään main gameplay looppiin
		valinta = 2
	elif valinta == 2:
		# MAIN GAMEPLAY LOOP
		while int(remainingturns) > 0:
			OmatKoodit.sanakirja.init_sanakirja()
			remainingturns -= 1
			stamina = func.haestamina()
			# Jos stamina <= 0, hävitään peli
			if stamina <= 0:
				break
			elif remainingturns <= 3:
				# Mahdollisuus lopettaa peli
				print("")
				print(OmatKoodit.sanakirja.sanakirja["kotiin"])
				OmatKoodit.TeemuKoodi.endgame()
				OmatKoodit.TeemuKoodi.flyhome()
				break

			print(f"\nStamina: {func.haestamina()}")
			print(f"Location: {func.haelentokentännimi()}\n")
			# Vanhapeli tai uusipeli intron jälkeen
			# Pää gameplay looppi
			# Pelaajalle tiedotetaan hänen pelintilansa
			# Annetaan riddle pelaajalle
			print(OmatKoodit.sanakirja.sanakirja["pre_riddle"])
			weatherOn = OmatKoodit.TeemuKoodi.riddle()
			valittu_sää, correct = OmatKoodit.SanteriKoodi.choose_weather(weatherOn)
			lentokohteet = OmatKoodit.SanteriKoodi.fetch_lairports(valittu_sää, id)
			flew = False
			while not flew:
				flew = OmatKoodit.SanteriKoodi.go2lairport(lentokohteet, correct, id)
			# Toistetaan
		#Poistutaan Pelistä
		if remainingturns <= 0:
			OmatKoodit.sanakirja.init_sanakirja()
			print(OmatKoodit.sanakirja.sanakirja["no_turns"])
			exit()
		elif stamina <= 0:
			OmatKoodit.sanakirja.init_sanakirja()
			print(OmatKoodit.sanakirja.sanakirja["no_stamina"])
			exit()
		else:
			OmatKoodit.sanakirja.init_sanakirja()
			print("")
			print(OmatKoodit.sanakirja.sanakirja["back_home"])
			print("")
			print(OmatKoodit.sanakirja.sanakirja["scoring"])
			exit()

		break

# Tyhjennetään weather columni
func.poistaweather()
