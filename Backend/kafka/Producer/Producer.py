import socket
import os
from dotenv import load_dotenv
from kafka import KafkaProducer
import json


# Load environment variables from the .env file
load_dotenv(dotenv_path='../../variable.env')

# Read environment variables
HOST =os.getenv('HOST')
PORT = os.getenv('PORT')
TOPIC_NAME = os.getenv('TOPIC_NAME')
BOOTSTRAP_SERVERS = os.getenv('BOOTSTRAP_SERVERS')

# Ensure all necessary environment variables are set
if not all([HOST, PORT, TOPIC_NAME, BOOTSTRAP_SERVERS]):
    raise ValueError("One or more environment variables are not set in the .env file")

# Initialize Kafka producer
producer = KafkaProducer(
    bootstrap_servers=BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode('utf-8'),
    api_version=(0, 11, 5),
    retries=5
)

# Socket object for the server
sock = socket.socket()

try:
    # Connect to the remote host and port
    print("Trying to connect.....")
    sock.connect((HOST, int(PORT)))
    print("Socket connected successfully!")
    
    # Looping to read data from the socket connection and send it to the Kafka topic
    while True:
        try:
            print("trying to get data....")
            data = sock.recv(70240)
            if not data:
                break
            
            # Convert the received data to JSON if necessary
            data_json = json.loads(data.decode('utf-8'))
            print(f"Received data: {data_json}")
            
            # Send the data to the Kafka topic
            producer.send(TOPIC_NAME, data_json)
            producer.flush()
        
        except json.JSONDecodeError:
            print("Failed to decode JSON data")
        except Exception as e:
            print(f"Error during processing: {e}")
            break

except Exception as e:
    print(f"Failed to connect to socket: {e}")

finally:
    sock.close()
    print("Socket connection closed.")
