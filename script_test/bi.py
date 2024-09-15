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

def test_revenue_by_attribute(attribute, start_date, end_date):
    logging.info(f"Testing Revenue by {attribute} between {start_date} and {end_date}...")
    try:
        params = {
            'attribute': attribute,
            'startDate': start_date,
            'endDate': end_date
        }
        result = get('/revenue_by_attribute', params=params)
        logging.info(f"Revenue by {attribute}: {result}")
    except Exception as e:
        logging.error(f"Error in Revenue by {attribute}: {e}")

if __name__ == "__main__":
    # Run the tests
    test_sales_analysis_by_supplier()
    test_top_best_sellers(1)
    # Use 'user' as the attribute to get average spend per user
    test_revenue_by_attribute('user', '2024-01-01', '2024-12-31')
    # Use 'shop' as the attribute to get revenue by shop
    test_revenue_by_attribute('shop', '2024-01-01', '2024-12-31')  # Example date range
