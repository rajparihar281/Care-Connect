from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pickle
import re
import json

app = Flask(__name__)
CORS(app)

# Global variables for model and vectorizer
model = None
vectorizer = None
label_encoder = None
disease_to_specialty = {}
symptom_keywords = set()

def load_or_train_model():
    """Load existing model or train a new one"""
    global model, vectorizer, label_encoder, disease_to_specialty, symptom_keywords
    
    try:
        with open('disease_model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('vectorizer.pkl', 'rb') as f:
            vectorizer = pickle.load(f)
        with open('label_encoder.pkl', 'rb') as f:
            label_encoder = pickle.load(f)
        with open('disease_specialty_map.json', 'r') as f:
            disease_to_specialty = json.load(f)
        with open('symptom_keywords.json', 'r') as f:
            symptom_keywords = set(json.load(f))
        print("Model loaded successfully!")
    except FileNotFoundError:
        print("Training new model...")
        train_model()

def train_model():
    """Train the disease prediction model"""
    global model, vectorizer, label_encoder, disease_to_specialty, symptom_keywords
    
    # Create comprehensive training dataset
    data = create_training_dataset()
    
    # Extract features and labels
    X = data['symptoms']
    y = data['disease']
    
    # Store all symptom keywords for validation
    for symptoms in X:
        words = re.findall(r'\b\w+\b', symptoms.lower())
        symptom_keywords.update(words)
    

    vectorizer = TfidfVectorizer(
        max_features=1000,
        ngram_range=(1, 3),
        min_df=1,
        max_df=0.95,
        stop_words=None,  
        sublinear_tf=True  
    )
    
    # Transform text to features
    X_vectorized = vectorizer.fit_transform(X)
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_vectorized, y_encoded, test_size=0.2, random_state=42
    )
    
    # Train Random Forest model with adjusted parameters for better performance
    model = RandomForestClassifier(
        n_estimators=400,  # Increased from 300
        max_depth=30,      # Increased from 25
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced',  # Handle class imbalance better
        max_features='sqrt'  # Better feature selection
    )
    model.fit(X_train, y_train)
    
    # Calculate accuracy
    accuracy = model.score(X_test, y_test)
    print(f"Model trained with accuracy: {accuracy:.2%}")
    
    # Create disease to specialty mapping
    disease_to_specialty = dict(zip(data['disease'], data['specialty']))
    
    # Save model and related objects
    with open('disease_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    with open('vectorizer.pkl', 'wb') as f:
        pickle.dump(vectorizer, f)
    with open('label_encoder.pkl', 'wb') as f:
        pickle.dump(label_encoder, f)
    with open('disease_specialty_map.json', 'w') as f:
        json.dump(disease_to_specialty, f)
    with open('symptom_keywords.json', 'w') as f:
        json.dump(list(symptom_keywords), f)

def create_training_dataset():
    """Create comprehensive training dataset with 5000+ samples"""
    
    # Define disease patterns with symptoms and specialties
    disease_data = {
        'Common Cold': {
            'symptoms': ['runny nose', 'sneezing', 'sore throat', 'cough', 'mild fever', 'congestion', 
                        'watery eyes', 'cold', 'stuffy nose', 'nasal discharge', 'blocked nose', 
                        'nose', 'sneeze', 'running nose', 'nasal congestion'],
            'specialty': 'General Physician'
        },
        'Influenza (Flu)': {
            'symptoms': ['high fever', 'body aches', 'fatigue', 'chills', 'headache', 'dry cough', 'weakness'],
            'specialty': 'General Physician'
        },
        'COVID-19': {
            'symptoms': ['fever', 'dry cough', 'tiredness', 'loss of taste', 'loss of smell', 'breathing difficulty', 'chest pain'],
            'specialty': 'Pulmonologist'
        },
        'Pneumonia': {
            'symptoms': ['chest pain', 'cough with phlegm', 'fever', 'shortness of breath', 'rapid breathing', 'fatigue', 'sweating'],
            'specialty': 'Pulmonologist'
        },
        'Bronchitis': {
            'symptoms': ['persistent cough', 'mucus production', 'chest discomfort', 'wheezing', 'shortness of breath', 'mild fever'],
            'specialty': 'Pulmonologist'
        },
        'Asthma': {
            'symptoms': ['wheezing', 'shortness of breath', 'chest tightness', 'coughing at night', 'difficulty breathing', 'rapid breathing'],
            'specialty': 'Pulmonologist'
        },
        'Migraine': {
            'symptoms': ['severe headache', 'nausea', 'sensitivity to light', 'sensitivity to sound', 'visual disturbances', 'throbbing pain'],
            'specialty': 'Neurologist'
        },
        'Tension Headache': {
            'symptoms': ['mild to moderate headache', 'pressure in forehead', 'tight band around head', 'neck pain', 'shoulder pain'],
            'specialty': 'Neurologist'
        },
        'Gastroenteritis': {
            'symptoms': ['diarrhea', 'vomiting', 'stomach cramps', 'nausea', 'fever', 'abdominal pain', 'dehydration'],
            'specialty': 'Gastroenterologist'
        },
        'Acid Reflux (GERD)': {
            'symptoms': ['heartburn', 'chest pain', 'difficulty swallowing', 'regurgitation', 'sour taste', 'burning sensation'],
            'specialty': 'Gastroenterologist'
        },
        'Irritable Bowel Syndrome': {
            'symptoms': ['abdominal pain', 'bloating', 'gas', 'diarrhea', 'constipation', 'cramping', 'mucus in stool'],
            'specialty': 'Gastroenterologist'
        },
        'Diabetes Type 2': {
            'symptoms': ['increased thirst', 'frequent urination', 'increased hunger', 'fatigue', 'blurred vision', 'slow healing wounds'],
            'specialty': 'Endocrinologist'
        },
        'Hypothyroidism': {
            'symptoms': ['fatigue', 'weight gain', 'cold sensitivity', 'dry skin', 'hair loss', 'muscle weakness', 'depression'],
            'specialty': 'Endocrinologist'
        },
        'Hyperthyroidism': {
            'symptoms': ['weight loss', 'rapid heartbeat', 'increased appetite', 'nervousness', 'tremors', 'sweating', 'heat intolerance'],
            'specialty': 'Endocrinologist'
        },
        'Hypertension': {
            'symptoms': ['headaches', 'dizziness', 'nosebleeds', 'chest pain', 'shortness of breath', 'vision problems', 'fatigue'],
            'specialty': 'Cardiologist'
        },
        'Coronary Artery Disease': {
            'symptoms': ['chest pain', 'shortness of breath', 'heart palpitations', 'weakness', 'nausea', 'sweating', 'jaw pain'],
            'specialty': 'Cardiologist'
        },
        'Arthritis': {
            'symptoms': ['joint pain', 'stiffness', 'swelling', 'reduced range of motion', 'redness', 'warmth in joints', 'morning stiffness'],
            'specialty': 'Rheumatologist'
        },
        'Osteoporosis': {
            'symptoms': ['back pain', 'loss of height', 'stooped posture', 'bone fractures', 'weakness', 'bone pain'],
            'specialty': 'Orthopedic'
        },
        'Dermatitis': {
            'symptoms': ['itchy skin', 'red rash', 'dry skin', 'blisters', 'swelling', 'burning sensation', 'skin lesions'],
            'specialty': 'Dermatologist'
        },
        'Psoriasis': {
            'symptoms': ['red patches', 'silvery scales', 'dry cracked skin', 'itching', 'burning', 'thick nails', 'joint pain'],
            'specialty': 'Dermatologist'
        },
        'Urinary Tract Infection': {
            'symptoms': ['burning urination', 'frequent urination', 'cloudy urine', 'strong smelling urine', 'pelvic pain', 'blood in urine'],
            'specialty': 'Urologist'
        },
        'Kidney Stones': {
            'symptoms': ['severe back pain', 'side pain', 'painful urination', 'blood in urine', 'nausea', 'vomiting', 'frequent urination'],
            'specialty': 'Nephrologist'
        },
        'Anemia': {
            'symptoms': ['fatigue', 'weakness', 'pale skin', 'shortness of breath', 'dizziness', 'cold hands', 'chest pain', 'irregular heartbeat'],
            'specialty': 'Hematologist'
        },
        'Depression': {
            'symptoms': ['persistent sadness', 'loss of interest', 'fatigue', 'sleep problems', 'appetite changes', 'difficulty concentrating', 'hopelessness'],
            'specialty': 'Psychiatrist'
        },
        'Anxiety Disorder': {
            'symptoms': ['excessive worry', 'restlessness', 'rapid heartbeat', 'sweating', 'trembling', 'difficulty concentrating', 'insomnia'],
            'specialty': 'Psychiatrist'
        },
        'Sinusitis': {
            'symptoms': ['facial pain', 'nasal congestion', 'thick nasal discharge', 'reduced sense of smell', 'headache', 'cough', 'fever'],
            'specialty': 'ENT Specialist'
        },
        'Tonsillitis': {
            'symptoms': ['sore throat', 'difficulty swallowing', 'swollen tonsils', 'fever', 'bad breath', 'neck swelling', 'tender lymph nodes'],
            'specialty': 'ENT Specialist'
        },
        'Conjunctivitis': {
            'symptoms': ['red eyes', 'itchy eyes', 'discharge', 'watery eyes', 'burning sensation', 'swollen eyelids', 'blurred vision'],
            'specialty': 'Ophthalmologist'
        },
        'Glaucoma': {
            'symptoms': ['eye pain', 'blurred vision', 'seeing halos', 'redness', 'nausea', 'vision loss', 'headache'],
            'specialty': 'Ophthalmologist'
        },
        'Dengue Fever': {
            'symptoms': ['high fever', 'severe headache', 'pain behind eyes', 'joint pain', 'muscle pain', 'rash', 'mild bleeding'],
            'specialty': 'General Physician'
        },
        'Malaria': {
            'symptoms': ['fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'muscle pain', 'fatigue'],
            'specialty': 'General Physician'
        },
        'Typhoid': {
            'symptoms': ['prolonged fever', 'weakness', 'stomach pain', 'headache', 'loss of appetite', 'constipation', 'rash'],
            'specialty': 'General Physician'
        },
        'Chickenpox': {
            'symptoms': ['itchy rash', 'blisters', 'fever', 'tiredness', 'loss of appetite', 'headache', 'red spots'],
            'specialty': 'Dermatologist'
        },
        'Measles': {
            'symptoms': ['fever', 'cough', 'runny nose', 'red eyes', 'rash', 'white spots in mouth', 'sore throat'],
            'specialty': 'General Physician'
        },
        'Hepatitis': {
            'symptoms': ['jaundice', 'fatigue', 'abdominal pain', 'loss of appetite', 'nausea', 'dark urine', 'pale stool'],
            'specialty': 'Hepatologist'
        },
        'Cirrhosis': {
            'symptoms': ['fatigue', 'easy bruising', 'swelling legs', 'yellow skin', 'itchy skin', 'weight loss', 'confusion'],
            'specialty': 'Hepatologist'
        },
        'Appendicitis': {
            'symptoms': ['sudden pain right side', 'nausea', 'vomiting', 'loss of appetite', 'fever', 'constipation', 'abdominal swelling'],
            'specialty': 'General Surgeon'
        },
        'Gallstones': {
            'symptoms': ['sudden pain upper right abdomen', 'back pain', 'nausea', 'vomiting', 'indigestion', 'bloating'],
            'specialty': 'Gastroenterologist'
        },
        'Pancreatitis': {
            'symptoms': ['upper abdominal pain', 'pain radiating to back', 'nausea', 'vomiting', 'fever', 'rapid pulse', 'tender abdomen'],
            'specialty': 'Gastroenterologist'
        },
        'Vertigo': {
            'symptoms': ['spinning sensation', 'loss of balance', 'nausea', 'vomiting', 'headache', 'sweating', 'ringing in ears'],
            'specialty': 'ENT Specialist'
        },
        'Epilepsy': {
            'symptoms': ['seizures', 'temporary confusion', 'staring spell', 'uncontrollable jerking', 'loss of consciousness', 'fear', 'anxiety'],
            'specialty': 'Neurologist'
        },
        "Parkinson's Disease": {
            'symptoms': ['tremors', 'slowed movement', 'rigid muscles', 'impaired posture', 'loss of balance', 'speech changes', 'writing changes'],
            'specialty': 'Neurologist'
        },
        "Alzheimer's Disease": {
            'symptoms': ['memory loss', 'difficulty planning', 'confusion', 'difficulty speaking', 'misplacing things', 'poor judgment', 'mood changes'],
            'specialty': 'Neurologist'
        },
        'Multiple Sclerosis': {
            'symptoms': ['numbness', 'tingling', 'weakness', 'vision problems', 'dizziness', 'fatigue', 'difficulty walking'],
            'specialty': 'Neurologist'
        },
        'Chronic Kidney Disease': {
            'symptoms': ['fatigue', 'swelling', 'shortness of breath', 'nausea', 'confusion', 'chest pain', 'high blood pressure'],
            'specialty': 'Nephrologist'
        },
        'Lupus': {
            'symptoms': ['fatigue', 'joint pain', 'rash', 'fever', 'chest pain', 'hair loss', 'sensitivity to light'],
            'specialty': 'Rheumatologist'
        },
        'Gout': {
            'symptoms': ['intense joint pain', 'redness', 'swelling', 'limited range of motion', 'tenderness', 'warmth'],
            'specialty': 'Rheumatologist'
        },
        'Fibromyalgia': {
            'symptoms': ['widespread pain', 'fatigue', 'sleep problems', 'cognitive difficulties', 'headaches', 'depression', 'anxiety'],
            'specialty': 'Rheumatologist'
        },
        'Sleep Apnea': {
            'symptoms': ['loud snoring', 'gasping during sleep', 'morning headache', 'excessive daytime sleepiness', 'difficulty concentrating', 'irritability'],
            'specialty': 'Pulmonologist'
        },
        'Tuberculosis': {
            'symptoms': ['persistent cough', 'coughing blood', 'chest pain', 'weight loss', 'fever', 'night sweats', 'fatigue'],
            'specialty': 'Pulmonologist'
        },
        'COPD': {
            'symptoms': ['shortness of breath', 'chronic cough', 'wheezing', 'chest tightness', 'frequent respiratory infections', 'fatigue', 'mucus production'],
            'specialty': 'Pulmonologist'
        }
    }
    
    # Generate variations of symptoms to create robust dataset
    training_data = []
    
    for disease, info in disease_data.items():
        symptoms_list = info['symptoms']
        specialty = info['specialty']
        
        # Generate 200+ variations per disease for robust training (increased from 150)
        for _ in range(200):
            # Random selection of 2-7 symptoms (increased upper bound)
            num_symptoms = np.random.randint(2, min(8, len(symptoms_list) + 1))
            selected_symptoms = np.random.choice(symptoms_list, num_symptoms, replace=False)
            
            # Create variations with different word orders and connectors
            connectors = [', ', ' and ', ', ', ' with ', ', also ']
            symptom_text = ''
            
            for i, symptom in enumerate(selected_symptoms):
                if i == 0:
                    symptom_text = symptom
                else:
                    connector = np.random.choice(connectors)
                    symptom_text += connector + symptom
            
            # Add some natural language variations with more diversity
            prefixes = ['I have ', 'Experiencing ', 'Suffering from ', 'Feeling ', 
                       'I am having ', 'Having ', '', 'Got ', 'Recently developed ',
                       'Patient has ', 'Started with ', 'Symptoms include ']
            suffixes = ['', ' for few days', ' since yesterday', ' since last week',
                       ' recently', ' from past 2 days', ' today', ' for a while',
                       ' getting worse', ' mild', ' severe']
            
            prefix = np.random.choice(prefixes)
            suffix = np.random.choice(suffixes)
            
            final_text = prefix + symptom_text + suffix
            
            training_data.append({
                'symptoms': final_text.strip(),
                'disease': disease,
                'specialty': specialty
            })
    
    df = pd.DataFrame(training_data)
    return df

def preprocess_symptoms(text):
    """Preprocess symptom text"""
    text = text.lower()
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def validate_symptoms(text):
    """Check if text contains valid medical symptom keywords"""
    words = set(re.findall(r'\b\w{3,}\b', text.lower()))
    common_words = {'have', 'experiencing', 'feeling', 'suffering', 'from', 'since', 
                   'yesterday', 'last', 'week', 'days', 'recently', 'past', 'got'}
    
    # Remove common words
    symptom_words = words - common_words
    
    # Check if at least one word matches known symptom keywords
    if symptom_keywords and len(symptom_words & symptom_keywords) > 0:
        return True
    return len(symptom_words) > 0

def check_manual_patterns(text):
    """
    Manual pattern matching for common symptom combinations
    Returns (disease, confidence, specialty) or None
    """
    text_lower = text.lower()
    
    # Common cold patterns
    cold_keywords = ['cold', 'runny', 'nose', 'sneez', 'congestion', 'stuffy']
    cold_count = sum(1 for keyword in cold_keywords if keyword in text_lower)
    if cold_count >= 2:
        return ('Common Cold', 0.75, 'General Physician')
    
    # Flu patterns
    flu_keywords = ['fever', 'headache', 'body', 'pain', 'ache', 'fatigue', 'chills']
    flu_count = sum(1 for keyword in flu_keywords if keyword in text_lower)
    if flu_count >= 2:
        return ('Influenza (Flu)', 0.70, 'General Physician')
    
    # Chest/respiratory
    if ('chest' in text_lower and 'pain' in text_lower) or \
       ('shortness' in text_lower and 'breath' in text_lower) or \
       ('breathing' in text_lower and 'difficulty' in text_lower):
        return ('Respiratory Infection', 0.65, 'Pulmonologist')
    
    # Stomach issues
    stomach_keywords = ['stomach', 'nausea', 'vomit', 'diarrhea', 'abdominal']
    stomach_count = sum(1 for keyword in stomach_keywords if keyword in text_lower)
    if stomach_count >= 2:
        return ('Gastroenteritis', 0.70, 'Gastroenterologist')
    
    return None

@app.route('/api/predict', methods=['POST'])
def predict_disease():
    """Predict disease from symptoms"""
    try:
        data = request.json
        symptoms_text = data.get('symptoms', '').strip()
        state = data.get('state', '')
        city = data.get('city', '')
        
        if not symptoms_text:
            return jsonify({
                'error': 'no_input',
                'message': 'Please enter your symptoms',
                'suggestions': get_common_symptom_suggestions()
            }), 400
        
        if not state or not city:
            return jsonify({
                'error': 'no_location',
                'message': 'Please select your location'
            }), 400
        
        # Preprocess symptoms
        processed_symptoms = preprocess_symptoms(symptoms_text)
        
        # Validate if symptoms contain medical keywords
        if not validate_symptoms(processed_symptoms):
            return jsonify({
                'error': 'no_match',
                'message': 'Could not identify valid symptoms. Please describe your health condition.',
                'suggestions': get_common_symptom_suggestions()
            }), 400
        
        # Manual pattern matching for common cases (boosts low confidence predictions)
        manual_override = check_manual_patterns(processed_symptoms)
        
        # Vectorize symptoms
        symptoms_vectorized = vectorizer.transform([processed_symptoms])
        
        # Predict disease
        prediction = model.predict(symptoms_vectorized)[0]
        probabilities = model.predict_proba(symptoms_vectorized)[0]
        
        # Get confidence score
        confidence = float(probabilities[prediction])
        
        # If manual override exists and has better confidence, use it
        if manual_override and manual_override[1] > confidence:
            disease = manual_override[0]
            confidence = manual_override[1]
            specialty = manual_override[2]
        else:
            # Get top 3 predictions for better decision making
            top_3_indices = np.argsort(probabilities)[-3:][::-1]
            top_3_predictions = [(label_encoder.inverse_transform([idx])[0], probabilities[idx]) for idx in top_3_indices]
            
            # Decode prediction
            disease = label_encoder.inverse_transform([prediction])[0]
            specialty = disease_to_specialty.get(disease, 'General Physician')
            
            # Very lenient threshold - accept almost any reasonable prediction
            if confidence < 0.08:  # Lowered from 0.10 to 0.08 (8%)
                # Check if any of top 3 predictions are reasonable
                if top_3_predictions[0][1] > 0.05:  # If best prediction is above 5%, use it
                    disease = top_3_predictions[0][0]
                    confidence = top_3_predictions[0][1]
                    specialty = disease_to_specialty.get(disease, 'General Physician')
                else:
                    return jsonify({
                        'error': 'low_confidence',
                        'message': 'Could not confidently predict. Please provide more specific symptoms.',
                        'suggestions': get_common_symptom_suggestions(),
                        'confidence': confidence
                    }), 400
        
        # Get top doctors
        doctors = get_doctors(specialty, state, city)
        
        return jsonify({
            'disease': disease,
            'confidence': confidence,
            'specialty': specialty,
            'doctors': doctors,
            'message': 'Prediction successful'
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'server_error',
            'message': 'An error occurred while processing your request'
        }), 500

def get_common_symptom_suggestions():
    """Return common symptom patterns as suggestions"""
    return [
        'fever, headache, body pain',
        'cough, cold, sore throat',
        'stomach pain, nausea, vomiting',
        'chest pain, shortness of breath',
        'skin rash, itching',
        'joint pain, swelling',
        'dizziness, fatigue',
        'back pain, muscle ache'
    ]

def get_doctors(specialty, state, city):
    """Get top 10 doctors for specialty in location"""
    # Mock doctor data - In production, this would query a real database
    doctor_names = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Reddy', 
                   'Gupta', 'Verma', 'Mehta', 'Joshi', 'Khan',
                   'Agarwal', 'Desai', 'Iyer', 'Nair', 'Rao']
    
    hospitals = ['Apollo Hospital', 'Fortis Healthcare', 'Max Hospital',
                'Manipal Hospital', 'AIIMS', 'Lilavati Hospital',
                'Kokilaben Hospital', 'Jaslok Hospital', 'Hinduja Hospital',
                'Breach Candy Hospital', 'Medanta', 'Columbia Asia']
    
    doctors = []
    for i in range(10):
        doctors.append({
            'id': i + 1,
            'name': f"Dr. {np.random.choice(doctor_names)}",
            'specialty': specialty,
            'rating': round(4.0 + np.random.random() * 1.0, 1),
            'experience': int(5 + np.random.random() * 20),
            'location': f"{city}, {state}",
            'hospital': np.random.choice(hospitals),
            'available': bool(np.random.random() > 0.3),
            'consultation_fee': int(500 + np.random.random() * 1500)
        })
    
    # Sort by rating
    doctors.sort(key=lambda x: x['rating'], reverse=True)
    return doctors

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'message': 'Disease Prediction API is running'
    })

@app.route('/api/diseases', methods=['GET'])
def get_diseases():
    """Get list of all diseases the model can predict"""
    if label_encoder:
        return jsonify({
            'diseases': list(label_encoder.classes_),
            'count': len(label_encoder.classes_)
        })
    return jsonify({'diseases': [], 'count': 0})

if __name__ == '__main__':
    print("Loading/Training Disease Prediction Model...")
    load_or_train_model()
    print(f"Model ready! Can predict {len(label_encoder.classes_)} diseases.")
    print("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5000)