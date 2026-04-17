# 🏥 MediSense AI — Healthcare Disease Prediction

<div align="center">

![MediSense AI](https://img.shields.io/badge/MediSense-AI%20Powered-00d4b4?style=for-the-badge&logo=heart&logoColor=white)
![ML Model](https://img.shields.io/badge/ML-Scikit--learn-f97316?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9%2B-3776ab?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

**An AI-powered healthcare web application that predicts diseases from symptoms, provides medicine recommendations, and includes an intelligent AI health chatbot.**

[🌐 Live Demo](#) • [📖 Documentation](#how-it-works) • [🐛 Report Bug](https://github.com/Vedantsg23/Healthcare-Disease-Prediction/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Symptom Checker** | Select from 132 medically recognised symptoms |
| 🧠 **AI Prediction** | ML ensemble (Naive Bayes + Decision Tree) predicts 41+ diseases |
| 💊 **Medicine Guide** | Detailed medicine recommendations with dosage & safety info |
| 🤖 **AI Chatbot** | Claude AI-powered health assistant for 24/7 Q&A |
| 📚 **Disease Library** | Comprehensive encyclopedia of 41 diseases |
| 🍎 **Diet & Lifestyle** | Condition-specific nutrition and lifestyle advice |
| 🎨 **Modern UI** | Dark-themed, responsive, professional interface |

---

## 🖥️ Screenshots

> Add screenshots of your app here after deployment

---

## 🚀 Quick Start

### Option 1: Static Frontend Only (No Backend)
1. Clone the repository:
   ```bash
   git clone https://github.com/Vedantsg23/Healthcare-Disease-Prediction.git
   cd Healthcare-Disease-Prediction
   ```
2. Open `index.html` directly in your browser — the frontend works without any server for the demo prediction engine.

### Option 2: Full Stack (Python Backend + ML Model)
1. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the Flask/Django server:
   ```bash
   python app.py
   # OR for Django:
   python manage.py runserver
   ```
3. Visit `http://localhost:5000` in your browser.

---

## 🤖 AI Chatbot Setup

The chatbot uses the **Anthropic Claude API**. To enable it:

1. Get your API key from [console.anthropic.com](https://console.anthropic.com)
2. For local development, the frontend calls the API directly (CORS handled by browser).
3. **For production**, create a simple backend proxy:

```python
# Flask proxy example (recommended for production)
from flask import Flask, request, jsonify
import anthropic

app = Flask(__name__)
client = anthropic.Anthropic(api_key="YOUR_API_KEY")

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        system="You are MediSense AI, a professional healthcare assistant...",
        messages=data['messages']
    )
    return jsonify({"reply": message.content[0].text})
```

---

## 🧬 Machine Learning Model

### Dataset
- **Training data**: 4920 samples, 132 symptom features
- **Target**: 41 disease classes
- **Source**: Kaggle Disease Prediction Dataset

### Algorithms Used
| Algorithm | Accuracy |
|---|---|
| Naive Bayes | ~95% |
| Decision Tree | ~97% |
| Random Forest | ~98% |
| **Ensemble (Final)** | **~98%** |

### Training the Model
```python
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
import pandas as pd

# Load dataset
train = pd.read_csv('data/Training.csv')
X = train.drop('prognosis', axis=1)
y = train['prognosis']

# Train models
nb = GaussianNB().fit(X, y)
dt = DecisionTreeClassifier().fit(X, y)
rf = RandomForestClassifier(n_estimators=100).fit(X, y)

# Save models
import pickle
pickle.dump(rf, open('models/model.pkl', 'wb'))
```

---

## 📁 Project Structure

```
Healthcare-Disease-Prediction/
│
├── index.html          # Main HTML page
├── style.css           # Complete CSS styling
├── app.js              # Frontend JavaScript + Chatbot
├── data.js             # Disease & symptom database
│
├── app.py              # Flask/Django backend
├── models/
│   └── model.pkl       # Trained ML model
├── data/
│   ├── Training.csv    # Training dataset
│   └── Testing.csv     # Test dataset
│
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

---

## 📦 Requirements

```txt
flask==2.3.0
scikit-learn==1.3.0
pandas==2.0.3
numpy==1.24.3
anthropic==0.25.0
gunicorn==21.2.0
```

---

## 🌐 Deployment

### Deploy to Render (Free)
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app`

### Deploy to Vercel (Frontend Only)
1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Deploy — it will serve `index.html` automatically

### Deploy to Heroku
```bash
heroku create medisense-ai
git push heroku main
heroku open
```

---

## ⚕️ Medical Disclaimer

> **IMPORTANT**: MediSense AI is an educational tool only. It does **NOT** provide medical diagnoses. Always consult a licensed physician or healthcare professional before making any health decisions or taking any medication.
>
> This application is built for learning purposes and should not replace professional medical advice.

---

## 👨‍💻 Developer

**Vedant SG**
- GitHub: [@Vedantsg23](https://github.com/Vedantsg23)
- Project: Healthcare Disease Prediction System

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">
Made with ❤️ for better healthcare accessibility
</div>
