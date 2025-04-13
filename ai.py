from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import  load_dotenv
import os

#load environment variables
load_dotenv()

#configure gemini
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')


app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/ask', methods=['post'])
def ask_ai():
    user_input = request.form.get('user_input')

    try:
        response = model.generate_content(user_input)
        return jsonify({'response':response.text})
    except Exception as e:
        return jsonify({'error':str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
