import requests
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)

# Define the base URL of the server
BASE_URL = "http://localhost:3000/bi"

# Helper function to make GET requests
def get(endpoint, params=None):
    response = requests.get(f"{BASE_URL}{endpoint}", params=params)
    response.raise_for_status()  # Raise an error for bad responses
    logging.info(f"GET {endpoint} - Response: {response.json()}")
    return response.json()

def test_sales_analysis_by_supplier():
    logging.info("Testing Sales Analysis by Supplier...")
    try:
        result = get('/sales_analysis_by_supplier')
        logging.info(f"Sales Analysis by Supplier: {result}")
    except Exception as e:
        logging.error(f"Error in Sales Analysis by Supplier: {e}")

def test_top_best_sellers(n):
    logging.info(f"Testing Top {n} Best Sellers...")
    try:
        result = get('/top_best_sellers', params={'n': n})
        logging.info(f"Top {n} Best Sellers: {result}")
    except Exception as e:
        logging.error(f"Error in Top {n} Best Sellers: {e}")

def test_average_spend_per_user():
    logging.info("Testing Average Spend per User...")
    try:
        result = get('/average_spend_per_user')
        logging.info(f"Average Spend per User: {result}")
    except Exception as e:
        logging.error(f"Error in Average Spend per User: {e}")

def test_revenue_from_shop(shop_id, start_date, end_date):
    logging.info(f"Testing Revenue from Shop {shop_id} between {start_date} and {end_date}...")
    try:
        params = {
            'shop_id': shop_id,
            'start_date': start_date,
            'end_date': end_date
        }
        result = get('/revenue_from_shop', params=params)
        logging.info(f"Revenue from Shop {shop_id}: {result}")
    except Exception as e:
        logging.error(f"Error in Revenue from Shop {shop_id}: {e}")


if __name__ == "__main__":
    # Run the tests
    test_sales_analysis_by_supplier()
    test_top_best_sellers(1)
    test_average_spend_per_user()
    test_revenue_from_shop('shop-uuid-001', '2024-01-01', '2024-12-31')  # Example date range
