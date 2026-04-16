import streamlit as st
import pandas as pd
import joblib
import time

# ---------------- PAGE CONFIG ----------------
st.set_page_config(page_title="Diabetes Risk Analyzer", page_icon="🩺", layout="wide")

# ---------------- LOAD FILES ----------------
@st.cache_resource
def load_models():
    model = joblib.load("model/diabetes_model.pkl")
    scaler = joblib.load("model/scaler.pkl")
    training_columns = joblib.load("model/training_columns.pkl")
    return model, scaler, training_columns

model, scaler, training_columns = load_models()

# ---------------- CSS (Attractive UI) ----------------
st.markdown("""
<style>
.main {
    background-color: #f4f7fb;
}
.header-box {
    padding: 24px;
    border-radius: 20px;
    background: linear-gradient(135deg, #0ea5e9, #10b981);
    color: white;
    text-align: center;
    box-shadow: 0px 8px 24px rgba(0,0,0,0.12);
    margin-bottom: 24px;
}
.header-box h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 8px;
}
.card {
    padding: 20px;
    border-radius: 16px;
    background: white;
    box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
    margin-bottom: 20px;
    border: 1px solid #edf2f7;
}
.footer {
    text-align: center;
    padding: 12px;
    color: #888;
    font-size: 14px;
    margin-top: 30px;
}
.stTabs [data-baseweb="tab-list"] {
    gap: 8px;
}
.stTabs [data-baseweb="tab"] {
    height: 50px;
    white-space: pre-wrap;
    background-color: #ffffff;
    border-radius: 10px 10px 0px 0px;
    padding: 10px 20px;
    margin-right: 5px;
    border: 1px solid #e2e8f0;
    font-weight: 600;
}
.stTabs [aria-selected="true"] {
    background-color: #0ea5e9;
    color: white;
    border-color: #0ea5e9;
}
.chat-container {
    padding: 15px;
    border-radius: 16px;
    background: white;
    box-shadow: 0px 4px 16px rgba(0,0,0,0.06);
    min-height: 400px;
}
</style>
""", unsafe_allow_html=True)

# ---------------- HEADER ----------------
st.markdown("""
<div class="header-box">
    <h1>🩺 Diabetes Risk Analyzer & Assistant</h1>
    <p style='font-size: 1.1rem; opacity: 0.9;'>Advanced Healthcare Predictive Analytics and Information Dashboard</p>
</div>
""", unsafe_allow_html=True)

# ---------------- SIDEBAR ----------------
st.sidebar.title("🧾 Patient Inputs")
st.sidebar.write("Provide medical details to calculate risk:")

pregnancies = st.sidebar.slider("Pregnancies", 0, 20, 1)
glucose = st.sidebar.slider("Glucose Level", 0, 300, 120)
blood_pressure = st.sidebar.slider("Blood Pressure", 0, 200, 70)
skin_thickness = st.sidebar.slider("Skin Thickness", 0, 100, 20)
insulin = st.sidebar.slider("Insulin", 0, 900, 80)
bmi = st.sidebar.slider("BMI", 0.0, 80.0, 25.0)
diabetes_pedigree = st.sidebar.slider("Diabetes Pedigree Function", 0.0, 3.0, 0.5)
age = st.sidebar.slider("Age", 1, 120, 30)

st.sidebar.markdown("---")
predict_btn = st.sidebar.button("🔍 Predict Risk", use_container_width=True)

# ---------------- PREPARE INPUT ----------------
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
input_df = input_df[training_columns] # Ensure correct column order
scaled_input = scaler.transform(input_df) # Scale input

# ---------------- TABS ----------------
tab1, tab2, tab3 = st.tabs(["🔍 Risk Prediction", "📚 Info & Guidance", "🤖 Chat Assistant"])

# --- TAB 1: PREDICTION ---
with tab1:
    col1, col2 = st.columns([2.2, 1])
    
    with col1:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("📋 Patient Summary")
        st.dataframe(input_df, use_container_width=True)
        st.markdown("</div>", unsafe_allow_html=True)

        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("🧠 Prediction Result")

        if predict_btn:
            with st.spinner("Analyzing risk..."):
                time.sleep(1) # Add a small delay for better UX
                prediction = model.predict(scaled_input)[0]
                probability = model.predict_proba(scaled_input)[0][1]

            st.metric("Risk Probability", f"{probability*100:.2f}%")

            if prediction == 1:
                st.error("⚠️ High Risk of Diabetes Detected")
                st.warning("✅ Suggestion: Consult a healthcare professional immediately for clinical diagnosis.")
            else:
                st.success("✅ Low Risk of Diabetes")
                st.info("✅ Suggestion: Maintain a healthy routine, regular exercise, and standard checkups.")
        else:
            st.info("👈 Adjust the clinical values in the sidebar and click **Predict Risk** to see results.")
        st.markdown("</div>", unsafe_allow_html=True)

    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("🩻 Quick Health Tips")
        st.write("✅ Exercise daily (30 mins)")
        st.write("✅ Reduce processed sugar intake")
        st.write("✅ Eat a high-fiber, balanced diet")
        st.write("✅ Drink plenty of water")
        st.write("✅ Sleep 7–8 hrs per night")
        st.markdown("</div>", unsafe_allow_html=True)

        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.subheader("🔐 Privacy Check")
        st.write("✅ No personal data stored")
        st.write("✅ Educational purpose only")
        st.write("✅ Not a medical diagnosis tool")
        st.markdown("</div>", unsafe_allow_html=True)

# --- TAB 2: INFO & GUIDANCE ---
with tab2:
    try:
        st.image("app/assets/banner.png", use_container_width=True)
    except Exception:
        pass # Fallback if image doesn't load
    
    st.markdown("### 🩺 Understanding Diabetes")
    st.info("**Disclaimer**: The information provided below is for educational purposes only. Always consult a qualified physician for medical advice.")
    
    st.markdown("#### 📺 Educational Video")
    # Using a widely recognized educational video link 
    st.video("https://www.youtube.com/watch?v=wZAjVQWbMlE") # Diabetes awareness by TED-Ed or similar

    col_info1, col_info2 = st.columns(2)
    
    with col_info1:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown("#### ⚠️ Common Symptoms")
        st.markdown("""
        - **Frequent urination**, especially at night
        - **Excessive thirst** and dry mouth
        - **Unexplained weight loss** or increased hunger
        - **Extreme fatigue** and blurry vision
        - **Slow-healing sores** or frequent infections
        - **Tingling or numbness** in hands/feet
        """)
        st.markdown("</div>", unsafe_allow_html=True)
        
    with col_info2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.markdown("#### 💊 Typical Medications (For reference only)")
        st.markdown("""
        *Medication must be prescribed by a doctor.*
        - **Metformin**: The primary go-to medication for Type 2 diabetes. Helps lower glucose production in the liver. (Typical starting dosage: 500mg once or twice daily with meals).
        - **Sulfonylureas**: Help your body secrete more insulin.
        - **Insulin Therapy**: Many forms exist (rapid-acting, long-acting). Administered via injections depending on blood sugar levels.
        - **GLP-1 Receptor Agonists**: (e.g., Semaglutide) Help lower blood sugar levels and may assist in weight loss.
        """)
        st.markdown("</div>", unsafe_allow_html=True)

# --- TAB 3: ASSISTANT ---
with tab3:
    st.markdown("### 🤖 Healthcare Assistant")
    st.write("Ask me questions about diabetes, our prediction tool, symptoms, or standard medication.")
    
    # Initialize chat history
    if "messages" not in st.session_state:
        st.session_state.messages = [
            {"role": "assistant", "content": "Hello! I am your AI Healthcare Assistant. How can I help you understand diabetes or the prediction tool today?"}
        ]

    # Display chat messages from history on app rerun
    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    # React to user input
    if prompt := st.chat_input("E.g., What are the symptoms of diabetes?"):
        # Display user message in chat message container
        st.chat_message("user").markdown(prompt)
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": prompt})

        # Rule-based response logic
        response = "I'm sorry, I'm a simple assistant. Could you ask me about **symptoms**, **medicines**, **diet**, or **how the prediction works**?"
        prompt_lower = prompt.lower()
        
        if "symptom" in prompt_lower:
            response = "Common symptoms of diabetes include frequent urination, excessive thirst, unexplained weight loss, extreme fatigue, blurry vision, and slow-healing sores. If you experience these, consider seeing a doctor."
        elif "medicine" in prompt_lower or "treatment" in prompt_lower or "cure" in prompt_lower:
            response = "Type 2 diabetes is often treated with drugs like Metformin or Insulin therapy. However, only a certified doctor can prescribe these. Lifestyle changes are also highly recommended."
        elif "diet" in prompt_lower or "food" in prompt_lower or "eat" in prompt_lower:
            response = "A healthy diabetes diet typically includes low glycemic index foods, plenty of fiber (like leafy greens, whole grains, and legumes), lean proteins, and avoiding processed sugars and refined carbs."
        elif "how" in prompt_lower and "predict" in prompt_lower:
            response = "The prediction tool uses a Machine Learning model (Random Forest/XGBoost etc.) trained on historical patient data. It looks at your glucose, BMI, age, and other factors to compute the statistical risk of you developing diabetes."
        elif "hi" in prompt_lower or "hello" in prompt_lower:
            response = "Hello! Do you have any questions about diabetes prevention, symptoms, medicines, or how to use the predictor?"
        elif "dosage" in prompt_lower:
             response = "Dosage for diabetes medication varies heavily based on individual condition, HbA1c levels, and kidney function. For example, Metformin often starts at 500mg daily. Always follow the explicit instructions of your prescribing physician."

        # Display assistant response in chat message container
        with st.chat_message("assistant"):
            st.markdown(response)
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})

# ---------------- FOOTER ----------------
st.markdown("""
<div class="footer">
Developed by <b>Vedant Gadage</b> | Diabetes Risk Analyzer 🩺
<br><i>Note: The information provided is for educational purposes only.</i>
</div>
""", unsafe_allow_html=True)
