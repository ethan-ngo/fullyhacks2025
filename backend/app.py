# import os
# from flask import Flask, request, jsonify
# from clerk_backend_api import Clerk
# from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions
# from google.oauth2.credentials import Credentials
# import httpx
# import requests
# from flask_cors import CORS
#
# app = Flask(__name__)
# CORS(app, origins=["http://localhost:3000"], supports_credentials=True)
# clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))
#
# def flask_request_to_httpx():
#     return httpx.Request(
#         method=request.method,
#         url=request.url,
#         headers=request.headers
#     )
#
#
#
#
# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)), debug=True)
# @app.route("/api/protected", methods=["GET"])
# def protected():
#     return {"message": "Hello, World!"}
#     try:
#         auth_result = clerk.authenticate_request(
#             flask_request_to_httpx(),
#             AuthenticateRequestOptions(
#                 authorized_parties=["http://localhost:3000"]
#             )
#         )
#
#         if not auth_result.is_signed_in:
#             return jsonify({"error": "Not signed in"}), 401
#
#         print("✅ Clerk auth success for user:", auth_result.user_id)
#
#         res = clerk.users.get_o_auth_access_token(
#             user_id=auth_result.user_id,
#             provider="oauth_google"
#         )
#
#         print("🔑 OAuth token:", res.access_token)
#
#         # Fetch Gmail data using the token (same as before...)
#
#     except Exception as e:
#         import traceback
#         traceback.print_exc()
#         return jsonify({
#             "error": "Failed to fetch Gmail",
#             "details": str(e)
#         }), 500
# from flask import Flask, jsonify
#
# app = Flask(__name__)
#
# @app.route("/api/protected", methods=["GET"])
# def protected():
#     return jsonify({"message": "Flask is working!"})
#
# if __name__ == "__main__":
#     app.run(debug=True, port=5000)
from flask import Flask, jsonify, request
from clerk_backend_api import Clerk
from clerk_backend_api.jwks_helpers import AuthenticateRequestOptions
import httpx
import os
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["https://localhost:3000/api"], supports_credentials=True)
clerk = Clerk(bearer_auth=os.getenv("CLERK_SECRET_KEY"))

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
        gmail_response = requests.get(
            "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=3",
            headers=headers
        )

        gmail_response.raise_for_status()
        messages = gmail_response.json().get("messages", [])

        subjects = []
        for msg in messages:
            msg_id = msg["id"]
            detail = requests.get(
                f"https://gmail.googleapis.com/gmail/v1/users/me/messages/{msg_id}?format=metadata",
                headers=headers
            )
            headers_list = detail.json()["payload"]["headers"]
            subject = next((h["value"] for h in headers_list if h["name"] == "Subject"), "(No Subject)")
            subjects.append(subject)

        return jsonify({"emails": subjects})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": "Failed to fetch Gmail", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
