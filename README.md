# 🏥 MediSense AI — Healthcare Disease Prediction

<div align="center">

![MediSense AI](https://img.shields.io/badge/MediSense-AI%20Powered-00d4b4?style=for-the-badge&logo=heart&logoColor=white)
![ML Model](https://img.shields.io/badge/ML-Native%20JS-f97316?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.9%2B-3776ab?style=for-the-badge&logo=python)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)

**An AI-powered healthcare web application that predicts diseases from symptoms, provides medicine recommendations, and includes a secure AI health chatbot.**

[🌐 Live demo](https://healthcare-disease-prediction.vercel.app) • [📖 Documentation](#-prediction-engine) • [🐛 Report Bug](https://github.com/Vedantsg23/Healthcare-Disease-Prediction/issues)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔬 **Symptom Checker** | Search and pick from 132 symptoms |
| 🧠 **AI Prediction** | A pattern matching engine finds the closest condition instantly, in the browser |
| 💊 **Medicine Guide** | Detailed medicine recommendations with dosage & safety info |
| 🤖 **AI Chatbot** | Claude AI-powered assistant via secure backend proxy |
| 📚 **Disease Library** | 33 conditions to search and filter, 10 with full care guides |
| 🍎 **Diet & Lifestyle** | Condition-specific nutrition and lifestyle advice |
| 🎨 **Editorial UI** | Clean editorial design in white, black and cobalt (Geist and Inter), responsive and keyboard friendly |

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
- **No key on Vercel**: without `ANTHROPIC_API_KEY`, the backend uses the [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) with the deployment's own OIDC token. It asks for Claude first and falls back to a model the gateway's free tier allows. `AI_GATEWAY_API_KEY` works too, and `ANTHROPIC_MODEL` / `AI_GATEWAY_MODEL` choose the model.

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
│   │   └── style.css   # Editorial styling (white, black, cobalt)
│   └── js/
│       ├── app.js      # Core Application & Chatbot Logic
│       └── data.js     # Disease & Symptom Database
│
└── data/               # Raw Data Files
    └── diabetes.csv    # Reference Datasets
```

---

## 🌐 Deployment

### Vercel (live)
`vercel.json` deploys `app.py` with the Python runtime. Every push to `main` redeploys
[healthcare-disease-prediction.vercel.app](https://healthcare-disease-prediction.vercel.app).

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
