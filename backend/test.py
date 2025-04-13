import requests

# URL of the API endpoint
API_URL = "http://localhost:3001/api/google"

# Replace with your Clerk session token
CLERK_SESSION_TOKEN = "your-session-token"

def fetch_google_token():
    try:
        # Make a GET request to the API with the Authorization header
        headers = {
            "Authorization": f"Bearer {CLERK_SESSION_TOKEN}"
        }
        response = requests.get(API_URL, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            data = response.json()
            print("Google Token:", data.get("googleToken"))
        else:
            print("Error:", response.status_code, response.json())
    except Exception as e:
        print("Error fetching Google token:", str(e))

# Call the function
fetch_google_token()