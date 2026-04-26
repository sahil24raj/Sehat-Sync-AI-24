import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

print("Loading dataset...")
df = pd.read_csv('dataset.csv')

X = df[['age', 'oxygen_level', 'symptoms_severity', 'comorbidities']]
y = df['priority']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("Training model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

print(f"Accuracy: {model.score(X_test, y_test)}")

joblib.dump(model, 'model.pkl')
print("Model saved to model.pkl")
