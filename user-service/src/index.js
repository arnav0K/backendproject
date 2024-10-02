const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const userRoutes = require('./user.routes');
const amqp = require('amqplib/callback_api');

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Retry mechanism for RabbitMQ connection
function connectRabbitMQ(retries = 5) {
  amqp.connect(process.env.RABBITMQ_URL, (err, conn) => {
    if (err) {
      console.error(`RabbitMQ Connection Error: ${err.message}`);
      if (retries === 0) {
        return process.exit(1);  // Exit if out of retries
      }
      console.log(`Retrying RabbitMQ connection... attempts left: ${retries}`);
      setTimeout(() => connectRabbitMQ(retries - 1), 5000);  // Retry after 5 seconds
    } else {
      conn.createChannel((err, channel) => {
        if (err) {
          console.error('RabbitMQ Channel Error:', err);
          return process.exit(1);
        }

        const exchange = 'user-events';
        channel.assertExchange(exchange, 'fanout', { durable: false });

        // Pass channel to routes for publishing events
        app.use('/users', userRoutes(channel));

        console.log('RabbitMQ Channel and Exchange setup complete.');
      });
    }
  });
}

// Call the RabbitMQ connection function
connectRabbitMQ();

// JWT Authentication middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Access Denied');
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send('Invalid Token');
    req.user = user;
    next();
  });
}

// Express server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
