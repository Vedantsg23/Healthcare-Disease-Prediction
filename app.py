from flask import Flask, render_template, request, jsonify
import json
import os
import urllib.error
import urllib.request

from dotenv import load_dotenv

try:
    import anthropic
except Exception as e:  # the app still works without the SDK; the assistant uses the gateway instead
    print(f"Warning: anthropic SDK unavailable: {e}")
    anthropic = None

# Load environment variables (for API keys)
load_dotenv()

app = Flask(__name__)

# System prompt for consistent AI behavior
SYSTEM_PROMPT = (
    "You are MediSense AI, a friendly and professional healthcare assistant. "
    "Your role is to answer questions about diseases, symptoms, and health. "
    "Always emphasize consulting a real doctor. Keep responses concise and use markdown."
)

# Anthropic directly when ANTHROPIC_API_KEY is set. Otherwise the Vercel AI Gateway,
# authorised by the deployment's own OIDC token (no key needed on Vercel): Claude first,
# then a model the gateway's free tier allows, so the assistant answers either way.
ANTHROPIC_MODEL = os.environ.get("ANTHROPIC_MODEL", "claude-haiku-5-5")
GATEWAY_URL = "https://ai-gateway.vercel.sh/v1/chat/completions"
GATEWAY_MODELS = [m for m in [os.environ.get("AI_GATEWAY_MODEL"), "anthropic/claude-haiku-4.5", "google/gemini-2.5-flash-lite"] if m]
_gateway_model = None  # the first model that answered, reused while this instance is warm
MAX_MESSAGES = 20
MAX_CHARS = 6000
MAX_TOKENS = 800


def clean_messages(raw):
    """Keep the last few user/assistant turns, as plain strings, within a size budget."""
    if not isinstance(raw, list):
        return []
    out = []
    for m in raw[-MAX_MESSAGES:]:
        if not isinstance(m, dict) or m.get("role") not in ("user", "assistant"):
            continue
        content = m.get("content")
        if isinstance(content, str) and content.strip():
            out.append({"role": m["role"], "content": content.strip()[:2000]})
    while out and sum(len(m["content"]) for m in out) > MAX_CHARS:
        out.pop(0)
    while out and out[0]["role"] != "user":  # conversations must start with the user
        out.pop(0)
    return out


def ask_anthropic(messages, api_key):
    client = anthropic.Anthropic(api_key=api_key)
    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=MAX_TOKENS,
        system=SYSTEM_PROMPT,
        messages=messages,
    )
    return response.content[0].text


def gateway_token():
    return (
        os.environ.get("AI_GATEWAY_API_KEY")
        or request.headers.get("x-vercel-oidc-token")
        or os.environ.get("VERCEL_OIDC_TOKEN")
    )


def ask_gateway(messages, token):
    global _gateway_model
    last_error = None
    order = [_gateway_model] + [m for m in GATEWAY_MODELS if m != _gateway_model] if _gateway_model else GATEWAY_MODELS
    for model in order:
        body = json.dumps({
            "model": model,
            "max_tokens": MAX_TOKENS,
            "messages": [{"role": "system", "content": SYSTEM_PROMPT}] + messages,
        }).encode()
        req = urllib.request.Request(GATEWAY_URL, data=body, method="POST", headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        })
        try:
            with urllib.request.urlopen(req, timeout=45) as res:
                data = json.loads(res.read().decode())
            _gateway_model = model
            return data["choices"][0]["message"]["content"]
        except urllib.error.HTTPError as e:
            last_error = f"{model}: HTTP {e.code} {e.read()[:300]!r}"
            if e.code in (400, 403, 404):  # unknown model, or one this plan cannot use: try the next
                continue
            break
    raise RuntimeError(last_error or "no gateway model available")


@app.route('/')
def index():
    """Serve the main healthcare prediction page."""
    return render_template('index.html')


@app.route('/api/chat', methods=['POST'])
def chat():
    """Proxy route for the AI Chatbot to keep API keys secure."""
    data = request.get_json(silent=True) or {}
    messages = clean_messages(data.get("messages"))
    if not messages:
        return jsonify({"error": "Invalid request data"}), 400

    try:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if api_key and anthropic:
            reply = ask_anthropic(messages, api_key)
        else:
            token = gateway_token()
            if not token:
                return jsonify({
                    "error": "AI Chatbot is not configured.",
                    "details": "Set ANTHROPIC_API_KEY, or deploy on Vercel to use the AI Gateway."
                }), 503
            reply = ask_gateway(messages, token)
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"Error in chat API: {e}")
        return jsonify({"error": "Failed to connect to AI assistant"}), 502


if __name__ == '__main__':
    # Run server locally
    app.run(debug=True, port=int(os.environ.get("PORT", 5000)))
