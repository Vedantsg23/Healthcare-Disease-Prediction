from flask import Flask, render_template, request, jsonify
import os
import anthropic
from dotenv import load_dotenv

# Load environment variables (for API keys)
load_dotenv()

app = Flask(__name__)

# Initialize Anthropic client
# Set your ANTHROPIC_API_KEY in a .env file or environment variable
client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY", "your_dummy_key_here"))

@app.route('/')
def index():
    """Serve the main healthcare prediction page."""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy route for the AI Chatbot to keep API keys secure."""
    try:
        data = request.json
        if not data or 'messages' not in data:
            return jsonify({"error": "Invalid request data"}), 400

        # Optional: Add system prompt for consistent AI behavior
        system_prompt = (
            "You are MediSense AI, a friendly and professional healthcare assistant. "
            "Your role is to answer questions about diseases, symptoms, and health. "
            "Always emphasize consulting a real doctor. Keep responses concise and use markdown."
        )

        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=1000,
            system=system_prompt,
            messages=data['messages']
        )
        
        return jsonify({"reply": response.content[0].text})
    
    except Exception as e:
        print(f"Error in chat API: {e}")
        return jsonify({
            "error": "Failed to connect to AI assistant",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    # Run server locally
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)))
