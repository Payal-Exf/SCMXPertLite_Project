# Create a virtual enviroment
1. **Using third-party package:**
    1. Install virtualenv using: 

        ```bash
        pip install virtualenv
        ```
    2. Create virtual env using:

        ```bash 
        virtualenv "your-venv-name"
        ```
    3. Activate the virtual environment using:

        ```bash 
        "your-venv-name"\Scripts\activate
        ```

*OR*

2. **Using Python built in module:**
    
    1. Create virtual env using:

    ```bash 
    python -m venv "your-venv-name"
    ```
    2. Activate the virtual environment using:

    ```bash 
    "your-venv-name"\Scripts\activate
    ```

# Installation and Setup
To get started with the Sample Project, follow these steps:

1. **Clone the Sample Project:**

    - Clone the project repository using HTTP:
     ```bash
     git clone https://github.com/Payal-Exf/SCMXPertLite_Project.git
     ```
    - Alternatively, use SSH for cloning:
     ```bash
     git@github.com:Payal-Exf/SCMXPertLite_Project.git
     ```

# Run the Application

To run this multicontainer app you need to install docker-desktop if working on Windows.

Make sure you have Docker desktop installed in your PC.
 For more info: (https://docs.docker.com/desktop/install/windows-install/)

Start the docker Engine (start docker deskstop application)

**Open Command Prompt**
1. Build the docker-compose file it will create images for the services persent in yaml file

```bash
docker-compose build
```

2. Tag & Push docker images to dockerhub

``` bash
docker tag yourusername/frontend:latest yourusername/frontend:latest
docker tag yourusername/backend:latest yourusername/backend:latest

docker push yourusername/frontend:latest
docker push yourusername/backend:latest
```
**Alternatively**, you can specify image tags directly in docker-compose.yaml file like:
image: yourusername/frontend:latest
image: yourusername/backend:latest
and then use Docker compose to push them:

```bash 
docker-compose push
```

3. Deploying and Running Containers

```bash 
docker-compose up
```

To work in detach mode you can also use:

``` bash 
docker-compose up -d 
```

# View MongoDb Container data in MongoDb GUI - Compass
You can view stored data in MongoDb Container using MonogoDb Compass which is the GUI for Mongodb.

Make sure it is installed in your PC. 
[For more info about its download & installation click this link (https://www.mongodb.com/products/tools/compass)]

**To Connect to the mongodb container**

1. Ensure MongoDB Container is Running
    - Make sure your MongoDB Docker container is up and running. You can check this by running:

``` bash 
    docker ps
```
Look for your MongoDB container in the list and note its Container ID or name. 

2. Verify Port Mapping:
    - Ensure that the container's port 27017 is mapped to the same port on the host. You can verify this with:

``` bash
docker inspect <container_id_or_name> | grep -i "27017"
```
see a mapping like "HostPort": "27017" under Ports.

3. Check the IP of your machine
    - Go to cmd and write the below command: 

``` bash 
ipconfig
```

2. Connect to MongoDB 
    - Open MongoDb Compass in your local machine and use the below connection string:

``` bash
mongodb://<host_ip_address>:27017
```
3. Connect and you will be able to see the available Databases and collections.

 