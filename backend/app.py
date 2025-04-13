import os
import requests
import httpx
import base64
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions
import google.generativeai as genai

# Setup
app = Flask(__name__)
CORS(app, origins=["http://localhost:3001"], supports_credentials=True)

clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.0-flash")  # Gemini Flash is part of gemini-pro family

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
                authorized_parties=["http://localhost:3001"]
            )
        )

        if not auth_result.is_signed_in:
            return jsonify({"error": "Not signed in"}), 401

        res = clerk.users.get_o_auth_access_token(
            user_id=auth_result.payload["sub"],
            provider="oauth_google"
        )
        access_token = res[0].token
        headers = {"Authorization": f"Bearer {access_token}"}

        # Fetch unread emails
        response = requests.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=is:unread&maxResults=10",
            headers=headers
        )
        response.raise_for_status()
        messages = response.json().get("messages", [])

        summarized_emails = []

        # Hardcoded body summaries
        hardcoded_summaries = [
            "This email contains details about your recent login activity.",
            "Your order has been shipped and is on its way.",
            "Reminder: Your subscription is about to expire.",
            "You have a new message from your colleague.",
            "Your account password has been successfully updated.",
            "Invitation to join the upcoming webinar on cloud computing.",
            "Your recent payment has been processed successfully.",
            "Weekly newsletter: Top stories and updates.",
            "Your package delivery has been delayed due to unforeseen circumstances.",
            "Thank you for your feedback! We appreciate your input."
        ]

        for index, msg in enumerate(messages):
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

            # Use a hardcoded summary based on the index
            body_summary = hardcoded_summaries[index % len(hardcoded_summaries)]

            summarized_emails.append({
                "sender_identity": sender,
                "subject_summary": subject,
                "body_summary": body_summary
            })

        print(summarized_emails)
        return jsonify(summarized_emails)

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch Gmail", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
