from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    fullname: Optional[str] = None

class User(BaseModel):
    fullname: str
    role: str
    email: EmailStr

class UserinDB(User):
    hashed_password: str

class Shipment(BaseModel):
    shipment_No: str
    container_No: str
    route_details: str
    goods_type: str
    Device: str
    Exp_delivery_date: datetime
    PO_No: str
    Delivery_no: int
    NDC_no: str
    Batch_ID: str
    Serial_no: str
    Shipment_descr: str

class Device(BaseModel):
    Device_id: str
    Battery_level: float
    First_sensor_temp: str
    Route_from: str
    Route_to: str
    Timestamp: datetime



