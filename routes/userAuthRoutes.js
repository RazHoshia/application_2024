const express = require('express');
const router = express.Router();
const UserAuthController = require('../controllers/userAuthController');

// Signup Route
router.post('/signup', (req, res) => {
  UserAuthController.signup(req, res);
});

// Login Route
router.post('/login', (req, res) => {
  UserAuthController.login(req, res);
});

module.exports = router;
