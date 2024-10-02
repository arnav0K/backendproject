const express = require('express');
const mongoose = require('mongoose');
const amqp = require('amqplib/callback_api');
const orderRoutes = require('./order.routes');  // Assuming you have order.routes.js

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

        const exchange = 'order-events';
        channel.assertExchange(exchange, 'fanout', { durable: false });

        // Pass channel to routes for publishing events
        app.use('/orders', orderRoutes(channel));

        console.log('RabbitMQ Channel and Exchange setup complete for Order Service.');
      });
    }
  });
}

// Call the RabbitMQ connection function
connectRabbitMQ();

// Express server
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
