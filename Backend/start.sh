#!/bin/bash

# Start FastAPI server
uvicorn SCMXPertLite_Backend:app --host 0.0.0.0 --port 8000 &

# Start Socket server
python app/kafka/Socket_server.py &

# Start Kafka Producer
python app/kafka/Producer.py &

# Kafka Consumer
python app\kafka\Consumer.py 

# wait for all background processes to finish
while true;  do sleep 1000; done

