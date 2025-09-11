// routes/api/cartRoutes.js - Updated version
const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/item/:itemId', cartController.removeItem);
router.put('/item/:itemId/quantity', cartController.updateQuantity);
router.delete('/clear', cartController.clearCart);

module.exports = router;