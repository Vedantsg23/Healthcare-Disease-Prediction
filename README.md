# 🏥 MediSense AI — Healthcare Disease Prediction

<div align="center">

![MediSense AI](https://img.shields.io/badge/MediSense-AI%20Powered-00d4b4?style=for-the-badge&logo=heart&logoColor=white)
![ML Model](https://img.shields.io/badge/ML-Native%20JS-f97316?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9%2B-3776ab?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

**An AI-powered healthcare web application that predicts diseases from symptoms, provides medicine recommendations, and includes a secure AI health chatbot.**

[🌐 Live Demo](#) • [📖 Documentation](#how-it-works) • [🐛 Report Bug](https://github.com/Vedantsg23/Healthcare-Disease-Prediction/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Symptom Checker** | Select from 132 medically recognised symptoms |
| 🧠 **AI Prediction** | Pattern matching engine predicts 41+ diseases instantly |
| 💊 **Medicine Guide** | Detailed medicine recommendations with dosage & safety info |
| 🤖 **AI Chatbot** | Claude AI-powered assistant via secure backend proxy |
| 📚 **Disease Library** | Comprehensive encyclopedia of 41 diseases |
| 🍎 **Diet & Lifestyle** | Condition-specific nutrition and lifestyle advice |
| 🎨 **Modern UI** | Dark-themed, glassmorphic, responsive professional interface |

---

## 🚀 Quick Start (Flask Backend)

This is the recommended way to run the application to ensure the AI Chatbot works securely.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Vedantsg23/Healthcare-Disease-Prediction.git
   cd Healthcare-Disease-Prediction
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up your API Key (Optional for Chatbot):**
   Create a `.env` file in the root directory:
   ```env
   ANTHROPIC_API_KEY=your_actual_api_key_here
   ```

4. **Run the server:**
   ```bash
   python app.py
   ```

5. **Visit the app:**
   Open `http://localhost:5000` in your browser.

---

## 🤖 AI Chatbot Setup

The chatbot uses the **Anthropic Claude API**. The application is designed with a **secure proxy architecture**:

- **Frontend**: Sends chat requests to a local `/api/chat` route.
- **Backend (Flask)**: Proxies requests to Anthropic using your API key stored safely in environment variables.
- **Security**: This prevents your API key from ever being exposed to the user's browser.

---

## 🧬 Prediction Engine

The application uses an intelligent pattern-matching engine (inspired by Naive Bayes logic) that analyses 132 symptom vectors across 41 medical conditions.

- **Accuracy**: Optimized for high-confidence matching of clinical symptom patterns.
- **Speed**: Returns results in under 200ms using client-side processing.

---

## 📁 Project Structure

```
Healthcare-Disease-Prediction/
│
├── app.py              # Flask Backend (Production Server)
├── requirements.txt    # Python dependencies
├── .env                # API Keys (Local only, Git ignored)
│
├── templates/          # HTML Templates
│   └── index.html      # Main Application UI
│
├── static/             # Static Assets
│   ├── css/
│   │   └── style.css   # Modern Glassmorphic Styling
│   └── js/
│       ├── app.js      # Core Application & Chatbot Logic
│       └── data.js     # Disease & Symptom Database
│
└── data/               # Raw Data Files
    └── diabetes.csv    # Reference Datasets
```

---

## 🌐 Deployment

### Deploy to Render / Heroku
The project is ready for production deployment. Use the following settings:
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app` (or `python app.py` for simpler hosts)

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

This project is licensed under the **MIT License**.

<div align="center">
Made with ❤️ for better healthcare accessibility
</div>
