import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from routes.route import router

app = FastAPI()

origins = ['https://localhost:8000',
           'http://localhost:8000',
           'http://localhost:8080',
           'http://127.0.0.1:8080',
           'https://127.0.0.1:8080',
           'http://127.0.0.1:8000',
           'http://172.30.176.1:8080',
           'http://13.48.42.178:8080',
           'http://16.171.165.89:8080']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def read_root():
    return RedirectResponse(url="/login")

@app.get("/login")
async def read_login():
    return FileResponse(os.path.join("Frontend", "Pages", "Login.html"))