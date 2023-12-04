import random
import OmatKoodit.sanakirja
import func
import OmatKoodit.JaniKoodi

yhteys = func.yhteys

# Peasant attack chancea ja restiä uudelleentehtynä


def danger(id):
    # dangerin initialisointi

    sql = f"select danger_local from danger_local where ident = (select location from game where id = {id}) and id = {id};"
    kursori = yhteys.cursor()
    kursori.execute(sql)
    juuh = kursori.fetchall()
    if not juuh:
        sql = f"insert into danger_local(ident, id) values((select location from game where id = {id}),{id});"
        kursori = yhteys.cursor()
        kursori.execute(sql)
        yhteys.commit()

    sql1 = f"select danger_local from danger_local where id = {id} and ident = (select location from game where id = {id});"
    sql2 = f"select danger_global from game where id = {id};"
    kursori = yhteys.cursor()
    kursori.execute(sql1)
    tulos1 = kursori.fetchone()
    kursori.execute(sql2)
    tulos2 = kursori.fetchone()

    danger_temp = int(tulos1[0]) + int(tulos2[0])

    if danger_temp >= 100:

        print("")
        OmatKoodit.JaniKoodi.letterbyletter(OmatKoodit.sanakirja.sanakirja["doom"])
        exit()

    else:

        # Local danger levelin nosto
        sql = (f"update danger_local set danger_local = danger_local + {str(random.randint(5,80))} "
               f"where ident = (select location from game where id = {id}) and id = {id};")
        kursori = yhteys.cursor()
        kursori.execute(sql)
        yhteys.commit()

        # Global dangerin nosto:
        sql = f"update game set danger_global = danger_global + {str(random.randint(1,3))} where id = {id};"
        kursori = yhteys.cursor()
        kursori.execute(sql)
        yhteys.commit()

        # Dangerin vertailu tuleeko attack-viestiä
    sql1 = f"select danger_local from danger_local where id = {id} and ident = (select location from game where id = {id});"
    sql2 = f"select danger_global from game where id = {id};"
    kursori = yhteys.cursor()
    kursori.execute(sql1)
    tulos1 = kursori.fetchone()
    kursori.execute(sql2)
    tulos2 = kursori.fetchone()

    danger_temp = int(tulos1[0]) + int(tulos2[0])

    if danger_temp >= 100:

        print("")
        OmatKoodit.JaniKoodi.letterbyletter(OmatKoodit.sanakirja.sanakirja["attack"])
