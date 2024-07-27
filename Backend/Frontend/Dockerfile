# Use an official python runtime as a parent image
FROM python:3.11-slim

# RUN apt-get update && apt-get install -y python3
# Set working directory in the container
WORKDIR /usr/src/app

# Copy the content of current dir into the container
COPY . .

RUN ls -l /usr/src/app

# Install any required dependencies
# RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8080 for the HTTP server
EXPOSE 8080

# Command to run the HTTP server
CMD [ "python3", "-m", "http.server", "8080" ]
# CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]

# # Copy the start script into the container
# COPY start.sh /usr/src/app/start.sh

# # Ensure the start.sh script is executable
# RUN chmod +x /usr/src/app/start.sh

# # Command to run the start script
# CMD [ "/usr/src/app/start.sh" ]