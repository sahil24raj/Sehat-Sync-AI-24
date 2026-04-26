from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="MedAlloc AI - ML Service")

try:
    model = joblib.load('model.pkl')
except:
    model = None

class PatientData(BaseModel):
    age: int
    oxygen_level: int
    symptoms_severity: int
    comorbidities: int

@app.post("/predict")
def predict_priority(data: PatientData):
    if not model:
        return {"error": "Model not loaded"}
    
    input_data = pd.DataFrame([{
        "age": data.age,
        "oxygen_level": data.oxygen_level,
        "symptoms_severity": data.symptoms_severity,
        "comorbidities": data.comorbidities
    }])
    
    priority_num = model.predict(input_data)[0]
    
    # Calculate a score 0-100 based on predict_proba
    probs = model.predict_proba(input_data)[0]
    # score can be a weighted sum
    score = int((probs[1] * 50) + (probs[2] * 100))
    
    labels = {0: "Low", 1: "Medium", 2: "High"}
    
    return {
        "priority_label": labels[priority_num],
        "priority_score": score
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
