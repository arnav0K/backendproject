const express = require('express');
const User = require('./user.model');

const userRoutes = (channel) => {
  const router = express.Router();

  // Register a user
  router.post('/register', async (req, res) => {
    try {
      const { username, password, email } = req.body;
      const user = new User({ username, password, email });
      await user.save();

      const userData = JSON.stringify({ userId: user._id, email: user.email });
      channel.publish('user-events', '', Buffer.from(userData));

      const token = user.generateAuthToken();
      res.status(201).send({ token, message: 'User Registered' });
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  // Login a user
  router.post('/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(400).send('Invalid credentials');
      }

      const token = user.generateAuthToken();
      res.send({ token, message: 'Login successful' });
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  return router;
};

module.exports = userRoutes;
