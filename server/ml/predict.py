import sys
import json
import pickle
import numpy as np

# Load all saved files
with open('server/ml/model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('server/ml/le_education.pkl', 'rb') as f:
    le_education = pickle.load(f)
with open('server/ml/le_department.pkl', 'rb') as f:
    le_department = pickle.load(f)
with open('server/ml/le_target.pkl', 'rb') as f:
    le_target = pickle.load(f)

# Get input
data = json.loads(sys.argv[1])

# Encode inputs safely
def safe_encode(encoder, value):
    try:
        return encoder.transform([value])[0]
    except:
        return 0

education_enc = safe_encode(le_education, data.get('education_level', 'Bachelor'))
department_enc = safe_encode(le_department, data.get('department', 'HR'))

features = np.array([[
    data.get('age', 25),
    data.get('years_experience', 2),
    education_enc,
    department_enc,
    data.get('performance_score', 5)
]])

prediction = model.predict(features)
probabilities = model.predict_proba(features)[0]
predicted_category = le_target.inverse_transform(prediction)[0]
confidence = round(float(probabilities.max()) * 100, 2)

result = {
    "performance_category": predicted_category,
    "confidence": confidence,
    "all_probabilities": {
        le_target.inverse_transform([i])[0]: round(float(p) * 100, 2)
        for i, p in enumerate(probabilities)
    }
}

print(json.dumps(result))
