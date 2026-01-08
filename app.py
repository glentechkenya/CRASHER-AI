import os
import json
import time
from flask import Flask, request, render_template, jsonify
import requests

app = Flask(__name__)

GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
GITHUB_MODEL = os.environ.get("GITHUB_MODEL", "gpt-4o-mini")

def call_github_models(prompt: str) -> str:
    if not GITHUB_TOKEN:
        return "Error: Missing GITHUB_TOKEN environment variable."

    url = f"https://api.github.com/models/{GITHUB_MODEL}/completions"
    headers = {
        "Authorization": f"Bearer {GITHUB_TOKEN}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    payload = {
        "prompt": prompt,
        "max_tokens": 200,
        "temperature": 0.7
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            return (data.get("choices", [{}])[0].get("text") or "").strip() or "…"
        else:
            return f"Error: {resp.status_code} {resp.text}"
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")

@app.route("/api/respond", methods=["POST"])
def respond():
    data = request.get_json(silent=True) or {}
    user_message = (data.get("message") or "").strip()
    if not user_message:
        return jsonify({"reply": "Please type a message."}), 200

    time.sleep(0.6)  # short delay for typing indicator
    reply = call_github_models(user_message)
    return jsonify({"reply": reply}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
