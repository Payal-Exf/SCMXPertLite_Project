from pymongo.mongo_client import MongoClient

url = "mongodb://127.0.0.1:27017"

#Connecting to MongoDb
client = MongoClient(url)

#Using SCMPertLite_db as current database
mydb = client['SCMXPertLite_db']

# Create Collections if not exists -- Users & Shipments
user = mydb.Users
shipment = mydb.Shipments
device = mydb.Devices

