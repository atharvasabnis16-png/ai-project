import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report

# Load dataset - find CSV file automatically
csv_file = None
for f in os.listdir('.'):
    if f.endswith('.csv'):
        csv_file = f
        break

if not csv_file:
    print("ERROR: No CSV file found in server/ml/ folder")
    exit()

print(f"Loading dataset: {csv_file}")
df = pd.read_csv(csv_file)
print(f"Dataset shape: {df.shape}")
print(df.head())

# Handle missing values
df = df.dropna()

# Encode categorical columns
le_education = LabelEncoder()
le_department = LabelEncoder()
le_target = LabelEncoder()

df['education_encoded'] = le_education.fit_transform(df['education_level'])
df['department_encoded'] = le_department.fit_transform(df['department'])

# Features and target
X = df[['age', 'years_experience', 'education_encoded',
        'department_encoded', 'performance_score']]
y = le_target.fit_transform(df['performance_category'])

# Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train Random Forest
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\n✅ Model Accuracy: {accuracy * 100:.2f}%")
print("\nClassification Report:")
print(classification_report(y_test, y_pred,
      target_names=le_target.classes_))

# Save everything
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('le_education.pkl', 'wb') as f:
    pickle.dump(le_education, f)
with open('le_department.pkl', 'wb') as f:
    pickle.dump(le_department, f)
with open('le_target.pkl', 'wb') as f:
    pickle.dump(le_target, f)

# Save feature importance
importances = pd.DataFrame({
    'feature': ['age', 'years_experience', 'education',
                'department', 'performance_score'],
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importances:")
print(importances)

print("\n✅ Model saved successfully!")
print("Files saved: model.pkl, le_education.pkl, le_department.pkl, le_target.pkl")
