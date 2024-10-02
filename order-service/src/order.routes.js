const express = require('express');
const Order = require('./order.model');

const orderRoutes = (channel) => {
  const router = express.Router();

  // Place an order
  router.post('/', async (req, res) => {
    try {
      const { productId, userId, quantity } = req.body;
      const order = new Order({ productId, userId, quantity });
      await order.save();

      const orderData = JSON.stringify({ orderId: order._id, productId: order.productId });
      channel.publish('order-events', '', Buffer.from(orderData));

      res.status(201).send(order);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  // Get all orders
  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.send(orders);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  return router;
};

module.exports = orderRoutes;
