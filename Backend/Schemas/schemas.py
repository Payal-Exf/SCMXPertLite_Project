from datetime import datetime

#User Deatils Fetch
def individual_serial(User) -> dict:
    return {
        "id": str(User["_id"]),
        "fullname": User["fullname"],
        "password": User["hashed_password"],
        "role": User["role"],
        "email": User["email"]
    }

def list_serial(Users) -> list:
    return[individual_serial(user) for user in Users]


#shipment Details fetch - serialization
def single_shipment(Shipment) -> dict:
    return {
        "id": str(Shipment["_id"]),
        "shipment_No": str(Shipment["shipment_No"]),
        "container_No": str(Shipment["container_No"]),
        "route_details": str(Shipment["route_details"]),
        "goods_type": str(Shipment["goods_type"]),
        "Device": str(Shipment["Device"]),
        "Exp_delivery_date": str(Shipment["Exp_delivery_date"]),
        "PO_No": str(Shipment["PO_No"]),
        "Delivery_no": int(Shipment["Delivery_no"]),
        "NDC_no": str(Shipment["NDC_no"]),
        "Batch_ID": str(Shipment["Batch_ID"]),
        "Serial_no": str(Shipment["Serial_no"]),
        "Shipment_descr": str(Shipment["Shipment_descr"]),
    }

def list_shipments(Shipments) -> list:
    return[single_shipment(shipment) for shipment in Shipments]

# Device details Ftech - Serialization
def single_device(Device) -> dict:
    return {
        "Device_id": str(Device["Device_id"]),
        "Battery_level": float(Device["Battery_level"]),
        "First_sensor_temp": str(Device["First_sensor_temp"]),
        "Route_from": str(Device["Route_from"]),
        "Route_to": str(Device["Route_to"]),
        "Timestamp": str(Device["Timestamp"])
    }

def list_devices(Devices) -> list:
    return[single_device(device) for device in Devices]

def list_deviceId(Devices) -> list:
    return[single_device(device)["Device_id"] for device in Devices]

