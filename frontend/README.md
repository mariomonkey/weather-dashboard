# Weather Dashboard

Modern and responsive weather dashboard built with React and FastAPI, featuring a color palette highlighting the different times of day and temperature conditions.

## Features
* **Dynamic Theming:** Forecast cards intelligently adapt their colors to reflect dawn, morning, afternoon, dusk, night, rain, snow, or extreme heat.
* **Secure API Proxy:** A lightweight Python backend securely handles all OpenWeather API requests, keeping credentials hidden from the client.
* **5-Day Forecast:** Clicking on any city displays a view with a detailed, scrollable 3-hour interval forecast grouped by day.
* **Dark & Light Mode:** Theme toggling with different color palettes for each theme.
## Tech Stack
* **Frontend:** React (Vite), React Icons (Lucide)
* **Backend:** Python, FastAPI, HTTPX, Asyncio
* **Data Source:** OpenWeather API (Current Weather, Air Pollution, and 5-Day Forecast)

## Locally run it by:

### 1. Setting up the Backend...
1. Navigate to the backend folder: `cd backend`
2. Activate the virtual environment: `source venv/bin/activate`
3. Create a `.env` file in the backend folder and add your API key: `WEATHER_API_KEY=your_openweather_key_here`
4. Start the FastAPI server: `uvicorn main:app --reload --port 8000`

### 2. ...and the Frontend
1. Open a new terminal and navigate to the frontend folder: `cd frontend`
2. Install the necessary dependencies: `npm install`
3. Start the Vite development server: `npm run dev`
4. Open your browser and go to `http://localhost:5173`
