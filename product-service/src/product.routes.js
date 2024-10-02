const express = require('express');
const Product = require('./product.model');

const productRoutes = (channel) => {
  const router = express.Router();

  // Create a product
  router.post('/', async (req, res) => {
    try {
      const { name, price, inventory } = req.body;
      const product = new Product({ name, price, inventory });
      await product.save();

      const productData = JSON.stringify({ productId: product._id, name: product.name });
      channel.publish('product-events', '', Buffer.from(productData));

      res.status(201).send(product);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });

  // Get all products
  router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.send(products);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  return router;
};

module.exports = productRoutes;
