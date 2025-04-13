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

"""
Hard code system instructions to:

- Obtain {sender}, {subject}, {email body}
- Try to summarize all three above~
- Return in json or dictionary format the sender, subject, and email body
    -> We will parse the information ourselves in code and display it in respsective
       locations in our website!
"""
system_instructions = """
You're only purpose is to do the following:
1. Obtain the sender address, subject of email, and email body
2. Without removing any important information or context to the email, try to briefly summarize.
3. For the email body, summarize by:
3a. In three sentences or less, summarize the email
3b. If there are obligations or TODOs, create succinct bullet points about what needs to be done
3c. Keep responses concise and professional.
3d. Avoid harmful or biased content.
4. Return everything as JSON file, where we have a seperate {sender address}, {subject}, {email body}
"""

# Variable input that contains the user's email in a json file: -> {sender email} {subject email} {email body}
curr_email = ""

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('test.html')


@app.route('/ask', methods=['post'])
def ask_ai():
    global curr_email # allows for variable to be modified with the current email obtained~

    # TODO: update user email with obtained email:
    # new_email =

    try:
        # combine system "hard-coded" instructions and user email and send to ai api call:
        combined_prompt = f"{system_instructions} \n\n User's Email in JSON: {curr_email}"
        response = model.generate_content(combined_prompt)

        return jsonify({'response': response.text})

    except Exception as e:
        return jsonify({'error':str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
