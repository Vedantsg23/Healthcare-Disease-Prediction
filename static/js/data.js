// ===== MediSense AI Data =====

const SYMPTOMS = [
    "Itching", "Skin Rash", "Nodal Skin Eruptions", "Continuous Sneezing", "Shivering", "Chills",
    "Joint Pain", "Stomach Pain", "Acidity", "Ulcers on Tongue", "Muscle Wasting", "Vomiting",
    "Burning Micturition", "Spotting Urination", "Fatigue", "Weight Gain", "Anxiety", "Cold Hands And Feet",
    "Mood Swings", "Weight Loss", "Restlessness", "Lethargy", "Patches in Throat", "Irregular Sugar Level",
    "Cough", "High Fever", "Sunken Eyes", "Breathlessness", "Sweating", "Dehydration", "Indigestion",
    "Headache", "Yellowish Skin", "Dark Urine", "Nausea", "Loss of Appetite", "Pain Behind the Eyes",
    "Back Pain", "Constipation", "Abdominal Pain", "Diarrhoea", "Mild Fever", "Yellow Urine",
    "Yellowing of Eyes", "Acute Liver Failure", "Fluid Overload", "Swelling of Stomach",
    "Swelled Lymph Nodes", "Malaise", "Blurred and Distorted Vision", "Phlegm", "Throat Irritation",
    "Redness of Eyes", "Sinus Pressure", "Runny Nose", "Congestion", "Chest Pain", "Weakness in Limbs",
    "Fast Heart Rate", "Pain during Bowel Movements", "Pain in Anal Region", "Bloody Stool",
    "Irritation in Anus", "Neck Pain", "Dizziness", "Cramps", "Bruising", "Obesity", "Swollen Legs",
    "Swollen Blood Vessels", "Puffy Face and Eyes", "Enlarged Thyroid", "Brittle Nails",
    "Swollen Extremities", "Excessive Hunger", "Extra Marital Contacts", "Drying and Tingling Lips",
    "Slurred Speech", "Knee Pain", "Hip Joint Pain", "Muscle Weakness", "Stiff Neck",
    "Swelling Joints", "Movement Stiffness", "Spinning Movements", "Loss of Balance",
    "Unsteadiness", "Weakness of One Body Side", "Loss of Smell", "Bladder Discomfort",
    "Foul Smell of Urine", "Continuous Feel of Urine", "Passage of Gases", "Internal Itching",
    "Toxic Look (Typhos)", "Depression", "Irritability", "Muscle Pain", "Altered Sensorium",
    "Red Spots Over Body", "Belly Pain", "Abnormal Menstruation", "Dischromic Patches",
    "Watering from Eyes", "Increased Appetite", "Polyuria", "Family History", "Mucoid Sputum",
    "Rusty Sputum", "Lack of Concentration", "Visual Disturbances", "Receiving Blood Transfusion",
    "Receiving Unsterile Injections", "Coma", "Stomach Bleeding", "Distention of Abdomen",
    "History of Alcohol Consumption", "Fluid Overload2", "Blood in Sputum", "Prominent Veins on Calf",
    "Palpitations", "Painful Walking", "Pus Filled Pimples", "Blackheads", "Scurring",
    "Skin Peeling", "Silver Like Dusting", "Small Dents in Nails", "Inflammatory Nails",
    "Blister", "Red Sore Around Nose", "Yellow Crust Ooze"
];

const DISEASE_DB = {
    "Fungal Infection": {
        icon: "🦠", category: "skin",
        description: "A common skin condition caused by fungi (dermatophytes). Symptoms include itching, skin rash, and nodal eruptions. Usually affects moist areas like feet, groin, and under the arms.",
        symptoms: ["Itching", "Skin Rash", "Nodal Skin Eruptions", "Dischromic Patches"],
        medicines: [
            { name: "Clotrimazole", use: "Topical antifungal cream", type: "OTC" },
            { name: "Fluconazole", use: "Oral antifungal tablet", type: "Prescription" },
            { name: "Terbinafine", use: "Topical or oral antifungal", type: "OTC/Rx" },
            { name: "Ketoconazole", use: "Antifungal shampoo/cream", type: "Prescription" }
        ],
        precautions: [
            "Keep affected area clean and dry at all times",
            "Wear loose-fitting, breathable cotton clothing",
            "Avoid sharing towels, clothes, or personal items",
            "Complete the full course of antifungal medication even after symptoms improve",
            "Change socks and underwear daily"
        ],
        diet: [{ icon: "fa-lemon", label: "Probiotics" }, { icon: "fa-seedling", label: "Garlic" }, { icon: "fa-apple-whole", label: "Low Sugar" }, { icon: "fa-wheat-awn-circle-exclamation", label: "Avoid refined carbs" }, { icon: "fa-wine-bottle", label: "No Alcohol" }, { icon: "fa-ban", label: "Avoid sweet food" }],
        avoid: ["Sugary foods and drinks", "Alcohol", "Processed/refined carbohydrates", "Mouldy foods"],
        doctorAdvice: "See a doctor if the infection spreads, doesn't improve after 2 weeks of treatment, or if you have diabetes or a compromised immune system.",
        severity: "low"
    },
    "Allergy": {
        icon: "🤧", category: "respiratory",
        description: "An immune system reaction to foreign substances (allergens). Common allergens include pollen, pet dander, dust mites, certain foods, and medications. Reactions range from mild to life-threatening anaphylaxis.",
        symptoms: ["Continuous Sneezing", "Shivering", "Chills", "Watering from Eyes", "Redness of Eyes"],
        medicines: [
            { name: "Cetirizine", use: "Antihistamine for allergic reactions", type: "OTC" },
            { name: "Loratadine", use: "Non-drowsy antihistamine", type: "OTC" },
            { name: "Fexofenadine", use: "Second-generation antihistamine", type: "OTC" },
            { name: "Montelukast", use: "Leukotriene receptor antagonist", type: "Prescription" }
        ],
        precautions: [
            "Identify and avoid known allergens",
            "Keep windows closed during high pollen season",
            "Use air purifiers with HEPA filters indoors",
            "Wear a mask when working outdoors during high-allergen days",
            "Carry an antihistamine or prescribed epi-pen at all times"
        ],
        diet: [{ icon: "fa-fish", label: "Omega-3 foods" }, { icon: "fa-lemon", label: "Vitamin C" }, { icon: "fa-carrot", label: "Quercetin-rich foods" }, { icon: "fa-seedling", label: "Local honey" }, { icon: "fa-ban", label: "Avoid shellfish" }, { icon: "fa-ban", label: "Avoid nuts if allergic" }],
        avoid: ["Known allergens in food", "Processed foods with additives", "Artificial colours and preservatives"],
        doctorAdvice: "Seek emergency care immediately if you experience throat swelling, difficulty breathing, or severe hives. Regular allergy testing helps identify triggers.",
        severity: "medium"
    },
    "GERD": {
        icon: "🔥", category: "digestive",
        description: "Gastroesophageal Reflux Disease (GERD) occurs when stomach acid repeatedly flows back into the oesophagus. This can irritate the lining and cause heartburn, chest pain, and regurgitation.",
        symptoms: ["Stomach Pain", "Acidity", "Ulcers on Tongue", "Vomiting", "Cough"],
        medicines: [
            { name: "Omeprazole", use: "Proton pump inhibitor — reduces stomach acid", type: "OTC/Rx" },
            { name: "Ranitidine", use: "H2 blocker — reduces acid production", type: "OTC" },
            { name: "Antacids (Gelusil)", use: "Quick acid neutralizer", type: "OTC" },
            { name: "Metoclopramide", use: "Helps stomach empty faster", type: "Prescription" }
        ],
        precautions: [
            "Eat smaller, more frequent meals instead of large meals",
            "Avoid lying down immediately after eating — wait at least 2–3 hours",
            "Raise the head of your bed by 6–8 inches",
            "Avoid tight-fitting clothing around the waist",
            "Maintain a healthy weight — excess weight increases pressure on stomach"
        ],
        diet: [{ icon: "fa-glass-water", label: "Plenty of water" }, { icon: "fa-seedling", label: "Vegetables" }, { icon: "fa-egg", label: "Lean protein" }, { icon: "fa-wheat-awn", label: "Whole grains" }, { icon: "fa-ban", label: "No spicy food" }, { icon: "fa-ban", label: "No caffeine" }],
        avoid: ["Spicy foods", "Acidic foods (tomatoes, citrus)", "Fatty and fried foods", "Alcohol", "Coffee and carbonated drinks", "Chocolate and mint"],
        doctorAdvice: "Consult a doctor if symptoms occur more than twice a week, are severe, or if you notice difficulty swallowing or unexplained weight loss.",
        severity: "medium"
    },
    "Diabetes": {
        icon: "🩸", category: "chronic",
        description: "A metabolic disease causing high blood sugar. Type 1 is autoimmune; Type 2 is related to insulin resistance. Long-term complications affect kidneys, eyes, nerves, and cardiovascular system.",
        symptoms: ["Fatigue", "Weight Loss", "Increased Appetite", "Polyuria", "Irregular Sugar Level", "Blurred and Distorted Vision"],
        medicines: [
            { name: "Metformin", use: "First-line drug for Type 2 diabetes", type: "Prescription" },
            { name: "Insulin Glargine", use: "Long-acting insulin", type: "Prescription" },
            { name: "Sitagliptin", use: "DPP-4 inhibitor — lowers blood sugar", type: "Prescription" },
            { name: "Empagliflozin", use: "SGLT-2 inhibitor — also protects heart", type: "Prescription" }
        ],
        precautions: [
            "Monitor blood glucose levels regularly (fasting and post-meal)",
            "Exercise for at least 30 minutes daily (walking, cycling)",
            "Take medications at the same time every day without fail",
            "Inspect feet daily for cuts, sores, or blisters",
            "Get regular HbA1c tests (every 3 months)"
        ],
        diet: [{ icon: "fa-seedling", label: "Leafy greens" }, { icon: "fa-fish", label: "Lean protein" }, { icon: "fa-wheat-awn", label: "Whole grains" }, { icon: "fa-apple-whole", label: "Low-GI fruits" }, { icon: "fa-ban", label: "No white sugar" }, { icon: "fa-ban", label: "No white bread" }],
        avoid: ["Sugary beverages", "White bread, rice, and pasta", "Processed snacks", "Fried foods", "Full-fat dairy in excess"],
        doctorAdvice: "Diabetes requires lifelong management. Visit your endocrinologist every 3 months. Get annual eye exams, kidney function tests, and foot exams.",
        severity: "high"
    },
    "Hypertension": {
        icon: "💓", category: "chronic",
        description: "High blood pressure (≥130/80 mmHg). Often called the 'silent killer' because it shows no symptoms until it causes serious complications like stroke, heart attack, or kidney failure.",
        symptoms: ["Headache", "Chest Pain", "Dizziness", "Fatigue", "Breathlessness"],
        medicines: [
            { name: "Amlodipine", use: "Calcium channel blocker", type: "Prescription" },
            { name: "Losartan", use: "ARB — relaxes blood vessels", type: "Prescription" },
            { name: "Atenolol", use: "Beta-blocker — slows heart rate", type: "Prescription" },
            { name: "Hydrochlorothiazide", use: "Diuretic — reduces fluid", type: "Prescription" }
        ],
        precautions: [
            "Monitor blood pressure at home daily",
            "Reduce dietary salt (sodium) to under 2.3g per day",
            "Exercise regularly — aim for 150 minutes per week",
            "Manage stress through yoga, meditation, or breathing exercises",
            "Limit alcohol and quit smoking completely"
        ],
        diet: [{ icon: "fa-seedling", label: "DASH diet foods" }, { icon: "fa-fish", label: "Fatty fish" }, { icon: "fa-lemon", label: "Potassium-rich foods" }, { icon: "fa-glass-water", label: "Low-sodium meals" }, { icon: "fa-ban", label: "No processed meats" }, { icon: "fa-ban", label: "No excess caffeine" }],
        avoid: ["Salt and salty snacks", "Processed and canned foods", "Alcohol", "Caffeine in excess", "Red meat in large quantities"],
        doctorAdvice: "Never stop blood pressure medication without consulting your doctor. Even if you feel fine, high BP needs continuous management.",
        severity: "high"
    },
    "Migraine": {
        icon: "🤕", category: "chronic",
        description: "A neurological condition characterised by intense, throbbing headaches often on one side of the head. May be accompanied by nausea, vomiting, and extreme sensitivity to light and sound.",
        symptoms: ["Headache", "Nausea", "Vomiting", "Blurred and Distorted Vision", "Dizziness"],
        medicines: [
            { name: "Sumatriptan", use: "Triptan — stops migraine attack", type: "Prescription" },
            { name: "Ibuprofen 400mg", use: "Anti-inflammatory pain relief", type: "OTC" },
            { name: "Paracetamol", use: "Pain reliever", type: "OTC" },
            { name: "Topiramate", use: "Preventive medication", type: "Prescription" }
        ],
        precautions: [
            "Maintain a migraine diary to identify personal triggers",
            "Ensure consistent sleep schedule — sleep deprivation is a major trigger",
            "Stay hydrated — drink at least 2 litres of water daily",
            "Avoid bright screens and loud noise during an attack",
            "Rest in a dark, quiet room during episodes"
        ],
        diet: [{ icon: "fa-glass-water", label: "Stay hydrated" }, { icon: "fa-seedling", label: "Magnesium-rich foods" }, { icon: "fa-wheat-awn", label: "Regular meals" }, { icon: "fa-fish", label: "Omega-3 foods" }, { icon: "fa-ban", label: "Avoid aged cheese" }, { icon: "fa-ban", label: "Limit caffeine" }],
        avoid: ["Aged cheeses", "Red wine and alcohol", "Caffeine (or sudden withdrawal)", "Processed meats with nitrates", "Skipping meals"],
        doctorAdvice: "See a neurologist if you have more than 4 migraines per month, or if your migraines last more than 72 hours.",
        severity: "medium"
    },
    "Dengue": {
        icon: "🦟", category: "infectious",
        description: "A mosquito-borne viral infection causing high fever, severe headache, pain behind eyes, muscle pain, and skin rash. Severe dengue can lead to plasma leakage and organ failure.",
        symptoms: ["High Fever", "Headache", "Joint Pain", "Pain Behind the Eyes", "Nausea", "Skin Rash", "Fatigue"],
        medicines: [
            { name: "Paracetamol", use: "Fever and pain management (ONLY safe option)", type: "OTC" },
            { name: "ORS", use: "Oral rehydration to prevent dehydration", type: "OTC" },
            { name: "IV Fluids", use: "For hospitalised cases with severe dengue", type: "Hospital" },
            { name: "Platelet Transfusion", use: "For critically low platelet count", type: "Hospital" }
        ],
        precautions: [
            "NEVER take Aspirin or Ibuprofen — they increase bleeding risk",
            "Use mosquito repellent containing DEET at all times",
            "Sleep under mosquito nets, especially during daytime",
            "Eliminate standing water around home (breeding sites)",
            "Monitor platelet count and haematocrit daily during illness"
        ],
        diet: [{ icon: "fa-glass-water", label: "Coconut water" }, { icon: "fa-lemon", label: "Papaya leaf juice" }, { icon: "fa-apple-whole", label: "Fresh fruit juices" }, { icon: "fa-bowl-food", label: "Easily digestible food" }, { icon: "fa-ban", label: "No spicy food" }, { icon: "fa-ban", label: "No NSAIDs" }],
        avoid: ["Aspirin and Ibuprofen (dangerous in dengue)", "Oily and spicy foods", "Alcohol", "Caffeinated drinks"],
        doctorAdvice: "Hospitalise immediately if: bleeding from gums/nose, blood in urine/stool, severe abdominal pain, continuous vomiting, or platelet count below 20,000.",
        severity: "high"
    },
    "Typhoid": {
        icon: "🌡️", category: "infectious",
        description: "A bacterial infection caused by Salmonella Typhi, spread through contaminated food and water. Causes sustained high fever, weakness, abdominal pain, and sometimes a rash of rose-coloured spots.",
        symptoms: ["High Fever", "Headache", "Nausea", "Vomiting", "Abdominal Pain", "Fatigue", "Toxic Look (Typhos)"],
        medicines: [
            { name: "Azithromycin 500mg", use: "First-line antibiotic for typhoid", type: "Prescription" },
            { name: "Ceftriaxone", use: "IV antibiotic for severe cases", type: "Prescription" },
            { name: "Ciprofloxacin", use: "Fluoroquinolone antibiotic", type: "Prescription" },
            { name: "Paracetamol", use: "Fever management", type: "OTC" }
        ],
        precautions: [
            "Drink only boiled or purified water",
            "Wash hands with soap before eating and after using the toilet",
            "Avoid raw or undercooked food from street vendors",
            "Complete the full antibiotic course — usually 7–14 days",
            "Get vaccinated if travelling to endemic areas"
        ],
        diet: [{ icon: "fa-bowl-food", label: "Semi-solid food" }, { icon: "fa-egg", label: "Boiled eggs" }, { icon: "fa-glass-water", label: "Rice water/Kanji" }, { icon: "fa-seedling", label: "Cooked vegetables" }, { icon: "fa-ban", label: "No raw food" }, { icon: "fa-ban", label: "No spicy food" }],
        avoid: ["Raw vegetables and salads", "Spicy and oily foods", "Carbonated drinks", "Street food", "Dairy products in large quantities during acute phase"],
        doctorAdvice: "All typhoid cases should be managed by a physician with antibiotics. Never self-medicate. Follow-up stool cultures are needed to confirm clearance.",
        severity: "high"
    },
    "Common Cold": {
        icon: "🤒", category: "respiratory",
        description: "A viral infection of the upper respiratory tract, most often caused by rhinoviruses. Symptoms include runny nose, sore throat, sneezing, mild fever, and cough. Usually resolves in 7–10 days.",
        symptoms: ["Continuous Sneezing", "Runny Nose", "Congestion", "Cough", "Mild Fever", "Throat Irritation"],
        medicines: [
            { name: "Paracetamol", use: "Fever and body ache", type: "OTC" },
            { name: "Cetirizine", use: "Runny nose and sneezing", type: "OTC" },
            { name: "Dextromethorphan", use: "Cough suppressant", type: "OTC" },
            { name: "Saline Nasal Spray", use: "Nasal congestion relief", type: "OTC" }
        ],
        precautions: [
            "Rest adequately and avoid strenuous activity",
            "Stay hydrated — warm liquids like tea and soup help",
            "Cover your mouth and nose when coughing or sneezing",
            "Wash hands frequently to prevent spreading the virus",
            "Avoid close contact with others, especially the elderly and infants"
        ],
        diet: [{ icon: "fa-mug-hot", label: "Warm soups" }, { icon: "fa-lemon", label: "Vitamin C" }, { icon: "fa-seedling", label: "Ginger-turmeric tea" }, { icon: "fa-glass-water", label: "Plenty of fluids" }, { icon: "fa-ban", label: "No cold drinks" }, { icon: "fa-ban", label: "No ice cream" }],
        avoid: ["Cold beverages and ice cream", "Dairy (may thicken mucus)", "Alcohol and caffeine", "Sugary processed foods"],
        doctorAdvice: "See a doctor if fever exceeds 39°C, symptoms last longer than 10 days, or you develop severe ear pain, difficulty breathing, or sinus pain.",
        severity: "low"
    },
    "Pneumonia": {
        icon: "🫁", category: "respiratory",
        description: "An infection that inflames the air sacs (alveoli) in one or both lungs. May be caused by bacteria, viruses, or fungi. Symptoms include cough with phlegm, fever, chills, and difficulty breathing.",
        symptoms: ["High Fever", "Cough", "Breathlessness", "Chest Pain", "Fatigue", "Phlegm", "Rusty Sputum"],
        medicines: [
            { name: "Amoxicillin-Clavulanate", use: "Broad-spectrum antibiotic", type: "Prescription" },
            { name: "Azithromycin", use: "Covers atypical organisms", type: "Prescription" },
            { name: "Levofloxacin", use: "For resistant or severe cases", type: "Prescription" },
            { name: "Paracetamol", use: "Fever and discomfort management", type: "OTC" }
        ],
        precautions: [
            "Get vaccinated against pneumococcal pneumonia and influenza",
            "Complete the full antibiotic course without interruption",
            "Rest completely and avoid going out until fever subsides",
            "Use a humidifier to ease breathing indoors",
            "Quit smoking — it severely damages lung immunity"
        ],
        diet: [{ icon: "fa-glass-water", label: "High fluid intake" }, { icon: "fa-apple-whole", label: "Vitamin C-rich fruits" }, { icon: "fa-fish", label: "Omega-3 (anti-inflammatory)" }, { icon: "fa-egg", label: "High protein foods" }, { icon: "fa-ban", label: "No alcohol" }, { icon: "fa-ban", label: "No cold foods" }],
        avoid: ["Alcohol", "Cold foods and drinks", "Smoking", "Processed sugary foods", "Excessive dairy"],
        doctorAdvice: "Hospitalisation may be required for children, the elderly, or those with low oxygen. Seek emergency care if oxygen saturation drops below 94%.",
        severity: "high"
    }
};

// Symptom → Disease simple ML-like mapping (for client-side demo)
const SYMPTOM_DISEASE_MAP = {
    "Itching,Skin Rash": "Fungal Infection",
    "Nodal Skin Eruptions": "Fungal Infection",
    "Continuous Sneezing,Shivering": "Allergy",
    "Stomach Pain,Acidity": "GERD",
    "Vomiting,Acidity": "GERD",
    "Fatigue,Weight Loss,Irregular Sugar Level": "Diabetes",
    "Polyuria,Increased Appetite": "Diabetes",
    "Headache,Chest Pain,Fatigue": "Hypertension",
    "Headache,Nausea,Vomiting,Dizziness": "Migraine",
    "High Fever,Headache,Joint Pain,Pain Behind the Eyes": "Dengue",
    "High Fever,Headache,Abdominal Pain,Nausea": "Typhoid",
    "Continuous Sneezing,Runny Nose,Cough": "Common Cold",
    "High Fever,Cough,Breathlessness,Chest Pain": "Pneumonia"
};

const DISEASE_LIST_EXTRA = [
    { name: "Jaundice", icon: "🟡", category: "digestive", desc: "Yellowing of skin/eyes due to elevated bilirubin from liver disorders." },
    { name: "Malaria", icon: "🦟", category: "infectious", desc: "Parasitic disease spread by Anopheles mosquitoes causing cyclic fevers." },
    { name: "Chicken Pox", icon: "💢", category: "infectious", desc: "Highly contagious viral infection causing itchy blister-like rash." },
    { name: "Dengue", icon: "🦟", category: "infectious", desc: "Mosquito-borne viral fever with severe bone pain and rash." },
    { name: "Typhoid", icon: "🌡️", category: "infectious", desc: "Salmonella bacterial infection spread through contaminated food/water." },
    { name: "Hepatitis A", icon: "🔴", category: "infectious", desc: "Viral liver infection spread through contaminated food or water." },
    { name: "Hepatitis B", icon: "🔴", category: "infectious", desc: "Viral liver infection spread through blood or bodily fluids." },
    { name: "Hepatitis C", icon: "🔴", category: "infectious", desc: "Chronic liver infection primarily spread through blood contact." },
    { name: "Hepatitis D", icon: "🔴", category: "infectious", desc: "Liver infection occurring only alongside Hepatitis B infection." },
    { name: "Hepatitis E", icon: "🔴", category: "infectious", desc: "Viral hepatitis transmitted through contaminated water supply." },
    { name: "Alcoholic Hepatitis", icon: "🍺", category: "digestive", desc: "Liver inflammation caused by excessive alcohol consumption over time." },
    { name: "Tuberculosis", icon: "🫁", category: "respiratory", desc: "Bacterial lung infection spread through airborne droplets." },
    { name: "Common Cold", icon: "🤒", category: "respiratory", desc: "Upper respiratory viral infection with runny nose and mild fever." },
    { name: "Pneumonia", icon: "🫁", category: "respiratory", desc: "Lung infection causing inflammation of the alveoli." },
    { name: "Dimorphic Hemorrhoids (Piles)", icon: "🩸", category: "digestive", desc: "Swollen veins in the rectum or anus causing pain and bleeding." },
    { name: "Heart Attack", icon: "❤️", category: "chronic", desc: "Blockage of blood flow to the heart causing muscle death." },
    { name: "Varicose Veins", icon: "🦵", category: "chronic", desc: "Enlarged, twisted veins visible under the skin, usually in legs." },
    { name: "Hypothyroidism", icon: "🦋", category: "chronic", desc: "Underactive thyroid gland producing insufficient thyroid hormone." },
    { name: "Hyperthyroidism", icon: "🦋", category: "chronic", desc: "Overactive thyroid gland producing too much thyroid hormone." },
    { name: "Hypoglycemia", icon: "🩸", category: "chronic", desc: "Abnormally low blood glucose levels causing confusion and weakness." },
    { name: "Osteoarthritis", icon: "🦴", category: "chronic", desc: "Degenerative joint disease causing cartilage breakdown." },
    { name: "Arthritis", icon: "🦴", category: "chronic", desc: "Inflammation of joints causing pain, swelling, and stiffness." },
    { name: "Paroxysmal Positional Vertigo", icon: "🌀", category: "chronic", desc: "Sudden sensation of spinning triggered by head position changes." },
    { name: "Acne", icon: "😣", category: "skin", desc: "Skin condition causing pimples, blackheads, and whiteheads." },
    { name: "Urinary Tract Infection", icon: "🚽", category: "infectious", desc: "Bacterial infection in any part of the urinary system." },
    { name: "Psoriasis", icon: "🧴", category: "skin", desc: "Autoimmune disease causing red, scaly skin patches." },
    { name: "Impetigo", icon: "🩹", category: "skin", desc: "Highly contagious bacterial skin infection common in children." },
    { name: "Diabetes", icon: "🩸", category: "chronic", desc: "Metabolic disease causing high blood sugar due to insulin issues." },
    { name: "GERD", icon: "🔥", category: "digestive", desc: "Chronic acid reflux causing heartburn and oesophageal damage." },
    { name: "Allergy", icon: "🤧", category: "respiratory", desc: "Immune response to harmless substances like pollen or dust." },
    { name: "Fungal Infection", icon: "🦠", category: "skin", desc: "Skin infection caused by dermatophyte fungi in moist areas." },
    { name: "Migraine", icon: "🤕", category: "chronic", desc: "Neurological condition with severe, throbbing one-sided headaches." },
    { name: "Hypertension", icon: "💓", category: "chronic", desc: "Chronically elevated blood pressure damaging arteries over time." }
];
