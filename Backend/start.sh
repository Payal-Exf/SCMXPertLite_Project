#!/bin/sh

# Start FastAPI server
uvicorn SCMXPertLite_Backend:app --host 0.0.0.0 --port 8000 &

# Start Socket server
python ./kafka/Socket_server.py &

# Start Kafka Producer
python ./kafka/Producer.py &

# Kafka Consumer
python ./kafka/Consumer.py &

# wait for all background processes to finish
# while true;  do sleep 1000; done

# Keep the script running to keep the container alive
tail -f /dev/null