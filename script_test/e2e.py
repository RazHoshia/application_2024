import requests
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Define server URL
BASE_URL = "http://localhost:3000"

# Helper function to make POST requests
def post(endpoint, data):
    response = requests.post(f"{BASE_URL}{endpoint}", json=data)
    response.raise_for_status()  # Raise an error for bad responses
    logging.debug(f"POST {endpoint} - {response.json()}")
    return response.json()

# Helper function to make PUT requests
def put(endpoint, data):
    response = requests.put(f"{BASE_URL}{endpoint}", json=data)
    response.raise_for_status()  # Raise an error for bad responses
    logging.debug(f"PUT {endpoint} - {response.json()}")
    return response.json()

# Helper function to make GET requests
def get(endpoint, params=None):
    response = requests.get(f"{BASE_URL}{endpoint}", params=params)
    response.raise_for_status()
    logging.debug(f"GET {endpoint} - {response.json()}")
    return response.json()

# Step 1: Sign up
user_data = {
    "name": "r",
    "email": "r@r.com",
    "password": "r",
    "uuid": "123e4567-e89b-12d3-a456-426614174000",
    "address": "123 Example Street, Example City",
    "is_admin": False
}
logging.info("Signing up user...")
user = post("/users/create", user_data)

# Step 2: List all shops
logging.info("Listing all shops...")
shops = get("/shops/list")

# Step 3: Choose the first shop
shop = shops[0]
shop_uuid = shop["uuid"]
logging.info(f"Selected shop: {shop['name']}")

# Step 4: Search user carts
logging.info("Searching user carts...")
carts = get("/carts/search", params={"attribute": "user", "value": user["uuid"]})

# Step 5: Create a cart if one does not exist for that user and shop
if not carts:
    logging.info("No carts found, creating a new cart...")
    cart_data = {
        "uuid": "cart-uuid-001",
        "user": user["uuid"],
        "shop": shop_uuid,
        "products": {}  # Initially empty cart
    }
    cart = post("/carts/create", cart_data)
else:
    cart = carts[0]
    logging.info(f"Using existing cart: {cart['uuid']}")

# Step 6: Add first two existing products to the cart
logging.info("Adding products to the cart...")
inventory = shop["inventory"]
product_uuids = list(inventory.keys())[:2]  # Take the first two products
for product_uuid in product_uuids:
    cart_update = {
        "filter": {"uuid": cart["uuid"]},
        "update": {"$inc": {f"products.{product_uuid}": 1}}  # Add one of each product
    }
    put("/carts/update", cart_update)  # Corrected to use PUT method

# Step 7: Remove one of the products from the cart
logging.info("Removing one product from the cart...")
remove_product_uuid = product_uuids[0]
cart_update = {
    "filter": {"uuid": cart["uuid"]},
    "update": {"$inc": {f"products.{remove_product_uuid}": -1}}  # Remove one of the first product
}
put("/carts/update", cart_update)  # Corrected to use PUT method

# Step 8: Proceed to user payment
logging.info("Proceeding to payment...")

# Only send cart_id as required by your PaymentController
payment_data = {
    "cart_id": cart["uuid"],  # Sending only the cart ID as per your PaymentController's requirement
    "shipping_address": "456 New Address, New City, Country"  # Example shipping address
}

payment = post("/payment/user_pay", payment_data)  # Correct endpoint for payment

logging.info(f"Payment completed: {payment}")
