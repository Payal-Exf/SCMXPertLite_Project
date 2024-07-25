# Use an official python runtime as a parent image
FROM python:3.11-slim

RUN apt-get update && apt-get install -y python3 python3-pip
# Set working directory in the container
WORKDIR /usr/src/app

# Copy the content of current dir into the container
COPY . .

RUN ls -l /usr/src/app
# Expose port 8080 for the HTTP server
EXPOSE 8080

# Command to run the HTTP server
CMD [ "python3", "-m", "http.server", "8080" ]