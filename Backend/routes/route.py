from datetime import timedelta
import os
from typing import List
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response, status
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
import requests
from models.models import Shipment, Token, User, UserinDB
from config.auth import ACCESS_TOKEN_EXPIRE_MINUTES,ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME, create_access_token, get_current_user, get_password_hash, user, shipment, device, get_user, authenticate_user, fetch_device_details
from Schemas.schemas import list_deviceId, list_devices, list_serial, individual_serial, list_shipments, single_device, single_shipment

load_dotenv(dotenv_path='../variable.env')
router = APIRouter()
templates = Jinja2Templates(directory="./Frontend/templates")

# -----------  API for Displaying the Login page initially ---------------#
@router.get("/")
async def index(request: Request):
    return templates.TemplateResponse("Login.html", {"request": request})

# -----------  API for access token ---------------#
@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm= Depends(), response: Response = None): # type: ignore
    email = form_data.username
    password = form_data.password
    user = authenticate_user(email, password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)) # type: ignore
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

# -----------  API for Displaying the login page ---------------#
@router.get("/login")
async def loginpage(request: Request):
    return templates.TemplateResponse("Login.html", {"request": request})

# ---------- Login endpoint with CAPTCHA verification and JWT token generation ------#
@router.post("/login") 
async def login(response: Response, email: str = Form(...), password: str = Form(...), 
                g_recaptcha_response: str = Form(...), remember_me: bool = Form(False)):
    secret_key = os.getenv('CAPTCHA_SECRET_KEY')

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
            access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME)) # type: ignore
        else:
            access_token_expires = timedelta(minutes=int(ACCESS_TOKEN_EXPIRE_MINUTES)) # type: ignore
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


# ---------- API to fetch the details of the current user --------- #
@router.get("/current_user")
async def current_user(current_user: dict = Depends(get_current_user)):
    return current_user


# -----------  API for Displaying signup page ---------------#
@router.get("/signup")
async def signup(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

# ---------Handles user registration by checking for existing email, creating a new user, hashing the password------#
@router.post("/signup")
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
            return JSONResponse(content = {"message": "User Created Successfully.", 
                    "new_user": individual_serial(get_user(new_user.email))})
    except Exception as e:
        raise HTTPException(status_code=500, detail= str(e))


# -----------  API for Displaying and working of Forget Passowrd page ---------------#
@router.get("/forgetPassword")
async def forgetPassowrd(request: Request):
    return templates.TemplateResponse("Forget_Password.html", {"request": request})

# ------------ API for handling user passowrd updation ------------#
@router.post("/forget_password")
async def update_user(response: Response, email: str = Form(...), password: str = Form(...),):
    try:
        user_exist = get_user(email)
        if user_exist:
            hashed_password = get_password_hash(password)
            user.update_one(
                {"email": email},
                {"$set": {"hashed_password": hashed_password}}
            )
            #user.insert_one(dict(new_user))
            return JSONResponse(content = {"message": "Password Changed Successfully.", 
                    "updated_user": individual_serial(get_user(email))})
        else:
            raise HTTPException(status_code=400, detail = "No user Exists with this email.")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail= str(e))

# -----------  API for Displaying the Dashboard page ---------------#
@router.get("/dashboard")
async def dashboard(request: Request):
    return templates.TemplateResponse("Dashboard.html", {"request": request})

# -----------  API for Displaying Create Shipment page ---------------#
@router.get("/create_shipment")
async def new_shipment(request: Request):
    return templates.TemplateResponse("newShipment.html", {"request": request})

# ---------- API for storing the new shipment -----------#
@router.post("/create_shipment")
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

# -----------  API for Displaying My Shipments page ---------------#
@router.get("/myShipments")
async def myShipments(request: Request):
    return templates.TemplateResponse("myShipment.html", {"request": request})

# --------- API for fetching shipments of the login user ---------#
@router.get("/my_Shipments")
async def read_user_shipments(current_user: dict = Depends(get_current_user)):
    if current_user["role"] == "Admin":
        shipment_details = list_shipments(shipment.find())
    else:
        shipment_details = list_shipments(shipment.find({"Created_by": current_user["email"]}))
    return shipment_details 


# -----------  API for Displaying the device data page ---------------#
@router.get("/deviceData")
async def deviceDetailsPage(request: Request):
    return templates.TemplateResponse("deviceData.html", {"request": request})

# ----------- API for fetching all the devices data available in db --------#
@router.get("/Device_Details")
async def all_device_details():
    all_devices_details = list_devices(device.find().sort({"Timestamp": -1}))
    return all_devices_details

# ----------- API for fetching available device IDs --------#
@router.get("/getDeviceIds", response_model=List[int])
async def get_device_ids():
    device_ids = list_deviceId(device.find())
    return set(device_ids)

# ----------- API for fetching selected device details ---------#
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

# ---------- API for displaying my Account Page ------------ #
@router.get("/myAccount")
async def myAccount(request: Request):
    return templates.TemplateResponse("myAccount.html", {"request": request})




