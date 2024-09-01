from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from dotenv import load_dotenv

app = Flask(__name__)

# Load environment variables from .env file
load_dotenv()
api_key = os.getenv("API_KEY")

if not api_key:
    raise ValueError("No API key found. Please set your API key in the .env file.")

# Configure the generative AI API
genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-1.5-flash')

@app.route('/api/summarize', methods=['POST'])
def summarize():
    data = request.json
    
    # Validate input
    text = data.get('text')
    if not text or not isinstance(text, str) or len(text.strip()) == 0:
        return jsonify({'error': 'Invalid text input.'}), 400

    try:
        # Generate summary using Gemini API
        response = model.generate_content(
            f"You are an intelligent lawyer. Read this terms and conditions thoroughly, and in 6 bullet points, and bolded words where necessary, tell me, as a busy person, the most important things I should know before signing the agreement. Especially things like data privacy, subscriptions, billings, etc. Use white space to separate the bullet points for a cleaner look: {text}"
        )

        # Extract summary from response
        summary = response.text

        return jsonify({'summary': summary})

    except Exception as e:
        # Log the error and return a user-friendly message
        print(f"Error generating summary: {e}")
        return jsonify({'error': 'An error occurred while processing your request. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(port=3000)
