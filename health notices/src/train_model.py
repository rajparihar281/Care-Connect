import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

def train_model():
    data = pd.read_csv('data/raw/synthetic_weather.csv')
    X = data[['temperature', 'humidity', 'wind_speed']]
    y = data['condition']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    print(f"Model accuracy: {accuracy_score(y_test, predictions) * 100:.2f}%")
    
    os.makedirs('models/saved_models', exist_ok=True)
    joblib.dump(model, 'models/saved_models/weather_model.joblib')
    print("Model saved at models/saved_models/weather_model.joblib")

if __name__ == "__main__":
    train_model()