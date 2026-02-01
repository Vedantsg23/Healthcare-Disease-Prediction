import streamlit as st
import pandas as pd
import joblib

# ---------------- PAGE CONFIG ----------------
st.set_page_config(page_title="Diabetes Risk Analyzer", page_icon="🩺", layout="wide")

# ---------------- LOAD FILES ----------------
model = joblib.load("model/diabetes_model.pkl")
scaler = joblib.load("model/scaler.pkl")
training_columns = joblib.load("model/training_columns.pkl")

# ---------------- CSS (Attractive UI) ----------------
st.markdown("""
<style>
.main {
    background-color: #f7f9fc;
}
.header-box {
    padding: 22px;
    border-radius: 18px;
    background: linear-gradient(90deg, #0ea5e9, #22c55e);
    color: white;
    text-align: center;
    box-shadow: 0px 4px 15px rgba(0,0,0,0.12);
    margin-bottom: 18px;
}
.card {
    padding: 18px;
    border-radius: 16px;
    background: white;
    box-shadow: 0px 4px 12px rgba(0,0,0,0.08);
    margin-bottom: 15px;
}
.footer {
    text-align: center;
    padding: 8px;
    color: #666;
    font-size: 13px;
}
</style>
""", unsafe_allow_html=True)

# ---------------- HEADER ----------------
st.markdown("""
<div class="header-box">
    <h1>🩺 Diabetes Risk Analyzer</h1>
    <p>Healthcare Predictive Analytics using Machine Learning</p>
</div>
""", unsafe_allow_html=True)

# ---------------- SIDEBAR ----------------
st.sidebar.title("🧾 Patient Inputs")
st.sidebar.write("Fill the medical details:")

pregnancies = st.sidebar.slider("Pregnancies", 0, 20, 1)
glucose = st.sidebar.slider("Glucose Level", 0, 300, 120)
blood_pressure = st.sidebar.slider("Blood Pressure", 0, 200, 70)
skin_thickness = st.sidebar.slider("Skin Thickness", 0, 100, 20)
insulin = st.sidebar.slider("Insulin", 0, 900, 80)
bmi = st.sidebar.slider("BMI", 0.0, 80.0, 25.0)
diabetes_pedigree = st.sidebar.slider("Diabetes Pedigree Function", 0.0, 3.0, 0.5)
age = st.sidebar.slider("Age", 1, 120, 30)

st.sidebar.markdown("---")
predict_btn = st.sidebar.button("🔍 Predict Risk")

# ---------------- INPUT DATA ----------------
input_data = {
    "Pregnancies": pregnancies,
    "Glucose": glucose,
    "BloodPressure": blood_pressure,
    "SkinThickness": skin_thickness,
    "Insulin": insulin,
    "BMI": bmi,
    "DiabetesPedigreeFunction": diabetes_pedigree,
    "Age": age
}

input_df = pd.DataFrame([input_data])

# Ensure correct column order
input_df = input_df[training_columns]

# ✅ Scale input (VERY IMPORTANT)
scaled_input = scaler.transform(input_df)

# ---------------- MAIN CONTENT ----------------
left, right = st.columns([2.2, 1])

with left:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("📋 Patient Summary")
    st.dataframe(input_df, use_container_width=True)
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("🧠 Prediction Result")

    if predict_btn:
        # ✅ Predict using scaled input
        prediction = model.predict(scaled_input)[0]
        probability = model.predict_proba(scaled_input)[0][1]

        st.metric("Risk Probability", f"{probability*100:.2f}%")

        if prediction == 1:
            st.error("⚠️ High Risk of Diabetes Detected")
            st.warning("✅ Suggestion: Consult a doctor for clinical diagnosis.")
        else:
            st.success("✅ Low Risk of Diabetes")
            st.info("✅ Suggestion: Maintain healthy routine and regular checkups.")

    else:
        st.info("👈 Enter values in sidebar and click **Predict Risk**")

    st.markdown("</div>", unsafe_allow_html=True)

with right:
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("🩻 Health Tips")
    st.write("✅ Exercise daily (30 mins)")
    st.write("✅ Reduce sugar intake")
    st.write("✅ Eat balanced diet")
    st.write("✅ Sleep 7–8 hrs")
    st.write("✅ Regular checkups")
    st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("🔐 Privacy & Ethics")
    st.write("✅ No personal identity data used")
    st.write("✅ Educational project only")
    st.write("✅ Not a medical diagnosis tool")
    st.markdown("</div>", unsafe_allow_html=True)

# ---------------- FOOTER ----------------
st.markdown("""
<div class="footer">
Developed by <b>Vedant Gadage</b> | Diabetes Risk Analyzer 🩺
</div>
""", unsafe_allow_html=True)
