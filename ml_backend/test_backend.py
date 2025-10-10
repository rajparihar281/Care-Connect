"""
Test script to verify the disease prediction backend is working correctly
Run this after starting the Flask backend to test predictions
"""

import requests
import json

# Backend URL
BASE_URL = "http://localhost:5000"

def test_prediction(symptoms, state="Delhi", city="New Delhi"):
    """Test a prediction"""
    print(f"\n{'='*60}")
    print(f"Testing: '{symptoms}'")
    print(f"Location: {state}, {city}")
    print('='*60)
    
    try:
        response = requests.post(
            f"{BASE_URL}/api/predict",
            json={
                "symptoms": symptoms,
                "state": state,
                "city": city
            },
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if response.status_code == 200:
            print(f"✅ SUCCESS!")
            print(f"Disease: {data['disease']}")
            print(f"Confidence: {data['confidence']:.2%}")
            print(f"Specialty: {data['specialty']}")
            print(f"Doctors Found: {len(data['doctors'])}")
        else:
            print(f"⚠️ ERROR: {data.get('error', 'Unknown')}")
            print(f"Message: {data.get('message', 'No message')}")
            if 'suggestions' in data:
                print(f"Suggestions: {len(data['suggestions'])} alternatives")
    
    except requests.exceptions.ConnectionError:
        print("❌ FAILED: Cannot connect to backend. Is it running on port 5000?")
    except Exception as e:
        print(f"❌ FAILED: {str(e)}")

def test_health():
    """Test health endpoint"""
    print("\n" + "="*60)
    print("Testing Backend Health")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        data = response.json()
        
        print(f"Status: {data.get('status', 'Unknown')}")
        print(f"Model Loaded: {data.get('model_loaded', False)}")
        print(f"Message: {data.get('message', 'No message')}")
        
        if data.get('model_loaded'):
            print("✅ Backend is healthy!")
        else:
            print("⚠️ Model not loaded properly!")
            
    except requests.exceptions.ConnectionError:
        print("❌ Backend not running!")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    print("\n🔬 Disease Prediction Backend Test Suite")
    print("="*60)
    
    # Test 1: Health check
    test_health()
    
    # Test 2: The failing case
    test_prediction("cold, runny nose, sneezing")
    
    # Test 3: Clear symptoms
    test_prediction("fever, headache, body pain")
    
    # Test 4: Single word
    test_prediction("fever")
    
    # Test 5: Chest pain
    test_prediction("chest pain, shortness of breath")
    
    # Test 6: Stomach issues
    test_prediction("stomach pain, nausea, vomiting")
    
    # Test 7: Invalid input
    test_prediction("hello world")
    
    # Test 8: Empty input
    test_prediction("")
    
    print("\n" + "="*60)
    print("Test Suite Complete!")
    print("="*60)

if __name__ == "__main__":
    main()