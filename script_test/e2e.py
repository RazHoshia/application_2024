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

# Helper function to make GET requests
def get(endpoint, params=None):
    response = requests.get(f"{BASE_URL}{endpoint}", params=params)
    response.raise_for_status()
    logging.debug(f"GET {endpoint} - {response.json()}")
    return response.json()

# Step 1: Log in the user (assume the user already exists)
login_data = {
    "email": "r@r.com",
    "password": "r"
}
logging.info("Logging in the user...")
user = post("/auth/login", login_data)

# Step 2: List all shops
logging.info("Listing all shops...")
shops = get("/shops/list")

# Step 3: Choose the first shop
shop = shops[0]
shop_uuid = shop["uuid"]
logging.info(f"Selected shop: {shop['name']}")

# Step 4: Search user carts
logging.info("Searching user carts...")
cart = get("/cart-manager/get_cart", params={"user_id": user['user']['uuid'], "shop_id": shop_uuid})

# Step 6: Add first two existing products to the cart using add_to_cart endpoint
logging.info("Adding products to the cart...")
inventory = shop["inventory"]
product_uuids = list(inventory.keys())[:2]  # Take the first two products
for product_uuid in product_uuids:
    add_to_cart_data = {
        "product_id": product_uuid,
        "cart_id": cart['cart']['uuid']
    }
    post("/cart-manager/add_to_cart", add_to_cart_data)

# Step 7: Remove one of the products from the cart using remove_from_cart endpoint
logging.info("Removing one product from the cart...")
remove_product_data = {
    "cart_id": cart['cart']['uuid'],
    "product_id": product_uuids[0]  # Remove one of the first product
}
post("/cart-manager/remove_from_cart", remove_product_data)

# Step 8: Proceed to user payment
logging.info("Proceeding to payment...")

# Only send cart_id as required by your PaymentController
payment_data = {
    "cart_id": cart['cart']['uuid'],  # Sending only the cart ID as per your PaymentController's requirement
    "shipping_address": "456 New Address, New City, Country"  # Example shipping address
}

payment = post("/payment/user_pay", payment_data)  # Correct endpoint for payment

logging.info(f"Payment completed: {payment}")
