import requests
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Define server URL
BASE_URL = "http://localhost:3000"

# Endpoint for sales analysis by supplier
ENDPOINT = "/bi/sales_analysis_by_supplier"

# Function to request sales analysis by supplier
def get_sales_analysis_by_supplier():
    try:
        # Make a GET request to the endpoint
        response = requests.get(f"{BASE_URL}{ENDPOINT}")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()  # Parse the response as JSON
        logging.info("Sales Analysis by Supplier:")
        for supplier in data:
            logging.info(f"Supplier: {supplier['supplierName']}, Total Revenue: {supplier['totalRevenue']}, Total Products Sold: {supplier['totalProductsSold']}")
        return data
    except requests.exceptions.HTTPError as err:
        logging.error(f"HTTP error occurred: {err} - {response.text}")
    except Exception as err:
        logging.error(f"Other error occurred: {err}")

# Run the function
if __name__ == "__main__":
    get_sales_analysis_by_supplier()
