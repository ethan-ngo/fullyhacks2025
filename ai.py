from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from dotenv import  load_dotenv
import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
import json
import base64 # ?


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


def get_email_data(access_token):
    # Fetch and parse email using Gmail API
    try:
        # Create credentials from the access token
        creds = Credentials(access_token)

        # Build Gmail service
        service = build('gmail', 'v1', credentials=creds)

        # Fetch latest email
        messages = service.users().messages().list(
            userId='me',
            maxResults=1
        ).execute().get('messages', [])

        if not messages:
            return None

        msg = service.users().messages().get(
            userId='me',
            id=messages[0]['id'],
            format='full'
        ).execute()

        # Parse headers
        headers = msg['payload']['headers']
        sender = next(h['value'] for h in headers if h['name'] == 'From')
        subject = next(h['value'] for h in headers if h['name'] == 'Subject')

        # Parse body
        parts = msg['payload'].get('parts', [])
        body = ""
        for part in parts:
            if part['mimeType'] == 'text/plain':
                data = part['body']['data']
                body = base64.urlsafe_b64decode(data).decode('utf-8')
                break

        return {
            "sender address": sender,
            "subject": subject,
            "email body": body
        }

    except Exception as e:
        raise Exception(f"Gmail API error: {str(e)}")


@app.route('/')
def home():
    return render_template('test.html')


@app.route('/ask', methods=['POST'])
def ask_ai():
    # Get Google access token from request (sent from frontend)
    data = request.get_json()
    if not data or 'access_token' not in data:
        return jsonify({'error': 'Missing access token'}), 400

    try:
        # Fetch and parse email
        email_data = get_email_data(data['access_token'])
        if not email_data:
            return jsonify({'error': 'No emails found'}), 404

        # Generate response with Gemini
        combined_prompt = f"{system_instructions}\n\nUser's Email in JSON: {json.dumps(email_data)}"
        response = model.generate_content(combined_prompt)

        return jsonify({'response': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)