import numpy as np
import pandas as pd
import os


def generate_synthetic_data(num_rows=1000):
    np.random.seed(42)  # For reproducibility
    temperatures = np.random.uniform(-20, 50, num_rows)
    humidities = np.random.uniform(0, 100, num_rows)
    wind_speeds = np.random.uniform(0, 50, num_rows)

    conditions = []
    for temp in temperatures:
        if temp > 35:
            conditions.append('heat_wave')
        elif temp < 5:
            conditions.append('cold_wave')
        else:
            conditions.append('normal')

    data = pd.DataFrame({
        'temperature': temperatures,
        'humidity': humidities,
        'wind_speed': wind_speeds,
        'condition': conditions
    })

    os.makedirs('data/raw', exist_ok=True)
    data.to_csv('data/raw/synthetic_weather.csv', index=False)
    print(
        f"Generated {num_rows} rows of synthetic data at data/raw/synthetic_weather.csv")


if __name__ == "__main__":
    generate_synthetic_data()
