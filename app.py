import os
from flask import Flask, request, render_template
import openai

app = Flask(__name__)

# Load API key from environment variable
openai.api_key = os.environ.get("OPENAI_API_KEY")

def get_ai_response(user_input):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can change to gpt-4 if enabled
            messages=[
                {"role": "system", "content": "You are Crasher AI by Glentech, a helpful assistant."},
                {"role": "user", "content": user_input}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message["content"].strip()
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/", methods=["GET", "POST"])
def index():
    response = ""
    if request.method == "POST":
        user_input = request.form.get("user_input", "")
        response = get_ai_response(user_input)
    return render_template("index.html", response=response)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
