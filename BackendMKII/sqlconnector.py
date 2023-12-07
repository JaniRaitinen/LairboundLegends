import os
import mysql.connector

connection = mysql.connector.connect(
    host=os.environ.get('DB_HOST'),
    port=3306,
    database=os.environ.get('DB_NAME'),
    user=os.environ.get('DB_USER'),
    password=os.environ.get('DB_PASS'),
    autocommit=True
)