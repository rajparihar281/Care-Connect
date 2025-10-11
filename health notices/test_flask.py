# test_flask.py
from flask import Flask, render_template, request, json
from geopy.geocoders import Nominatim
from src.predict import predict_weather, get_recommendations, load_config
import requests
from datetime import datetime

# Initialize Flask app
app = Flask(__name__, template_folder='templates', static_folder='static')

# Geolocator and config
geolocator = Nominatim(user_agent="health_safety_app")
config = load_config()
API_KEY = config.get('openweather_api_key')

# Debug: Check if API key is loaded
print("="*60)
print("DEBUG: API Key Status")
if API_KEY:
    print(f"API Key loaded: {API_KEY[:10]}...{API_KEY[-4:]}")
else:
    print("WARNING: No API Key found!")
print("="*60)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        location = request.form.get('location')
        try:
            # Geocode location
            loc = geolocator.geocode(location)
            if not loc:
                return render_template('index.html', error="Location not found.")
            
            print(f"\nDEBUG: Location found - {location}")
            print(f"Coordinates: {loc.latitude}, {loc.longitude}")
            
            # Current weather API
            current_url = f"https://api.openweathermap.org/data/2.5/weather?lat={loc.latitude}&lon={loc.longitude}&appid={API_KEY}&units=metric"
            
            print(f"\nDEBUG: Requesting weather data...")
            print(f"URL: {current_url[:80]}...")
            
            current_response = requests.get(current_url)
            current_data = current_response.json()
            
            # Debug output
            print(f"\nDEBUG: API Response")
            print(f"Status Code: {current_response.status_code}")
            print(f"Response Data: {current_data}")
            print("="*60)
            
            # Better error handling
            if current_response.status_code != 200:
                error_msg = current_data.get('message', 'API request failed')
                print(f"ERROR: API returned status {current_response.status_code}")
                return render_template('index.html', error=f"API Error: {error_msg} (Status: {current_response.status_code})")
            
            if 'main' not in current_data:
                print(f"ERROR: 'main' key not found in response")
                return render_template('index.html', error=f"Weather data unavailable. API Response: {current_data}")
            
            temp = current_data['main']['temp']
            humidity = current_data['main']['humidity']
            wind_speed = current_data['wind']['speed']
            
            print(f"\nDEBUG: Weather data extracted successfully")
            print(f"Temp: {temp}°C, Humidity: {humidity}%, Wind: {wind_speed} m/s")
            
            # UV index API (make it optional since it's deprecated)
            uvi = 0
            try:
                uv_url = f"https://api.openweathermap.org/data/2.5/uvi?lat={loc.latitude}&lon={loc.longitude}&appid={API_KEY}"
                uvi_response = requests.get(uv_url, timeout=5)
                if uvi_response.status_code == 200:
                    uvi = uvi_response.json().get('value', 0)
                    print(f"DEBUG: UV Index: {uvi}")
                else:
                    print(f"WARNING: UV API returned status {uvi_response.status_code} (using default 0)")
            except Exception as uv_error:
                print(f"WARNING: UV API failed: {uv_error} (using default 0)")
            
            # 5-day forecast API (first 8 intervals = 24 hours)
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?lat={loc.latitude}&lon={loc.longitude}&appid={API_KEY}&units=metric"
            forecast_response = requests.get(forecast_url)
            forecast_data = forecast_response.json()
            
            hourly_data = forecast_data.get('list', [])[:8]
            hourly_times = [datetime.fromtimestamp(h['dt']).strftime('%H:00') for h in hourly_data]
            hourly_temps = [h['main']['temp'] for h in hourly_data]
            
            print(f"DEBUG: Forecast data retrieved ({len(hourly_data)} hours)")
            
            # Predict condition and get safety recommendations
            condition = predict_weather([temp, humidity, wind_speed])
            recommendations = get_recommendations(condition, uvi, humidity)
            
            print(f"DEBUG: Condition predicted: {condition}")
            print(f"DEBUG: Rendering result page...\n")
            
            # Render results page
            return render_template(
                'result.html',
                location=location,
                temp=temp,
                humidity=humidity,
                wind_speed=wind_speed,
                condition=condition,
                recommendations=recommendations,
                uvi=uvi,
                hourly_times=json.dumps(hourly_times),
                hourly_temps=json.dumps(hourly_temps)
            )
        except Exception as e:
            print(f"\nERROR: Exception occurred: {str(e)}")
            import traceback
            traceback.print_exc()
            return render_template('index.html', error=f"Error: {str(e)}")
    
    # GET request
    return render_template('index.html')

if __name__ == '__main__':
    # Run app on port 5001
    print("\nStarting Flask app on http://localhost:5001")
    print("Press CTRL+C to quit\n")
    app.run(debug=True, port=5001)