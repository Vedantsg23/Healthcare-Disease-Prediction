import streamlit as st
import pandas as pd
import joblib
import time
import os

# ---------------- PAGE CONFIG ----------------
st.set_page_config(page_title="Diabetes Risk Analyzer", page_icon="🩺", layout="wide")

# ---------------- LOAD FILES ----------------
@st.cache_resource
def load_models():
    # Use relative paths from root
    model = joblib.load("model/diabetes_model.pkl")
    scaler = joblib.load("model/scaler.pkl")
    training_columns = joblib.load("model/training_columns.pkl")
    return model, scaler, training_columns

try:
    model, scaler, training_columns = load_models()
except Exception as e:
    st.error(f"Error loading models: {e}")
    st.stop()

# ---------------- CSS ----------------
st.markdown("""
<style>
.main { background-color: #f4f7fb; }
.header-box {
    padding: 24px;
    border-radius: 20px;
    background: linear-gradient(135deg, #0ea5e9, #10b981);
    color: white;
    text-align: center;
}
.card {
    padding: 20px;
    border-radius: 16px;
    background: white;
    box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
    margin-bottom: 20px;
}
</style>
""", unsafe_allow_html=True)

# ---------------- HEADER ----------------
st.markdown("""
<div class="header-box">
    <h1>🩺 Diabetes Risk Analyzer & Assistant</h1>
    <p>Advanced Healthcare Predictive Analytics (Streamlit Deployment Version)</p>
</div>
<br>
""", unsafe_allow_html=True)

# ---------------- SIDEBAR ----------------
st.sidebar.title("🧾 Patient Inputs")
pregnancies = st.sidebar.slider("Pregnancies", 0, 20, 1)
glucose = st.sidebar.slider("Glucose Level", 0, 300, 120)
blood_pressure = st.sidebar.slider("Blood Pressure", 0, 200, 70)
skin_thickness = st.sidebar.slider("Skin Thickness", 0, 100, 20)
insulin = st.sidebar.slider("Insulin", 0, 900, 80)
bmi = st.sidebar.slider("BMI", 0.0, 80.0, 25.0)
diabetes_pedigree = st.sidebar.slider("Diabetes Pedigree Function", 0.0, 3.0, 0.5)
age = st.sidebar.slider("Age", 1, 120, 30)
predict_btn = st.sidebar.button("🔍 Predict Risk", use_container_width=True)

# ---------------- DATA PREP ----------------
input_data = {
    "Pregnancies": pregnancies, "Glucose": glucose, "BloodPressure": blood_pressure,
    "SkinThickness": skin_thickness, "Insulin": insulin, "BMI": bmi,
    "DiabetesPedigreeFunction": diabetes_pedigree, "Age": age
}
input_df = pd.DataFrame([input_data])
input_df = input_df[training_columns]
scaled_input = scaler.transform(input_df)

# ---------------- TABS ----------------
tab1, tab2, tab3 = st.tabs(["🔍 Risk Prediction", "📚 Info & Guidance", "🤖 Chat Assistant"])

with tab1:
    col1, col2 = st.columns([2, 1])
    with col1:
        st.subheader("📋 Patient Summary")
        st.dataframe(input_df, use_container_width=True)
        st.subheader("🧠 Prediction Result")

        if predict_btn:
            with st.spinner("Analyzing risk..."):
                time.sleep(1)
                prediction = model.predict(scaled_input)[0]
                probability = model.predict_proba(scaled_input)[0][1]

            st.metric("Risk Probability", f"{probability*100:.2f}%")

            if prediction == 1:
                st.error("⚠️ High Risk of Diabetes Detected")
                st.markdown("""
                **🩺 Common Symptoms to Watch For:**
                - Excessive Thirst & Frequent Urination
                - Unexplained Weight Loss & Fatigue
                - Tingling or Numbness in Hands/Feet
                
                **💊 Typical Medications (Medical Reference Only):**
                - **Metformin**: prescribed first to manage blood sugar levels.
                - **Insulin Therapy**: Used for deeper insulin resistance.
                """)
            else:
                st.success("✅ Low Risk. Maintain a healthy routine!")
        else:
            st.info("👈 Adjust the values and click Predict Risk")

    with col2:
        st.subheader("🩻 Health Tips")
        st.write("✅ Exercise daily (30 mins)")
        st.write("✅ Reduce sugar intake")
        st.write("✅ Drink plenty of water")

with tab2:
    if os.path.exists("static/images/hero.png"):
        st.image("static/images/hero.png", use_container_width=True)
    st.markdown("### 🩺 Educational Information")
    st.info("**Disclaimer**: Information is strictly for educational purposes.")
    st.video("https://www.youtube.com/watch?v=wZAjVQWbMlE")
    
with tab3:
    st.markdown("### 🤖 Healthcare Assistant")
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Hello! Ask me about symptoms, medicines, or diet."}
        ]

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("E.g., What are the symptoms of diabetes?"):
        st.chat_message("user").markdown(prompt)
        st.session_state.messages.append({"role": "user", "content": prompt})

        prompt_lower = prompt.lower()
        response = "I'm a simple assistant. Ask me about symptoms, medicines, diet, or predictions."
        
        if "symptom" in prompt_lower: response = "Common symptoms include excessive thirst, frequent urination, unexplained weight loss, and fatigue."
        elif "medicine" in prompt_lower: response = "Common treatments include Metformin or Insulin therapy under doctor supervision."
        elif "diet" in prompt_lower: response = "A balanced diet high in fiber, lean proteins, and complex carbs is recommended."

        with st.chat_message("assistant"):
            st.markdown(response)
        st.session_state.messages.append({"role": "assistant", "content": response})

st.markdown("---")
st.markdown("<p style='text-align: center; color: gray;'>Developed by Vedant Gadage | Healthcare Disease Prediction</p>", unsafe_allow_html=True)
