import React, { useState, useEffect, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  Smile,
  Info,
  ShieldCheck,
} from "lucide-react";

// Mock API Data
const mockWeatherData = {
  "New York": {
    current: {
      temperature: 15,
      condition: "Cloudy",
      humidity: 72,
      windSpeed: 10,
      uvIndex: 2,
    },
    hourlyForecast: [
      { time: "10 AM", temp: 14 },
      { time: "11 AM", temp: 15 },
      { time: "12 PM", temp: 16 },
      { time: "1 PM", temp: 17 },
      { time: "2 PM", temp: 17 },
      { time: "3 PM", temp: 16 },
      { time: "4 PM", temp: 15 },
    ],
    alerts: [
      {
        type: "good",
        message: "Pleasant temperature throughout the day.",
        healthImpact: null,
      },
      {
        type: "bad",
        message: "Poor air quality advisory.",
        healthImpact:
          "Can cause respiratory issues, especially for sensitive groups (children, elderly, people with asthma).",
        precautions: [
          "Limit strenuous outdoor activities.",
          "Keep windows closed to keep polluted air out.",
          "Use an air purifier if available.",
        ],
      },
    ],
  },
  London: {
    current: {
      temperature: 12,
      condition: "Rainy",
      humidity: 88,
      windSpeed: 25,
      uvIndex: 1,
    },
    hourlyForecast: [
      { time: "10 AM", temp: 11 },
      { time: "11 AM", temp: 12 },
      { time: "12 PM", temp: 12 },
      { time: "1 PM", temp: 11 },
      { time: "2 PM", temp: 10 },
      { time: "3 PM", temp: 10 },
      { time: "4 PM", temp: 9 },
    ],
    alerts: [
      {
        type: "bad",
        message: "High humidity and rain. Risk of mold growth.",
        healthImpact:
          "High humidity can worsen asthma and allergy symptoms. Ensure good ventilation indoors.",
        precautions: [
          "Use a dehumidifier to reduce indoor moisture.",
          "Ensure bathrooms and kitchens are well-ventilated.",
          "Check for and repair any water leaks promptly.",
        ],
      },
      {
        type: "bad",
        message: "Strong winds expected.",
        healthImpact:
          "Be cautious of flying debris. High winds can trigger anxiety in some individuals.",
        precautions: [
          "Secure loose objects outdoors like furniture and trash cans.",
          "Avoid parking under large trees or power lines.",
          "Be cautious while driving, especially high-sided vehicles.",
        ],
      },
    ],
  },
  Tokyo: {
    current: {
      temperature: 28,
      condition: "Sunny",
      humidity: 60,
      windSpeed: 5,
      uvIndex: 8,
    },
    hourlyForecast: [
      { time: "10 AM", temp: 27 },
      { time: "11 AM", temp: 28 },
      { time: "12 PM", temp: 29 },
      { time: "1 PM", temp: 30 },
      { time: "2 PM", temp: 30 },
      { time: "3 PM", temp: 29 },
      { time: "4 PM", temp: 28 },
    ],
    alerts: [
      {
        type: "bad",
        message: "High UV Index today.",
        healthImpact:
          "High risk of harm from unprotected sun exposure. Seek shade, wear protective clothing, and use SPF 30+ sunscreen.",
        precautions: [
          "Limit sun exposure between 10 a.m. and 4 p.m.",
          "Wear sunglasses that block UVA and UVB rays.",
          "Stay hydrated by drinking plenty of water.",
        ],
      },
      {
        type: "good",
        message: "Perfect weather for outdoor activities!",
        healthImpact: null,
      },
    ],
  },
  Sydney: {
    current: {
      temperature: 22,
      condition: "Clear",
      humidity: 55,
      windSpeed: 15,
      uvIndex: 7,
    },
    hourlyForecast: [
      { time: "10 AM", temp: 21 },
      { time: "11 AM", temp: 22 },
      { time: "12 PM", temp: 23 },
      { time: "1 PM", temp: 24 },
      { time: "2 PM", temp: 23 },
      { time: "3 PM", temp: 22 },
      { time: "4 PM", temp: 21 },
    ],
    alerts: [
      {
        type: "good",
        message: "Clear skies and moderate temperature.",
        healthImpact: null,
      },
      {
        type: "bad",
        message: "Moderate UV Index.",
        healthImpact: "Sun protection is recommended during midday hours.",
        precautions: [
          "Apply a broad-spectrum sunscreen with SPF 30+.",
          "Wear a wide-brimmed hat to protect your face and neck.",
          "Be mindful of reflective surfaces like water and sand which increase UV exposure.",
        ],
      },
    ],
  },
};

// Helper to get weather icon
const WeatherIcon = ({ condition, size = 48 }) => {
  switch (condition.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun size={size} className="text-yellow-400" />;
    case "cloudy":
      return <Cloud size={size} className="text-gray-400" />;
    case "rainy":
      return <CloudRain size={size} className="text-blue-400" />;
    case "snowy":
      return <CloudSnow size={size} className="text-white" />;
    default:
      return <Cloud size={size} className="text-gray-400" />;
  }
};

// Main App Component
export default function HealthNotices() {
  const [location, setLocation] = useState("Tokyo");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = () => {
      setLoading(true);
      setError(null);
      // Simulate API call
      setTimeout(() => {
        if (mockWeatherData[location]) {
          setWeatherData(mockWeatherData[location]);
        } else {
          setError(
            'Location not found. Try "New York", "London", "Tokyo", or "Sydney".'
          );
          setWeatherData(null);
        }
        setLoading(false);
      }, 1000);
    };

    fetchWeatherData();
  }, [location]);

  const handleLocationChange = (e) => {
    if (e.key === "Enter") {
      setLocation(e.target.value);
    }
  };

  const uvIndexData = useMemo(() => {
    const uv = weatherData?.current?.uvIndex || 0;
    return [
      {
        name: "UV Index",
        value: uv,
        fill: uv > 7 ? "#ef4444" : uv > 4 ? "#f97316" : "#22c55e",
      },
    ];
  }, [weatherData]);

  const humidityData = useMemo(() => {
    const humidity = weatherData?.current?.humidity || 0;
    return [
      {
        name: "Humidity",
        value: humidity,
        fill: humidity > 70 ? "#3b82f6" : "#60a5fa",
      },
    ];
  }, [weatherData]);

  return (
    <>
      {/* Include Tailwind CSS CDN */}
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <style>
        {`
          .weather-dashboard {
            background: linear-gradient(135deg, #1e3a8a, #4c1d95);
          }
          .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          .card-hover:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
          }
          .input-focus {
            transition: all 0.3s ease;
          }
          .input-focus:focus {
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
            border-color: #3b82f6;
          }
          .alert-card {
            animation: fadeIn 0.5s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .chart-container {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 1rem;
            padding: 1.5rem;
          }
          .weather-icon {
            filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.3));
          }
          .header-title {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>
      <div className="weather-dashboard min-h-screen text-white font-sans p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2 header-title">
              Weather Dashboard
            </h1>
            <p className="text-center text-gray-300">
              Real-time weather, forecasts, and health alerts
            </p>
            <div className="mt-6 max-w-md mx-auto">
              <input
                type="text"
                placeholder="Enter a city (e.g., London) and press Enter"
                onKeyDown={handleLocationChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 input-focus transition-all"
              />
            </div>
          </header>

          {loading && (
            <div className="text-center text-xl text-gray-300 animate-pulse">
              Loading weather data...
            </div>
          )}
          {error && (
            <div className="text-center text-red-400 bg-red-900/30 p-4 rounded-lg max-w-md mx-auto border border-red-500/50">
              {error}
            </div>
          )}

          {weatherData && !loading && !error && (
            <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Current Weather & Alerts */}
              <div className="lg:col-span-1 space-y-8">
                {/* Current Weather Card */}
                <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl card-hover border border-gray-600">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-200">
                    Current Weather in{" "}
                    <span className="text-blue-300">{location}</span>
                  </h2>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-6xl font-bold text-white">
                        {weatherData.current.temperature}°C
                      </p>
                      <p className="text-xl text-gray-300">
                        {weatherData.current.condition}
                      </p>
                    </div>
                    <div className="transform scale-150 weather-icon">
                      <WeatherIcon
                        condition={weatherData.current.condition}
                        size={64}
                      />
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Droplets size={20} className="text-blue-300" />
                      <span>Humidity: {weatherData.current.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind size={20} className="text-gray-300" />
                      <span>Wind: {weatherData.current.windSpeed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer size={20} className="text-green-300" />
                      <span>UV Index: {weatherData.current.uvIndex}</span>
                    </div>
                  </div>
                </div>

                {/* Alerts Card */}
                <div className="bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl card-hover border border-gray-600">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-200">
                    Alerts & Health Advice
                  </h2>
                  <div className="space-y-4">
                    {weatherData.alerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border alert-card ${
                          alert.type === "bad"
                            ? "bg-red-900/40 border-red-500/60"
                            : "bg-green-900/40 border-green-500/60"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {alert.type === "bad" ? (
                            <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" />
                          ) : (
                            <Smile className="text-green-400 mt-1 flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-100">
                              {alert.message}
                            </p>
                            {alert.healthImpact && (
                              <div className="flex items-start gap-2 mt-2 text-sm text-gray-300">
                                <Info
                                  size={16}
                                  className="text-blue-400 mt-1 flex-shrink-0"
                                />
                                <p>{alert.healthImpact}</p>
                              </div>
                            )}
                            {alert.precautions &&
                              alert.precautions.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-white/20">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ShieldCheck
                                      size={16}
                                      className="text-green-400"
                                    />
                                    <h4 className="font-semibold text-sm text-gray-200">
                                      Precautions:
                                    </h4>
                                  </div>
                                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-300 pl-2">
                                    {alert.precautions.map((precaution, i) => (
                                      <li key={i}>{precaution}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Graphs */}
              <div className="lg:col-span-2 space-y-8">
                {/* Hourly Forecast Chart */}
                <div className="chart-container card-hover h-80">
                  <h2 className="text-2xl font-semibold mb-4 text-gray-200">
                    Hourly Temperature Forecast
                  </h2>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={weatherData.hourlyForecast}
                      margin={{ top: 5, right: 20, left: -10, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.2}
                      />
                      <XAxis dataKey="time" stroke="#9ca3af" dy={10} />
                      <YAxis unit="°C" stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #4b5563",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        name="Temperature"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Other Metrics Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="chart-container card-hover h-64">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">
                      UV Index
                    </h2>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={uvIndexData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          strokeOpacity={0.2}
                        />
                        <XAxis
                          type="number"
                          domain={[0, 11]}
                          stroke="#9ca3af"
                        />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.1)" }}
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #4b5563",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          barSize={30}
                          radius={[0, 10, 10, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-container card-hover h-64">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">
                      Humidity
                    </h2>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={humidityData}
                        layout="vertical"
                        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          strokeOpacity={0.2}
                        />
                        <XAxis
                          type="number"
                          domain={[0, 100]}
                          unit="%"
                          stroke="#9ca3af"
                        />
                        <YAxis type="category" dataKey="name" hide />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.1)" }}
                          contentStyle={{
                            backgroundColor: "#1f2937",
                            border: "1px solid #4b5563",
                          }}
                        />
                        <Bar
                          dataKey="value"
                          barSize={30}
                          radius={[0, 10, 10, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </main>
          )}
        </div>
      </div>
    </>
  );
}
  