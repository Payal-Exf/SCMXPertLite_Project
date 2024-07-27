from datetime import datetime, timezone
from kafka import KafkaConsumer
import json
import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv(dotenv_path='../variable.env')

# Read environment variables
TOPIC_NAME = os.getenv('TOPIC_NAME')
BOOTSTRAP_SERVERS = os.getenv('BOOTSTRAP_SERVERS')

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URL","mongodb://mongo:27017/"))
db = client['SCMXPertLite_db']
device = db['Devices']

# Ensure all necessary environment variables are set
if not all([TOPIC_NAME, BOOTSTRAP_SERVERS]):
    raise ValueError("One or more environment variables are not set in the .env file")

# Initialize Kafka Consumer
def consume_data():
    consumer = KafkaConsumer(
        TOPIC_NAME,
        bootstrap_servers=BOOTSTRAP_SERVERS,
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        value_deserializer=lambda x: json.loads(x.decode('utf-8'))
    )

    print(f"Connected to Kafka, consuming from topic: {TOPIC_NAME}")

    for message in consumer:
        try:
            data = message.value
            #checking the incoming data is list of dictionaries
            if isinstance(data, list) and all(isinstance(d, dict) for d in data):
                data = add_timestamp(data) 
            else:
                print("Received data is not a list of dictionaries.")
                continue
            device.insert_many(data)
            print(f"Inserted Data into MongoDb: {data}")

        except json.JSONDecodeError:
            print("Failed to decode JSON data")
        except Exception as e:
            print("Error during processing:", e)

#adding timestamp field for each dict in incoming data list
def add_timestamp(data):
    """Add timestamp to each dictionary in the list."""
    timestamp = datetime.now(timezone.utc).isoformat()
    for item in data:
        item['Timestamp'] = timestamp
    return data

if __name__ == "__main__":
    consume_data()
