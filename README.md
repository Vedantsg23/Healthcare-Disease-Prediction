# 🩺 Diabetes Risk Analyzer (Professional Edition)

![Hero Banner](static/images/hero.png)

A machine learning-powered web application for early diabetes detection, built entirely on a custom Flask backend with a beautiful, professional, glassmorphism-inspired HTML/CSS interface.

## ✨ Features

- **Predictive Analytics Engine**: Employs a trained machine learning model (`RandomForest`, `XGBoost`, etc.) to process clinical variables and output a highly accurate risk percentage.
- **Dynamic Medical Intelligence**: Features a sleek, interactive symptom checker. Click on symptoms like *Extreme Fatigue* or *Unexplained Weight Loss* to slide open personalized panels detailing modern medical approaches (such as Metformin, SGLT2 inhibitors) and essential lifestyle changes.
- **Embedded AI Chatbot**: A native, responsive healthcare assistant ready to explain the machine learning model, dive deeper into specific medications, or break down the nuances of diabetes diets.
- **Premium Aesthetics**: Utilizes cutting-edge Vanilla CSS involving deep gradient blending, absolute positioning, custom UI spinners, and Google's `Inter` typeface for an enterprise-level feel.
- **Result Insights**: When a high-risk prediction is made, the app dynamically generates a custom report directly within the prediction box, immediately presenting the specific symptoms to watch out for along with common medical treatments.

## 🚀 Getting Started

This application has been fully decoupled from older frameworks (no Streamlit required) and is now a robust, native **Flask** application.

### Prerequisites

Ensure you have Python installed. Install the dependencies via:

```bash
pip install -r requirements.txt
```

### Running the Application

Simply run the Flask server:

```bash
python app.py
```

Then, open your web browser and navigate to:
**http://127.0.0.1:5000**

## 💻 Tech Stack
- **Backend Model**: Python, scikit-learn, joblib, pandas
- **Server API**: Flask
- **Frontend Architecture**: HTML5, Vanilla JavaScript
- **Styling**: Vanilla CSS3 (Custom Properties, Flexbox, CSS Grid)

## ⚠️ Disclaimer
This tool was developed strictly for educational machine learning purposes. It should **not** be used as a medical diagnosis tool. The information provided heavily utilizes generic medical databases, and users should always consult a licensed physician regarding actual diabetes diagnosis or medication dosages.

---
*Developed by Vedant Gadage | Healthcare Disease Prediction*
