const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const shopRoutes = require('./routes/shopRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');
const cartManagerRoutes = require('./routes/cartManagerRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Add payment routes

// Middleware to parse request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/users', userRoutes);
app.use('/shops', shopRoutes);
app.use('/auth', userAuthRoutes);
app.use('/cart', cartManagerRoutes);
app.use('/payment', paymentRoutes); // Include payment routes

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
