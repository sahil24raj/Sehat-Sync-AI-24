import pandas as pd
import numpy as np

np.random.seed(42)
n_samples = 500

# Features: age, oxygen_level, symptoms_severity, comorbidities
age = np.random.randint(10, 95, n_samples)
oxygen_level = np.random.randint(70, 100, n_samples)
symptoms_severity = np.random.randint(0, 100, n_samples)
comorbidities = np.random.randint(0, 3, n_samples)

# Rule based priority for training:
# priority: 0 (Low), 1 (Medium), 2 (High)
priority = []
for i in range(n_samples):
    score = 0
    if age[i] > 60: score += 1
    if oxygen_level[i] < 90: score += 2
    if oxygen_level[i] < 80: score += 3
    if symptoms_severity[i] > 70: score += 2
    if comorbidities[i] == 2: score += 1
    
    if score >= 5:
        priority.append(2)
    elif score >= 2:
        priority.append(1)
    else:
        priority.append(0)

df = pd.DataFrame({
    'age': age,
    'oxygen_level': oxygen_level,
    'symptoms_severity': symptoms_severity,
    'comorbidities': comorbidities,
    'priority': priority
})

df.to_csv('dataset.csv', index=False)
print("Dataset generated.")
