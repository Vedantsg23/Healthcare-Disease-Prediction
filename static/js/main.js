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

// --- ADVANCED MEDICAL KNOWLEDGE BASE CHATBOT ---
const advancedKnowledgeBase = [
    {
        keywords: ["metformin", "medicine", "medication", "pill", "drug", "treatment"],
        response: "<b>Metformin</b> is usually the first medication prescribed for Type 2 diabetes. It works primarily by lowering glucose production in the liver and improving your body's sensitivity to insulin so it uses blood sugar more effectively. Other common medications include <b>Sulfonylureas</b> (which help secrete more insulin) and <b>GLP-1 Receptor Agonists</b> (which slow digestion and lower blood sugar). <i>Always consult your doctor for precise dosages.</i>"
    },
    {
        keywords: ["insulin", "injection", "shot", "pump"],
        response: "<b>Insulin Therapy</b> is required for all individuals with Type 1 diabetes and many with advanced Type 2 diabetes. Because the stomach would break down insulin pills, it must be injected or pumped. There are many types: rapid-acting (taken before meals) and long-acting (to keep levels steady all day). Dosing is highly individualized based on carbohydrate intake and current blood sugar levels."
    },
    {
        keywords: ["symptom", "sign", "feel", "warning"],
        response: "Common warning symptoms of diabetes include:<br>1. <b>Polyuria</b> (frequent urination)<br>2. <b>Polydipsia</b> (excessive thirst)<br>3. <b>Polyphagia</b> (extreme hunger)<br>4. Unexplained weight loss<br>5. Extreme fatigue and blurry vision.<br>If you experience these, a fasting blood glucose test or A1C test is highly recommended."
    },
    {
        keywords: ["diet", "food", "eat", "meal", "sugar", "carb", "carbohydrate", "keto"],
        response: "A proper diabetic diet focuses on <b>low glycemic index</b> foods that don't spike blood sugar. <ul><li><b>Eat:</b> Leafy greens, whole grains (brown rice, oats), legumes, nuts, and lean proteins (chicken, fish).</li><li><b>Avoid:</b> Refined carbohydrates (white bread, pasta), sugary sodas, baked goods, and heavily processed meals.</li></ul> Portion control and counting carbohydrates are strictly necessary for insulin management."
    },
    {
        keywords: ["exercise", "workout", "gym", "run", "sport"],
        response: "Exercise makes your cells more sensitive to insulin, meaning your body needs less insulin to process sugar! <b>Aerobic exercises</b> (brisk walking, swimming, cycling) and <b>Resistance training</b> (weightlifting) are both highly recommended. Aim for at least 150 minutes of moderate-intensity aerobic activity per week."
    },
    {
        keywords: ["type 1", "type1", "juvenile"],
        response: "<b>Type 1 Diabetes</b> is an autoimmune condition where the body's immune system attacks and destroys the insulin-producing beta cells in the pancreas. It is usually diagnosed in children and young adults, and patients absolutely require lifelong insulin therapy to survive."
    },
    {
        keywords: ["type 2", "type2", "adult"],
        response: "<b>Type 2 Diabetes</b> is the most common form. It occurs when your body becomes resistant to insulin, and the pancreas cannot produce enough to overcome this resistance. It is heavily linked to lifestyle factors like obesity and lack of exercise, but it can often be managed or even reversed with diet, exercise, and medication."
    },
    {
        keywords: ["gestational", "pregnancy", "pregnant"],
        response: "<b>Gestational Diabetes</b> occurs during pregnancy when hormones block the action of the mother's insulin. Usually, blood sugar levels return to normal after delivery, but it increases the risk that both the mother and child could develop Type 2 diabetes later in life."
    },
    {
        keywords: ["a1c", "blood sugar", "glucose", "level", "normal", "range", "test"],
        response: "<b>Blood Sugar Ranges:</b><br>- A normal Fasting Blood Sugar is under <b>100 mg/dL</b>.<br>- An <b>A1C test</b> measures your average blood sugar over 2-3 months. Normal A1C is below 5.7%. Prediabetes is 5.7% to 6.4%, and Diabetes is diagnosed at an A1C of <b>6.5% or higher</b>."
    },
    {
        keywords: ["neuropathy", "nerve", "tingl", "numb", "foot", "feet"],
        response: "<b>Diabetic Neuropathy</b> is nerve damage caused by prolonged high blood sugar. It most commonly affects the legs and feet, causing tingling, numbness, or pain. Daily foot inspections and strict glucose control are necessary to prevent severe complications like ulcers or amputations."
    },
    {
        keywords: ["model", "predict", "how", "algorithm", "machine learning", "ai"],
        response: "Our <b>Machine Learning Model</b> was trained on historical datasets containing diagnostic measurements (like BMI, age, and insulin levels) of thousands of patients. By finding complex mathematical correlations between these variables, the Random Forest/XGBoost backend can calculate the statistical probability that your inputs match a diabetic profile."
    },
    {
        keywords: ["hi", "hello", "hey", "help"],
        response: "Hello! I am your Advanced AI Healthcare Assistant. You can ask me highly detailed medical questions about diabetes types, medications (like Metformin), symptoms, diet plans, normal blood sugar ranges, or how to prevent diabetes."
    }
];

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

    // Advanced NLP-Lite Matching Logic
    setTimeout(() => {
        const botDiv = document.createElement('div');
        botDiv.className = 'message bot-message';
        
        const lowerMsg = msg.toLowerCase();
        let bestMatchResponse = "I'm sorry, I don't have deeply detailed information on that specific topic. Could you try asking about diabetes symptoms, specific medications (like Insulin or Metformin), diet plans, blood sugar ranges, or the differences between Type 1 and Type 2?";
        
        let highestScore = 0;
        
        // Score each knowledge node based on keyword hits
        advancedKnowledgeBase.forEach(knowledge => {
            let score = 0;
            knowledge.keywords.forEach(keyword => {
                if (lowerMsg.includes(keyword)) {
                    score += 1;
                }
            });
            
            if (score > highestScore) {
                highestScore = score;
                bestMatchResponse = knowledge.response;
            }
        });

        botDiv.innerHTML = bestMatchResponse; 
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
