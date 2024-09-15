import requests
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Define server URL
BASE_URL = "http://localhost:3000"

# Helper function to make POST requests
def post(endpoint, data):
    try:
        response = requests.post(f"{BASE_URL}{endpoint}", json=data)
        response.raise_for_status()  # Raise an error for bad responses
        logging.debug(f"POST {endpoint} - {response.json()}")
        return response.json()
    except requests.exceptions.HTTPError as err:
        logging.error(f"HTTP error occurred: {err} - {response.text}")
        return None
    except Exception as err:
        logging.error(f"Other error occurred: {err}")
        return None

# User data for testing signup
user_data = {
    "name": "Test User",
    "email": "testuser@example.com",
    "password": "password123",
    "address": "123 Example Street, Example City",
    "is_admin": False
}

# Sign up the user
logging.info("Signing up the user...")
response = post("/auth/signup", user_data)

if response:
    logging.info(f"User signed up successfully: {response}")
else:
    logging.error("Failed to sign up the user.")
