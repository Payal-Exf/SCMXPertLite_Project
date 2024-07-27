from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from typing import Annotated
from fastapi import Depends, HTTPException, status
import jwt
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError 
from passlib.context import CryptContext
from models.models import TokenData, User, UserinDB
from config.config_db import user, shipment, device

#load environment variables from .env file
load_dotenv(dotenv_path='../variable.env')

# Password hasing using pyjwt 
#secret key is getenerated using bash command openssl rand -hex 32
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME = os.getenv("ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Function for hashing password
def get_password_hash(password):
    return pwd_context.hash(password)

# Function for verifing the entered password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Function to find and return the user with the given email if they exist
def get_user(email):
    exist_user = user.find_one({"email": str(email)})
    if exist_user:
        return exist_user

# Function to authenticate the user by verifying the email and password
def authenticate_user(email1: str, password: str):
    find_user = get_user(email=email1) 
    if not find_user or not verify_password(password, find_user["hashed_password"]):
        return False
    return find_user

# Function to create a JWT access token with an optional expiration time
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM) # type: ignore
    return encoded_jwt

# Funtion to retrieve and validate the current user from the JWT token
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code= status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers={"WWW-Autenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM]) 
        email: str = payload["sub"]
        role: str = payload["role"]
        fullname: str = payload["fullname"]
        if email is None or role is None:
            raise credentials_exception
        token_data = TokenData(email=email, role=role, fullname=fullname)
        user = get_user(email= token_data.email)
        if user is None:
            raise credentials_exception
        return {"email": token_data.email, "role": token_data.role,"fullname": token_data.fullname, "id": str(user["_id"])}
    except InvalidTokenError:
        raise credentials_exception


# Function to check if the current user has an admin role
async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return current_user    

# Function to check if the current user has a user role
async def get_current_user_role(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return current_user 

# Function to fetch device details using given device id
def fetch_device_details(device_id: int):
    device_detail = device.find({"Device_Id": device_id})
    return device_detail
