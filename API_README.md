
# API Documentation with Full Route URIs and Detailed Descriptions

This document provides a detailed overview of the API endpoints available in the Express server, including descriptions of inputs, outputs, specific logic, and possible responses in a Swagger-like style.

## Controllers APIs

### Cart Manager API
- **POST /api/cart_manager/add_to_cart**
  - **Input**:
    - `productId` (string): The unique identifier of the product.
    - `quantity` (integer): The amount of the product to add.
  - **Output**:
    - `status` (string): The status of the operation ('success' or 'error').
    - `cart` (object): The updated cart details.
  - **Description**: Adds an item to the user's cart. If the product is already in the cart, it updates the quantity.
  - **Possible Responses**:
    - `200 OK`: Successfully added to cart.
    - `400 Bad Request`: Missing required fields or invalid data.

### Payment API
- **POST /api/payment/initiate_payment**
  - **Input**:
    - `userId` (string): The unique identifier of the user.
    - `amount` (float): The total amount for the payment.
    - `method` (string): Payment method (e.g., 'credit card', 'paypal').
    - `cardNumber` (string, optional): Credit card number if paying by card.
  - **Output**:
    - `transactionId` (string): Unique identifier for the transaction.
    - `status` (string): The status of the payment ('completed', 'failed').
    - `error` (string, optional): Error message if the payment fails.
  - **Description**: Initiates a payment transaction. This includes validating the credit card number using regex, processing the payment, emptying the user's cart, updating the stock of the purchased items in the respective shop, creating an order with the current date, and updating the `amount_sold` for each product.
  - **Possible Responses**:
    - `200 OK`: Payment processed successfully.
    - `400 Bad Request`: Invalid payment details or insufficient funds.
    - `500 Internal Server Error`: Payment gateway issues or server error.

### User Authentication API
- **POST /api/auth/signup**
  - **Input**:
    - `email` (string): The user's email address.
    - `password` (string): The user's password.
    - `name` (string): Full name of the user.
  - **Output**:
    - `userId` (string): Unique identifier for the newly created user.
    - `message` (string): Signup success or error message.
  - **Description**: Creates a new user account. The API checks if the email already exists in the system. If the email is already registered, the signup is rejected.
  - **Possible Responses**:
    - `201 Created`: User account successfully created.
    - `400 Bad Request`: Missing required fields or invalid input.
    - `409 Conflict`: Email already registered.

- **POST /api/auth/login**
  - **Input**:
    - `email` (string): The user's email address.
    - `password` (string): The user's password.
  - **Output**:
    - `token` (string): Authentication token for the user.
    - `expiresIn` (integer): Token expiry time in seconds.
    - `message` (string): Login success or error message.
  - **Description**: Authenticates a user and provides an access token for future requests.
  - **Possible Responses**:
    - `200 OK`: Login successful, token issued.
    - `401 Unauthorized`: Invalid email or password.

## Models APIs

### BI Model API
#### **GET /api/bi/sales_analysis_by_supplier**
- **Input**: None required.
- **Output**:
  - `analysis` (array): List of sales analysis objects.
    - `supplierId` (string): Unique identifier of the supplier.
    - `totalSales` (float): Total sales amount by the supplier.
- **Description**: Provides sales analysis grouped by suppliers. This analysis includes the total sales for each supplier based on historical data.
- **Possible Responses**:
  - `200 OK`: Successfully retrieved sales analysis.
  - `500 Internal Server Error`: An error occurred while fetching data.

#### **GET /api/bi/top_best_sellers**
- **Input**:
  - `n` (integer): Number of top-selling products to retrieve, passed as a query parameter.
- **Output**:
  - `bestSellers` (array): List of top N best-selling products.
    - `productId` (string): Unique identifier of the product.
    - `productName` (string): Name of the product.
    - `totalSold` (integer): Total number of units sold.
- **Description**: Retrieves the top N best-selling products based on sales volume. The number of products to return is specified by the `n` query parameter.
- **Possible Responses**:
  - `200 OK`: Successfully retrieved top best-selling products.
  - `400 Bad Request`: Invalid or missing `n` parameter.
  - `500 Internal Server Error`: An error occurred while fetching data.

#### **GET /api/bi/revenue_by_attribute**
- **Input**:
  - `attribute` (string): The attribute to group revenue by (e.g., 'category', 'region'), passed as a query parameter.
  - `startDate` (string, date format): Start date of the range for revenue calculation.
  - `endDate` (string, date format): End date of the range for revenue calculation.
- **Output**:
  - `result` (array): Revenue grouped by the specified attribute within the given time range.
    - `attributeValue` (string): The value of the specified attribute (e.g., a specific category or region).
    - `totalRevenue` (float): Total revenue generated within the time range for each attribute value.
- **Description**: Calculates and returns revenue grouped by a specified attribute (such as category or region) within a given date range. Useful for revenue analysis by various business dimensions.
- **Possible Responses**:
  - `200 OK`: Successfully retrieved revenue data grouped by the specified attribute.
  - `400 Bad Request`: Missing required parameters (`attribute`, `startDate`, or `endDate`).
  - `500 Internal Server Error`: An error occurred while processing the request.

### Cart API
- **POST /api/cart/create**
  - **Input**:
    - `items` (array): List of items to add to the cart.
      - `productId` (string): Unique identifier of the product.
      - `quantity` (integer): Quantity of the product.
  - **Output**:
    - `cartId` (string): Unique identifier for the cart.
    - `status` (string): Creation status ('created', 'error').
  - **Description**: Creates a new cart entry with the provided items. It initializes a cart for a user session if none exists.
  - **Possible Responses**:
    - `201 Created`: Cart created successfully.
    - `400 Bad Request`: Invalid input data.

- **PUT /api/cart/update**
  - **Input**:
    - `cartId` (string): The unique identifier of the cart.
    - `updates` (object): Fields to update, e.g., items or quantities.
  - **Output**:
    - `status` (string): Update status ('updated', 'not found', 'error').
  - **Description**: Updates an existing cart with new item quantities or adds/removes items.
  - **Possible Responses**:
    - `200 OK`: Cart updated successfully.
    - `404 Not Found`: Cart not found.

### User API
- **POST /api/user/create**
  - **Input**:
    - `name` (string): User's full name.
    - `email` (string): User's email address.
    - `password` (string): User's password.
  - **Output**:
    - `userId` (string): Unique identifier for the user.
    - `status` (string): Creation status ('created', 'error').
  - **Description**: Creates a new user profile in the system. Ensures that the email is not already registered.
  - **Possible Responses**:
    - `201 Created`: User successfully created.
    - `400 Bad Request`: Invalid input data.
    - `409 Conflict`: Email already exists.

- **PUT /api/user/update**
  - **Input**:
    - `userId` (string): The unique identifier of the user.
    - `updates` (object): Fields to update, e.g., email, password.
  - **Output**:
    - `status` (string): Update status ('updated', 'not found', 'error').
  - **Description**: Updates the user's profile details. Fields like email and password can be updated securely.
  - **Possible Responses**:
    - `200 OK`: User updated successfully.
    - `404 Not Found`: User not found.

### Shop API
- **POST /api/shop/create**
  - **Input**:
    - `name` (string): Shop name.
    - `location` (string): Shop location details.
  - **Output**:
    - `shopId` (string): Unique identifier for the shop.
    - `status` (string): Creation status ('created', 'error').
  - **Description**: Creates a new shop in the system with the provided details. It assigns a unique identifier to each shop entry.
  - **Possible Responses**:
    - `201 Created`: Shop successfully created.
    - `400 Bad Request`: Invalid input data.

### Supplier API
- **POST /api/supplier/create**
  - **Input**:
    - `name` (string): Supplier name.
    - `addr` (string): Supplier address.
  - **Output**:
    - `supplierId` (string): Unique identifier for the supplier.
    - `status` (string): Creation status ('created', 'error').
  - **Description**: Adds a new supplier to the system. Each supplier is assigned a unique identifier.
  - **Possible Responses**:
    - `201 Created`: Supplier successfully added.
    - `400 Bad Request`: Invalid input data.
