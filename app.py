from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load models safely
try:
    model = joblib.load("model/diabetes_model.pkl")
    scaler = joblib.load("model/scaler.pkl")
    training_columns = joblib.load("model/training_columns.pkl")
except Exception as e:
    print(f"Error loading models: {e}")
    model, scaler, training_columns = None, None, None

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'error': 'Server model not loaded property.'}), 500

    data = request.json
    
    # Construct input dataframe
    try:
        input_data = {
            "Pregnancies": float(data.get("Pregnancies", 0)),
            "Glucose": float(data.get("Glucose", 0)),
            "BloodPressure": float(data.get("BloodPressure", 0)),
            "SkinThickness": float(data.get("SkinThickness", 0)),
            "Insulin": float(data.get("Insulin", 0)),
            "BMI": float(data.get("BMI", 0)),
            "DiabetesPedigreeFunction": float(data.get("DiabetesPedigreeFunction", 0)),
            "Age": float(data.get("Age", 0))
        }
    except ValueError:
        return jsonify({'error': 'Invalid numerical inputs.'}), 400

    input_df = pd.DataFrame([input_data])
    input_df = input_df[training_columns] # Ensure correct column order

    # Scale input
    scaled_input = scaler.transform(input_df)

    # Predict
    prediction = int(model.predict(scaled_input)[0])
    probability = float(model.predict_proba(scaled_input)[0][1])

    return jsonify({
        'prediction': prediction,
        'probability': round(probability * 100, 2)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
