
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();
const { SECRET } = require('../config');

// Rejestracja
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    res.status(201).send({ message: 'User registered' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(400).send({ error: 'Registration failed' });
  }
});

// Logowanie
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({ error: 'Invalid credentials' });
  }

  try {
    const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: '1h' });
    res.send({ token, email: user.email }); // Zwróć token i email
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});


// Middleware autoryzacji



const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).send({ error: 'Unauthorized' });

  try {
    const payload = jwt.verify(token.split(' ')[1], SECRET);
    req.userId = payload.userId; // Ustaw userId
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).send({ error: 'Unauthorized' });
  }
};

module.exports = { router, authenticate };
