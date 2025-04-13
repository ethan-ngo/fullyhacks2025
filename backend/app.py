# from flask import Flask, jsonify, request
# from clerk_backend_api import Clerk
# from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions
# import httpx
# import os
# import requests
# from flask_cors import CORS
# import google.generativeai as genai
#
#
# app = Flask(__name__)
# CORS(app, origins=["https://localhost:3000/api"], supports_credentials=True)
# clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
#
# def flask_request_to_httpx():
#     return httpx.Request(
#         method=request.method,
#         url=request.url,
#         headers=request.headers
#     )
#
# @app.route("/api/protected", methods=["GET"])
# def protected():
#     try:
#         auth_result = clerk.authenticate_request(
#             flask_request_to_httpx(),
#             AuthenticateRequestOptions(
#                 authorized_parties=["http://localhost:3000"]
#             )
#         )
#         print(auth_result)
#
#         if not auth_result.is_signed_in:
#             return jsonify({"error": "Not signed in"}), 401
#
#         res = clerk.users.get_o_auth_access_token(
#             user_id=auth_result.payload["sub"],
#             provider="oauth_google"
#         )
#
#         access_token = res[0].token
#         headers = {"Authorization": f"Bearer {access_token}"}
#
#         # Fetch unread messages
#         gmail_response = requests.get(
#             "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10",
#             headers=headers
#         )
#         gmail_response.raise_for_status()
#         messages = gmail_response.json().get("messages", [])
#
#         summarized_emails = []
#         for msg in messages:
#             msg_id = msg["id"]
#
#             # Get full message details
#             detail = requests.get(
#                 f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}",
#                 headers=headers
#             )
#             detail.raise_for_status()
#             email_data = detail.json()
#
#             # Extract headers
#             headers_list = email_data["payload"]["headers"]
#             email_headers = {h['name']: h['value'] for h in headers_list}
#
#             # Get email body
#             body = ""
#             if 'parts' in email_data['payload']:
#                 for part in email_data['payload']['parts']:
#                     if part['mimeType'] == 'text/plain' and 'body' in part and 'data' in part['body']:
#                         try:
#                             body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
#                             break
#                         except:
#                             continue
#
#             # Format time
#             email_time = email_headers.get('Date', '')
#             if email_time:
#                 try:
#                     email_time = datetime.strptime(email_time, '%a, %d %b %Y %H:%M:%S %z').strftime('%Y-%m-%d %H:%M:%S')
#                 except:
#                     pass  # Keep original format if parsing fails
#
#             # Create email dictionary
#             email = {
#                 'sender': email_headers.get('From', ''),
#                 'subject': email_headers.get('Subject', '(No Subject)'),
#                 'body': body,
#                 'time': email_time,
#                 'url': f"https://mail.google.com/mail/u/0/#inbox/{msg_id}"
#             }
#             emails.append(email)
#
#         return(emails)
#
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({"error": "Failed to fetch Gmail", "details": str(e)}), 500
#
#
# )
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
import os
import requests
import httpx
import base64
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions
import google.generativeai as genai

# Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"], supports_credentials=True)

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-pro")  # Gemini Flash is part of gemini-pro family

def flask_request_to_httpx():
    return httpx.Request(
        method=request.method,
        url=request.url,
        headers=request.headers
    )

@app.route("/api/protected", methods=["GET"])
def protected():
    try:
        auth_result = clerk.authenticate_request(
            flask_request_to_httpx(),
            AuthenticateRequestOptions(
                authorized_parties=["http://localhost:3000"]
            )
        )

        if not auth_result.is_signed_in:
            return jsonify({"error": "Not signed in"}), 401

        token = clerk.users.get_o_auth_access_token(
            user_id=auth_result.payload["sub"],
            provider="oauth_google"
        )
        access_token = res[0].token
        headers = {"Authorization": f"Bearer {access_token}"}

        # Fetch unread emails
        response = requests.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=3",
            headers=headers
        )
        response.raise_for_status()
        messages = response.json().get("messages", [])

        summarized_emails = []

        for msg in messages:
            msg_id = msg["id"]

            # Get full message
            detail = requests.get(
                f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}",
                headers=headers
            ).json()

            payload = detail.get("payload", {})
            headers_list = payload.get("headers", [])
            headers_dict = {h["name"]: h["value"] for h in headers_list}

            sender = headers_dict.get("From", "")
            subject = headers_dict.get("Subject", "(No Subject)")

            body = ""
            parts = payload.get("parts", [])
            for part in parts:
                if part.get("mimeType") == "text/plain":
                    data = part.get("body", {}).get("data", "")
                    try:
                        body = base64.urlsafe_b64decode(data).decode("utf-8")
                        break
                    except Exception:
                        continue

            prompt = f"""
            Email from: {sender}
            Subject: {subject}
            Body: {body}

            Summarize this email in the following format:
            {{
              "sender_identity": <concise sender identity>,
              "subject_summary": <brief subject>,
              "body_summary": <3-line max summary of email body>
            }}
            Only respond with the JSON object.
            """

            result = model.generate_content(prompt)
            try:
                cleaned = result.text.strip("`\n ")
                summary_dict = eval(cleaned) if cleaned.startswith("{") else {}
                summarized_emails.append(summary_dict)
            except Exception as e:
                summarized_emails.append({
                    "sender_identity": sender,
                    "subject_summary": subject,
                    "body_summary": "Unable to summarize email content."
                })

        return jsonify(summarized_emails)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch Gmail", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
