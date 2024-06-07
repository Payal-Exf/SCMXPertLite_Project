from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
from typing import Annotated
from fastapi import Depends, HTTPException, status
import jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
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


def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(email)-> dict:
    exist_user = user.find_one({"email": str(email)})
    if exist_user:
        return exist_user

def authenticate_user(email1: str, password: str):
    find_user = get_user(email=email1) 
    if not find_user or not verify_password(password, find_user["hashed_password"]):
        return False
    # login = user.find_one({"$and": [{"email":email1},{"password": password}]})
    return find_user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encoded_jwt

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(
        status_code= status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers={"WWW-Autenticate": "Bearer"},
        )
    try:
        print("inside try")
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        print(payload)
        email: str = payload["sub"]
        role: str = payload["role"]
        fullname: str = payload["fullname"]
        print(email)
        if email is None or role is None:
            #return {"message": "No such user"}
            raise credentials_exception
        token_data = TokenData(email=email, role=role, fullname=fullname)
        print(token_data)
        user = get_user(email= token_data.email)
        if user is None:
            raise credentials_exception
            #return {"message": "No such user"}
        return {"email": token_data.email, "role": token_data.role,"fullname": token_data.fullname, "id": str(user["_id"])}
    except InvalidTokenError:
        #print("Invalid token")
        raise credentials_exception
    
async def get_current_admin(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return current_user    

async def get_current_user_role(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this resource",
        )
    return current_user 


# async def get_current_active_user(current_user: Annotated[User,Depends(get_current_user)],):
#     #print("in currrent user block")
#     if current_user: 
#         return current_user
#     else:
#         raise HTTPException(status_code = 400, detail = "Invalid User")

# async def get_current_active_user_with_role(role: str, current_user: UserinDB = Depends(get_current_user)):
#     if role not in current_user.role:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail = "Not enough permissions",
#         )
#     return current_user

def fetch_device_details(device_id: int):
    device_detail = device.find({"Device_Id": device_id})
    return device_detail
