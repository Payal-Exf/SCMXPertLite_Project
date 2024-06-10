from datetime import timedelta
from typing import Annotated, List
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
from pydantic import EmailStr
import requests
from models.models import Shipment, Token, User, UserinDB
from config.auth import ACCESS_TOKEN_EXPIRE_MINUTES,ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME, create_access_token, get_current_admin, get_current_user, get_current_user_role, get_password_hash, user, shipment, device, get_user, authenticate_user, fetch_device_details
from Schemas.schemas import list_deviceId, list_devices, list_serial, individual_serial, list_shipments, single_device, single_shipment

router = APIRouter()
templates = Jinja2Templates(directory="../Frontend/Pages/")

@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm= Depends(), response: Response = None):
    email = form_data.username
    password = form_data.password
    user = authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
    access_token = create_access_token(
        data={"sub": user["email"],"role": user["role"], "fullname": user["fullname"]}, expires_delta=access_token_expires
    )
    response = JSONResponse(status_code=status.HTTP_200_OK, 
                            content={"access_token": access_token, 
                                    "token_type": "bearer"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=1800,
        expires=1800,
        secure=True,
        samesite='lax',
        path='/'
    )
    return response


# Login endpoint with CAPTCHA verification and JWT token generation
@router.post("/login") 
async def login(response: Response, email: str = Form(...), password: str = Form(...), 
                g_recaptcha_response: str = Form(...), remember_me: bool = Form(False)):
    secret_key = '6LfiSekpAAAAAI_Jxhr-zKfkYvL-b8Y0K4jfdEK-'

    payload = {
        'secret': secret_key,
        'response': g_recaptcha_response
    }
    responses = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
    result = responses.json()
    
    if not result['success']:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content="reCAPTCHA Verification Failed")

    # Authenticate user
    valid_user = authenticate_user(email, password)
    if valid_user:
        if remember_me:
            access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME))
        else:
            access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES))
        access_token = create_access_token(
        data={"sub": valid_user["email"], "role": valid_user["role"], "fullname": valid_user["fullname"]}, expires_delta=access_token_expires
         )      
        response = JSONResponse(
            status_code=status.HTTP_200_OK, 
            content={"message": "Login Successful",
                    "access_token": access_token, 
                    "token_type": "bearer"})   
        
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=False,
            max_age=1800,
            expires=1800,
            secure=True,
            samesite='lax',
            path="/"
        )
        return response           
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content= "Invalid Email or Password")


@router.post("/signup/")
async def add_user(new_user: UserinDB):
    try:
        user_exist = get_user(new_user.email)
        if user_exist:
            raise HTTPException(status_code=400, detail = "Email Already exists.")
        else:
            user.insert_one(new_user.model_dump())
            hashed_password = get_password_hash(new_user.hashed_password)
            user.update_one(
                {"email": new_user.email},
                {"$set": {"hashed_password": hashed_password}}
            )
            #user.insert_one(dict(new_user))
            return JSONResponse(content = {"message": "User Created Successfully.", 
                    "new_user": individual_serial(get_user(new_user.email))})
    except Exception as e:
        raise HTTPException(status_code=500, detail= str(e))

@router.post("/create_shipment/")
async def create_shipment(new_shipment: Shipment, current_user: dict = Depends(get_current_user)):
    try:
        print("Inside route")
        shipment_dict = new_shipment.model_dump()    
        shipment_dict['Created_by'] = current_user["email"]
        print(shipment_dict['Created_by'])
        shipment.insert_one(shipment_dict)
        return JSONResponse(status_code=200, content={"success": "True"}) 
    except Exception as e:
        return JSONResponse(status_code=500, content={"success": False, "error": str(e)})
    
@router.get("/my_Shipments")
async def read_user_shipments(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "Admin":
        shipment_details = list_shipments(shipment.find())
    else:
        shipment_details = list_shipments(shipment.find({"Created_by": current_user["email"]}))
    return shipment_details 

@router.get("/Device_Details/")
async def all_device_details():
    all_devices_details = list_devices(device.find())
    return all_devices_details

@router.get("/getDeviceIds", response_model=List[int])
async def get_device_ids():
    device_ids = list_deviceId(device.find())
    return set(device_ids)

@router.get("/Device_Details/{Device_id}")
async def get_device_detail(Device_id:int):
    device_exist = fetch_device_details(Device_id)
    if device_exist:
        list_of_device = list_devices(device_exist)
        if(len(list_of_device)>0):
            return list_of_device
        else:
            return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content= "Please enter correct Device ID")
    else: 
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND, content= "Please enter correct Device ID")





