import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, render_template, request, json
import requests
from geopy.geocoders import Nominatim
import pandas as pd
from datetime import datetime, timedelta
from predict import predict_weather, get_recommendations, load_config

print(f"Current working directory: {os.getcwd()}")
template_path = '../templates'
static_path = '../static'
print(f"Template folder path: {template_path}")
print(f"Template folder exists: {os.path.exists(template_path)}")
print(f"index.html exists: {os.path.exists(os.path.join(template_path, 'index.html'))}")

app = Flask(__name__, template_folder=template_path, static_folder=static_path)

try:
    config = load_config()
    API_KEY = config['openweather_api_key']
    print(f"API Key loaded: {API_KEY[:4]}...")
except Exception as e:
    print(f"Error loading config: {e}")
    API_KEY = None

geolocator = Nominatim(user_agent="health_safety_app")

@app.route('/', methods=['GET', 'POST'])
def index():
    print("Accessing / route")
    if request.method == 'POST':
        location = request.form['location']
        print(f"Received POST for location: {location}")
        try:
            loc = geolocator.geocode(location)
            if not loc:
                print("Location not found")
                return render_template('index.html', error="Location not found.")
            
            # Current Weather API (free)
            current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={loc.latitude}&lon={loc.longitude}&appid={API_KEY}&units=metric"
            print(f"Requesting current weather: {current_url}")
            current_response = requests.get(current_url)
            current_data = current_response.json()
            
            if current_response.status_code != 200:
                print(f"Current API error: {current_data.get('message')}")
                return render_template('index.html', error=f"Current weather error: {current_data.get('message', 'Unknown error')}")
            
            temp = current_data['main']['temp']
            humidity = current_data['main']['humidity']
            wind_speed = current_data['wind']['speed']
            
            # UV API (free)
            uv_url = f"https://api.openweathermap.org/data/2.5/uvi?lat={loc.latitude}&lon={loc.longitude}&appid={API_KEY}"
            print(f"Requesting UV: {uv_url}")
            uv_response = requests.get(uv_url)
            uvi = uv_response.json().get('value', 0) if uv_response.status_code == 200 else 0
            
            # 5-day/3-hour Forecast API (free, for basic hourly-like data)
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={loc.latitude}&lon={loc.longitude}&appid={API_KEY}&units=metric"
            print(f"Requesting forecast: {forecast_url}")
            forecast_response = requests.get(forecast_url)
            forecast_data = forecast_response.json()
            
            if forecast_response.status_code != 200:
                print(f"Forecast API error: {forecast_data.get('message')}")
                hourly_times = []
                hourly_temps = []
            else:
                # Extract first 8 3-hour intervals (24 hours)
                hourly_data = forecast_data['list'][:8]
                hourly_times = [datetime.fromtimestamp(h['dt']).strftime('%H:00') for h in hourly_data]
                hourly_temps = [h['main']['temp'] for h in hourly_data]
            
            print(f"Hourly data: times={hourly_times}, temps={hourly_temps}")
            
            features = [temp, humidity, wind_speed]
            condition = predict_weather(features)
            recommendations = get_recommendations(condition, uvi, humidity)
            print(f"Prediction: condition={condition}, uvi={uvi}, recommendations={recommendations}")
            
            return render_template('result.html', location=location, temp=temp, humidity=humidity, 
                                   wind_speed=wind_speed, condition=condition, recommendations=recommendations,
                                   uvi=uvi, hourly_times=json.dumps(hourly_times), hourly_temps=json.dumps(hourly_temps))
        except Exception as e:
            print(f"Error in POST: {e}")
            return render_template('index.html', error=str(e))
    
    print("Rendering index.html for GET")
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5001)