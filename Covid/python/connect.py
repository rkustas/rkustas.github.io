import storage
import mysql.connector
from mysql.connector import errorcode
import sys

# This statement is failing due to SQL --secure-file-priv, commented this out, still not working...
load_sql = """LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/Covid-19.csv' INTO TABLE covid.raw_data FIELDS TERMINATED BY ',' IGNORE 1 LINES;"""

def connectandload(load_sql):
    try:
        conn = storage.connect()
        cursor=conn.cursor()
        cursor.execute(load_sql)
        print("Successfully loaded the table from csv.")
    except mysql.connector.Error as e:
        if e.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("Something is wrong with your user name or password")
        elif e.eno == errorcode.ER_BAD_DB_ERROR:
            print("Database does not exist")
        else:
            print("Error: {}").format(str(e))
            sys.exit(1)
    else:
        print("Successful execution!")
        conn.close()

connectandload(load_sql)