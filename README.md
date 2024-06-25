# Create a virtual enviroment
**Using third-party package**
    
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

**Using Python built in module:**
    
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

