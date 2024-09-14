const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes'); // Add shop routes
const userAuthRoutes = require('./routes/userAuthRoutes'); // Add user auth routes

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('public'));

// Use routes
app.use('/users', userRoutes);
app.use('/shops', shopRoutes); // Include shop routes
app.use('/auth', userAuthRoutes); // Include authentication routes

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
