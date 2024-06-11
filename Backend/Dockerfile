#Using official python runtime as a parent image
FROM python:latest

#set the working directory in the container
WORKDIR /app

COPY requirements.txt /app/requirements.txt

#Install any needed packages specified in the requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

#Copy the current directory contents into the working directory
COPY . /app


#COPY start.sh /app/start.sh
COPY start.sh /app/start.sh

# Ensure the start.sh script is executable
RUN chmod +x /app/start.sh

#Expose port 8000 for uvicorn
EXPOSE 8000

#Command to run the backend 
CMD ["./start.sh"]


