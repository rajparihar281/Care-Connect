import joblib
import yaml
import pandas as pd
import os

# Base directory of the project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_config():
    config_path = os.path.join(BASE_DIR, 'config', 'config.yaml')
    with open(config_path, 'r') as file:
        return yaml.safe_load(file)

def predict_weather(features):
    model_path = os.path.join(BASE_DIR, 'models', 'saved_models', 'weather_model.joblib')
    model = joblib.load(model_path)
    feature_df = pd.DataFrame([features], columns=['temperature', 'humidity', 'wind_speed'])
    condition = model.predict(feature_df)[0]
    return condition

def get_recommendations(condition, uvi, humidity):
    recs = []
    if condition == 'heat_wave':
        recs.append(
            "Heat wave detected! Stay hydrated, avoid outdoor activities during peak heat, wear light clothing, and seek air-conditioned spaces.")
    elif condition == 'cold_wave':
        recs.append(
            "Cold wave detected! Dress in layers, stay indoors, keep warm with heaters, and avoid prolonged exposure to cold.")
    else:
        recs.append(
            "Normal conditions. Maintain general safety: stay aware of weather changes and follow routine precautions.")

    if uvi > 3:
        recs.append(
            "High UV index! Apply sunscreen (SPF 30+), wear protective clothing, and avoid direct sun between 10 AM and 4 PM.")
    elif uvi > 0:
        recs.append(
            "Moderate UV index. Use sunscreen if outdoors for extended periods.")

    if humidity > 80:
        recs.append(
            "High humidity! Stay hydrated, watch for mold or heat exhaustion, and use dehumidifiers indoors.")
    elif humidity < 30:
        recs.append(
            "Low humidity! Use moisturizer to prevent dry skin, and consider a humidifier indoors.")

    return recs
