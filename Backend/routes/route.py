from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response, status
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.templating import Jinja2Templates
from pydantic import EmailStr
import requests
from models.models import Shipment, Token, User, UserinDB
from config.auth import ACCESS_TOKEN_EXPIRE_MINUTES,ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME, create_access_token, get_current_admin, get_current_user_role, get_password_hash, user, shipment, device, get_user, authenticate_user, fetch_device_details
from Schemas.schemas import list_devices, list_serial, individual_serial, list_shipments, single_device, single_shipment
from bson import ObjectId


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
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"],"role": user["role"]}, expires_delta=access_token_expires
    )
    response = JSONResponse(content={"message": "Login Successful"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        max_age=1800,
        expires=1800,
        secure=True,
        samesite='lax'
    )
    
    #return {"access_token": access_token, "token_type": "bearer"}
    return JSONResponse(
            status_code=status.HTTP_200_OK, 
            content={"access_token": access_token, 
                    "token_type": "bearer"})



@router.get("/all_users")
async def get_all_user():
    users = list_serial(user.find())
    return users



@router.post("/signup/")
async def add_user(new_user: UserinDB):
    # if '@' not in new_user.email:
    #     return {"Email ID invalid"}
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
            return {"message": "User Created Successfully.", 
                    "new_user": individual_serial(get_user(new_user.email))}
    except Exception as e:
        raise HTTPException(status_code=500, detail= str(e))
    

# @router.get("/", response_class=HTMLResponse)
# async def get_form(request: Request):
#     return templates.TemplateResponse("Login.html", {"request": request})

# Login endpoint with CAPTCHA verification and JWT token generation
@router.post("/login") 
async def login(request: Request, email: str = Form(...), password: str = Form(...), 
                g_recaptcha_response: str = Form(...), remember_me: bool = Form(False)):
    secret_key = '6LfiSekpAAAAAI_Jxhr-zKfkYvL-b8Y0K4jfdEK-'

    payload = {
        'secret': secret_key,
        'response': g_recaptcha_response
    }
    response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=payload)
    result = response.json()
    
    if not result['success']:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "reCAPTCHA verification failed"})

    # Authenticate user
    valid_user = authenticate_user(email, password)
    if valid_user:
        if remember_me:

        # individual_token(Token(access_token=access_token, token_type="bearer"))
        # return {"message": "Login Successful",
        #         "details": individual_serial(valid_user)}

            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_DAYS_REMEMBER_ME)
        else:
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
        data={"sub": valid_user["email"], "role": valid_user["role"]}, expires_delta=access_token_expires
         )
        # return {"message": "Login Successful",
        #         "details": individual_serial(valid_user),
        #         "token": Token(access_token=access_token, token_type="bearer")}
        return JSONResponse(
            status_code=status.HTTP_200_OK, 
            content={"access_token": access_token, 
                    "token_type": "bearer"})                
    else:
        return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED, content={"message": "Invalid email or password"})

# @router.get("/users/me/", response_model=User)
# async def read_users_me(
#     current_user: Annotated[User, Depends(get_current_active_user)],
# ):
#     return current_user

# @router.get("/users/me/items/")
# async def read_own_items(
#     current_user: Annotated[User, Depends(get_current_active_user)],
# ):
#     return [{"item_id": "Foo", "owner": current_user["email"]}]


@router.get("/admin")
async def read_admin_data(current_admin: dict = Depends(get_current_admin)):
    return {"message": "This is a protected admin endpoint", "user": current_admin}

@router.get("/user")
async def read_user_data(current_user: dict = Depends(get_current_user_role)):
    return {"message": "This is a protected user endpoint", "user": current_user}


@router.get("/Shipment/")
async def shipment_details():
    all_shipments = list_shipments(shipment.find())
    return all_shipments

@router.post("/create_shipment/")
async def create_shipment(new_shipment: Shipment):
    shipment.insert_one(new_shipment.model_dump())
    return {"message": "Shipment Created Successfully.", 
                "new_user": new_shipment.model_dump()}
    
@router.get("/Device_Details/")
async def all_device_details():
    all_devices_details = list_devices(device.find())
    return all_devices_details

@router.get("/Device_Details/{Device_id}")
async def single_device_detail(Device_id:int):
    device_exist = fetch_device_details(Device_id)
    if device_exist:
        return {"message": "Shipment Created Successfully.", 
                "new_user": single_device(device_exist)}
    else: 
        return {"message": "Please enter correct Device ID"}
    






