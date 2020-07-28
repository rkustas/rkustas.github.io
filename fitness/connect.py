from pymongo import MongoClient
from config import username,password,port,db

# Setup connection
# try:
#     conn = "mongodb://localhost:27017"
#     client = MongoClient(conn)
#     print(f"Connection successful")
# except Exception as e:
#     print(e,f"Connection unsuccessful")

# Connect via Mongo mLab, limited data storage on sandbox subscription
try:
    client = MongoClient(f"mongodb://{username}:{password}@ds133291.mlab.com:{port}/{db}")
    print(client)
    print(f"Connection successful")
except Exception as e:
    print(e,f"Connection unsuccessful")
