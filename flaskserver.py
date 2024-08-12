from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__)

load_dotenv()
api_key = os.getenv("API_KEY")

if not api_key:
    raise ValueError("No API key found. Please set your API key in the .env file.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.json
    text = data.get('text')
    if not text:
        return jsonify({'error': 'Invalid text input'}), 400

    response = model.generate_content(f"you are an intelligent lawyer. read this terms and conditions thoroughly, and in  6 bullet points, and bolded words where necessary, tell me, as a busy person, the most important things I should know before signing the agreement. especially things like data privacy, subscriptions, billings, etc, Use white space to seperate the bullet points for a cleaner look: {text}")

    summary = response.text

    return jsonify({'summary': summary})


if __name__ == '__main__':
    app.run(port=3000)