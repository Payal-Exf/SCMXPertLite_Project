from datetime import datetime
import socket
import json
import random
from random import randint
import time


s = socket.socket()
print("Socket Created")
s.bind(('',12345))
s.listen(3)
print("waiting for connections")
c, addr = s.accept()

# Custom JSON encoder to handle datetime objects -- as timestamp fielf was given error "Object of type datetime is not JSON serializable"
class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def generate_random_data():
    locations = [
        "Hyderabad, India", "Bangalore, India", "Chennai, India", "New Delhi, India",
        "New York, USA", "San Fancisco, USA", "Berlin, Germany"
    ]
    data =[{
            "Battery_Level": round(random.uniform(1.0, 5.0), 2),
            "Device_Id":random.randint(1000000000, 9999999999),
            "First_Sensor_temperature":round(random.uniform(15.0, 25.0), 1),
            "Route_From": random.choice(locations),
            "Route_To":random.choice(locations)
        } for _ in range(2)]
    
    return data

while True:
    try:
        data = generate_random_data()
        print("connected with", addr)
        userdata = (json.dumps(data, cls=DateTimeEncoder)+"\n").encode('utf-8')
        print(userdata)
        c.send(userdata)
        time.sleep(100) #reduced sleep (delay) time from 100 to 10 sec
    except Exception as e:
        print(e)
        break
c.close()
