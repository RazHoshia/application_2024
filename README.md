# Server Setup

This section provides instructions for setting up the server with Node.js and Express.

## Prerequisites

- Node.js and npm (Node Package Manager) installed. Download from [Node.js official website](https://nodejs.org/).

## How to Set Up and Run the Server

### 1. Install Node.js

Download and install Node.js from the [official Node.js website](https://nodejs.org/). This will also install npm, which is the package manager for Node.js.

### 2. Initialize a New Node.js Project

Navigate to your project directory and initialize a new Node.js project:

**Bash / PowerShell:**
```bash
mkdir my-express-app
cd my-express-app
npm init -y
```

### 3. Install Express

Install Express, a web application framework for Node.js:

**Bash / PowerShell:**
```bash
npm install express
```

### 4. Create a Basic Server

Create a `server.js` file and add the following code to set up a basic Express server:

**File: `server.js`**
```javascript
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Define a basic route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
```

### 5. Run the Server

Run the server using Node.js:

**Bash / PowerShell:**
```bash
node server.js
```

The server should start and be accessible at [http://localhost:3000](http://localhost:3000). You should see "Hello, World!" when you navigate to this URL.

This setup provides a basic server running on Node.js and Express for your application.
