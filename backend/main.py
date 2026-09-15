import os
import httpx
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load the secret variables
load_dotenv()
API_KEY = os.getenv("WEATHER_API_KEY")

app = FastAPI()

# The CORS bouncer
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/weather")
async def get_weather(city: str):
    if not API_KEY or API_KEY == "paste_your_long_key_here":
        raise HTTPException(status_code=500, detail="API Key is missing or invalid.")
    
    async with httpx.AsyncClient() as client:
        # 1. Fetch Current Weather (We need this first to get the Latitude & Longitude)
        current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        current_res = await client.get(current_url)
        
        if current_res.status_code != 200:
            raise HTTPException(status_code=current_res.status_code, detail=f"Could not fetch data for {city}.")
            
        current_data = current_res.json()
        
        # Extract coordinates for the Air Quality API
        lat = current_data["coord"]["lat"]
        lon = current_data["coord"]["lon"]
        
        # 2. Fetch Air Quality AND Forecast at the exact same time
        aqi_url = f"https://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
        
        # asyncio.gather fires both requests simultaneously
        aqi_res, forecast_res = await asyncio.gather(
            client.get(aqi_url),
            client.get(forecast_url)
        )
        
        # 3. Bundle everything into one massive payload for React
        return {
            "current": current_data,
            "aqi": aqi_res.json() if aqi_res.status_code == 200 else None,
            "forecast": forecast_res.json() if forecast_res.status_code == 200 else None
        }