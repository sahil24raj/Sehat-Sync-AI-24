import os
import json
from fastapi import FastAPI
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="MedAlloc AI - AI Priority Service")

# Initialize Groq client
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class PatientData(BaseModel):
    age: int
    oxygen_level: int
    symptoms_severity: int
    comorbidities: int

@app.post("/predict")
def predict_priority(data: PatientData):
    if not client.api_key:
         return {"error": "GROQ_API_KEY is missing. Please set it in .env file."}

    prompt = f"""
You are an AI medical triage assistant.
Evaluate the following patient data and determine their priority level (Low, Medium, High) and a score (0-100).
Patient Vitals:
- Age: {data.age}
- Oxygen Level: {data.oxygen_level}%
- Symptoms Severity (0-10): {data.symptoms_severity}
- Comorbidities (0=None, 1=Mild, 2=Severe): {data.comorbidities}

Return ONLY a valid JSON object with the exact keys "priority_label" and "priority_score". Do not include markdown formatting or any other text.
Example: {{"priority_label": "High", "priority_score": 85}}
"""
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192",
            temperature=0.1,
            response_format={"type": "json_object"}
        )
        
        response_content = chat_completion.choices[0].message.content
        result = json.loads(response_content)
        return {
            "priority_label": result.get("priority_label", "Medium"),
            "priority_score": int(result.get("priority_score", 50))
        }
    except Exception as e:
        print(f"Error calling Groq API: {e}")
        return {
            "priority_label": "Medium", # Fallback
            "priority_score": 50
        }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
