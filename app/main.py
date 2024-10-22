from fastapi import FastAPI  
from app.api.routes import router as flight_router   
from fastapi.templating import Jinja2Templates  
from starlette.requests import Request 
from fastapi.staticfiles import StaticFiles

app = FastAPI()
 # Set up Jinja2 template engine
templates = Jinja2Templates(directory="app/templates") 

app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/")
async def read_root(request: Request):
    # Render the main HTML file
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(flight_router)
 