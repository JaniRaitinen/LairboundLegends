import mysql.connector

user = "root"
pwd = "L1zardKVLT"


def yhteys():
    mysql.connector.connect(
        host='127.0.0.1',
        port=3306,
        database='dragon_game',
        user=user,
        password=pwd,
        autocommit=True
    )
