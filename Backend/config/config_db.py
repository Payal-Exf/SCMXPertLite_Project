import os
from pymongo.mongo_client import MongoClient
from pymongo import errors

url = os.getenv("MONGO_URL","mongodb://mongo:27017/")
#url = "mongodb://127.0.0.1:27017/"

#Connecting to MongoDb
client = MongoClient(url)

#Using SCMPertLite_db as current database
mydb = client['SCMXPertLite_db']

user = mydb.Users
shipment = mydb.Shipments
device = mydb.Devices

try:
    # Attempt to retrieve server information
    client.server_info()
    print("Connected to MongoDB")
except errors.ServerSelectionTimeoutError as err:
    print(f"Server selection error: {err}")
except errors.ConnectionFailure as err:
    print(f"Connection failure: {err}")
