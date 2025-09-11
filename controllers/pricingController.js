//controllers/pricingController.js

const pricingService = require('../services/pricingService');

exports.getPricing = (req, res) => {
  const prices = pricingService.getPrices();
  res.json(prices);
};

exports.updatePricing = (req, res) => {
  const { productId, price } = req.body;
  const updated = pricingService.updatePrice(productId, price);
  res.json(updated);
};
