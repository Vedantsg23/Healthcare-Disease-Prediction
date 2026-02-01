# 🩺 Diabetes Risk Analyzer (Healthcare Predictive Analytics)

A complete **Machine Learning + Streamlit** project that predicts the **risk of Diabetes** using patient medical data.
This project includes **EDA, data normalization, model training, evaluation**, and an attractive **Streamlit Web App** for real-time predictions.

---

## 🌐 Live Demo
✅ https://healthcare-disease-prediction-c9wdfwculfhbgue7guecfu.streamlit.app/



## 🌟 Project Highlights
✅ Beginner-friendly project with full steps  
✅ End-to-end ML pipeline (dataset → model → app)  
✅ Data normalization using `StandardScaler`  
✅ Classification models used:
- Logistic Regression
- Random Forest Classifier  
✅ Evaluation using:
- Accuracy
- Recall
- ROC-AUC  
✅ Feature importance analysis  
✅ Saved trained model (`.pkl`)  
✅ Streamlit UI with sidebar inputs  

---

## 🎯 Problem Statement
Diabetes is a major health condition affecting millions of people.
Early detection can help patients take preventive measures.
This project predicts whether a patient is likely to have diabetes based on health attributes.

---

## 🧾 Dataset Information
Dataset: **Diabetes Dataset (UCI / Kaggle)**  
File used: `data/diabetes.csv`

Target column: **Outcome**
- `0` → Not Diabetic
- `1` → Diabetic

Common features include:
- Pregnancies
- Glucose
- Blood Pressure
- Skin Thickness
- Insulin
- BMI
- Diabetes Pedigree Function
- Age

---

## 📂 Project Folder Structure

disease prediction/
│── disease_project.ipynb
│── requirements.txt
│── README.md
│── .gitignore
│
├── data/
│ └── diabetes.csv
│
├── model/
│ ├── diabetes_model.pkl
│ ├── scaler.pkl
│ └── training_columns.pkl
│
└── app/
└── app.py



---

## ⚙️ Installation & Setup (For Beginners)

### ✅ Step 1: Install Python
Download and install Python (3.10 or higher recommended)

✅ Check python installation:
```bash
python --version

✅ Step 2: Download / Clone this Repository
Option A: Clone using Git (recommended)
git clone https://github.com/YOUR_USERNAME/Healthcare-Disease-Prediction.git
cd Healthcare-Disease-Prediction

Option B: Download ZIP

Open the GitHub repository

Click Code → Download ZIP

Extract the ZIP file

Open folder in VS Code

✅ Step 3: Install Dependencies

Run this inside your project folder terminal:
python -m pip install -r requirements.txt


✅ How to Run the Project (Locally)
✅ Option 1: Run Streamlit Web App (Recommended)

python -m streamlit run app/app.py

After running, it will show a link like:
✅ http://localhost:8501

Open it in your browser.

✅ Option 2: Run Jupyter Notebook (Training + EDA)

The notebook performs:
✅ EDA
✅ Model training
✅ Evaluation
✅ Feature importance
✅ Model saving

Open:

disease_project.ipynb

Run each cell step-by-step.


📊 Model Training Details

The following models were trained:

Logistic Regression

Random Forest Classifier

The final model is saved in the model/ folder:

diabetes_model.pkl

scaler.pkl

training_columns.pkl

📈 Evaluation Metrics

We evaluate using:

✅ Accuracy – overall correctness
✅ Recall – ability to detect diabetic cases (important in healthcare)
✅ ROC-AUC – performance of probability-based predictions

Also included:

Confusion matrix

Classification report



⭐ Feature Importance

Random Forest feature importance is used to identify the most impactful medical features such as:

Glucose

BMI

Age

Insulin

This helps understand which attributes contribute more to diabetes prediction.

🔐 Ethical Considerations & Patient Privacy

This project is for educational purposes only.

✅ Ethical handling ensured:

Dataset contains no personal identity information (no name, phone, address, etc.)

No patient data is stored by the app

Model predictions are not medical diagnosis

In real-world systems, privacy laws and secure data storage must be followed

⚠️ Always consult a healthcare professional for actual diagnosis.

🚀 Deployment (Streamlit Cloud)

This project can be deployed on Streamlit Cloud.
(Deployment steps provided below in this README.)

👨‍💻 Author

Vedant Gadage


✅ Replace `YOUR_USERNAME` in the clone link with your GitHub username.

---

# ✅ 2) Deploy on Streamlit Cloud (Step-by-step)

## ✅ Step 1: Push these files on GitHub (Must)
Your repo must contain:

✅ `app/app.py`  
✅ `requirements.txt`  
✅ `model/diabetes_model.pkl`  
✅ `model/scaler.pkl`  
✅ `model/training_columns.pkl`

(Your app needs the model files.)

---

## ✅ Step 2: Open Streamlit Cloud
1. Go to **Streamlit Community Cloud**
2. Login using GitHub

---

## ✅ Step 3: Create New App
Click:

✅ **New app**

Then select:
- ✅ Repository: your diabetes repo
- ✅ Branch: `main`
- ✅ Main file path:

✅ `app/app.py`

Then click:

✅ **Deploy**

---

## ✅ Step 4: If Streamlit Shows Error After Deployment
Most common issue: Missing libraries  
✅ Fix: ensure `requirements.txt` is present.

If model missing:
✅ ensure `model/*.pkl` files are uploaded in GitHub.

---

## ✅ Step 5: Add Live Link in README
Once deployed, Streamlit gives a link like:

✅ `https://your-app-name.streamlit.app`

Add it in README in “Live Demo” section.

Then push update:

```bash
git add README.md
git commit -m "Added Streamlit live demo link"
git push


