// Update sliding values dynamically
function updateVal(inputId, displayId) {
    document.getElementById(displayId).innerText = document.getElementById(inputId).value;
}

// Tab Switching Logic
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tab-link");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Handle Form Submission & API Call
document.getElementById('prediction-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Switch to Dashboard Tab if not there
    document.getElementById('Dashboard').style.display = "block";
    document.getElementById('Medical').style.display = "none";
    document.getElementsByClassName("tab-link")[0].className = "tab-link active";
    document.getElementsByClassName("tab-link")[1].className = "tab-link";

    document.getElementById('placeholder-box').classList.add('hidden');
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('loading').classList.remove('hidden');

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        
        setTimeout(() => { // small delay for realistic processing feel
            document.getElementById('loading').classList.add('hidden');
            document.getElementById('result-box').classList.remove('hidden');
            
            if (result.error) {
                alert("Error: " + result.error);
                return;
            }

            document.getElementById('risk-score').innerText = result.probability + '%';
            
            const alertBox = document.getElementById('alert-box');
            if (result.prediction === 1) {
                alertBox.className = 'alert alert-danger';
                alertBox.innerHTML = `
                    <b>⚠️ High Risk Detected</b><br>
                    Our ML model calculated a high probability of diabetes. Please consult a healthcare professional immediately for a clinical diagnosis.<hr style="border:0; border-top:1px solid #fca5a5; margin: 10px 0;">
                    <b>🩺 Common Symptoms to Watch For:</b>
                    <ul style="margin-left: 20px; font-size: 0.9em; margin-bottom: 10px;">
                        <li>Excessive Thirst & Frequent Urination</li>
                        <li>Unexplained Weight Loss & Fatigue</li>
                        <li>Tingling or Numbness in Hands/Feet</li>
                    </ul>
                    <b>💊 Typical Medications (Medical Reference Only):</b>
                    <ul style="margin-left: 20px; font-size: 0.9em;">
                        <li><b>Metformin</b>: Often prescribed first to manage blood sugar levels.</li>
                        <li><b>Insulin Therapy</b>: Used for deeper insulin resistance or Type 1 overlap.</li>
                        <li><b>SGLT2 inhibitors</b>: Helps kidneys remove sugar from your body.</li>
                    </ul>
                `;
            } else {
                alertBox.className = 'alert alert-success';
                alertBox.innerHTML = `<b>✅ Low Risk</b><br>Your clinical inputs suggest a low risk. Maintain a healthy routine!`;
            }
        }, 800);

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the prediction server.');
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('placeholder-box').classList.remove('hidden');
    }
});

// Medical Symptom Logic
const symptomsDB = {
    'fatigue': {
        title: "Extreme Fatigue",
        desc: "Feeling constantly exhausted despite getting enough sleep is a common early sign of diabetes, as the body struggles to use glucose for energy.",
        meds: "Depending on HbA1c levels, doctors may prescribe <b>Metformin</b> (usually starting at 500mg daily) to help improve insulin sensitivity and energy utilization.",
        life: "Engage in light daily exercise like walking to improve insulin resistance, and ensure a sleep schedule of 7-8 hours per night."
    },
    'thirst': {
        title: "Excessive Thirst",
        desc: "Polydipsia (excessive thirst) occurs when high blood sugar forces the kidneys to overwork, leading to frequent urination and dehydration.",
        meds: "Medications called <b>SGLT2 inhibitors</b> (e.g., Empagliflozin) help kidneys remove sugar through urine. Hydration is critical, but only water—not sugary drinks.",
        life: "Drink at least 8-10 glasses of pure water daily. Avoid caffeinated or sugary beverages which worsen dehydration."
    },
    'weight': {
        title: "Unexplained Weight Loss",
        desc: "When cells don't get glucose, the body starts burning muscle and fat for energy, leading to sudden weight loss.",
        meds: "For severe cases (like Type 1 or advanced Type 2), <b>Insulin Therapy</b> is often required. GLP-1 agonists (e.g., Semaglutide) may also be used depending on the patient's baseline weight.",
        life: "Adopt a nutrient-dense diet rich in healthy fats, lean proteins, and complex carbohydrates to rebuild healthy mass safely."
    },
    'numbness': {
        title: "Tingling / Numbness",
        desc: "Prolonged high blood sugar can damage nerves (Diabetic Neuropathy), typically starting in the toes and feet.",
        meds: "Blood sugar control is the first line of defense (via Metformin or Insulin). For pain relief, doctors may prescribe drugs like <b>Pregabalin</b> or <b>Duloxetine</b>.",
        life: "Perform daily foot inspections. Keep feet clean, dry, and moisturized. Wear comfortable, non-restrictive footwear."
    }
};

function showTreatment(symptomKey) {
    const data = symptomsDB[symptomKey];
    if (!data) return;

    // UI Updates
    document.querySelectorAll('.tag').forEach(tag => tag.classList.remove('active-tag'));
    event.currentTarget.classList.add('active-tag');

    document.getElementById('treatment-info').classList.remove('hidden');
    document.getElementById('treat-title').innerText = data.title;
    document.getElementById('treat-desc').innerText = data.desc;
    document.getElementById('treat-meds').innerHTML = data.meds;
    document.getElementById('treat-life').innerText = data.life;
}

// Chatbot Logic
function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatWindow = document.getElementById('chat-window');
    
    // User message
    const userDiv = document.createElement('div');
    userDiv.className = 'message user-message';
    userDiv.innerText = msg;
    chatWindow.appendChild(userDiv);
    input.value = '';

    chatWindow.scrollTop = chatWindow.scrollHeight;

    // Bot response (Rule-based)
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        
        const lowerMsg = msg.toLowerCase();
        let response = "I specialize in answering questions about standard diabetes medications, symptoms, and lifestyle changes. Try asking about a specific symptom or medicine!";
        
        if (lowerMsg.includes('metformin')) {
            response = "Metformin is a first-line medication for type 2 diabetes. It works by reducing glucose production in the liver. A common starting dose is 500mg daily, but this must be directed by a doctor.";
        } else if (lowerMsg.includes('insulin')) {
            response = "Insulin therapy replaces or supplements the body's natural insulin. Dosages are highly individualized and calculated based on blood sugar levels and carbohydrate intake.";
        } else if (lowerMsg.includes('symptom')) {
            response = "Common symptoms include excessive thirst, frequent urination, unexplained weight loss, and fatigue. You can explore these interactively in the 'Intelligent Symptom Guide' section just above!";
        } else if (lowerMsg.includes('diet') || lowerMsg.includes('food')) {
            response = "A balanced diet high in fiber, lean proteins, and complex carbs (like whole grains) is recommended. Processed sugars and refined carbs should be strictly limited.";
        } else if (lowerMsg.includes('hi') || lowerMsg.includes('hello')) {
            response = "Hello! Do you have any questions regarding diabetes symptoms, modern medical treatments, or how the machine learning model works?";
        } else if (lowerMsg.includes('model') || lowerMsg.includes('predict')) {
            response = "Our backend uses a Machine Learning model trained on clinical patient data. By adjusting your values in the left sidebar and clicking 'Predict Risk', it will instantly calculate your probability of having diabetes based on historical patterns.";
        }

        botDiv.innerHTML = response; // using innerHTML to allow basic bolding if needed
        chatWindow.appendChild(botDiv);
        chatWindow.scrollTop = chatWindow.scrollHeight;

    }, 600);
}

// Enter key for chat
document.getElementById('chat-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendChatMessage();
    }
});
