// controllers/cartController.js - Updated version
const logger = require('../utils/logger');
const CartService = require('../services/CartService');

class CartController {
  async getCart(req, res) {
    try {
      const cart = await CartService.getCart(req.cartId);
      res.json({
        success: true,
        ...cart
      });
    } catch (error) {
      logger.error('Error getting cart:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  async addToCart(req, res) {
    try {
      const cart = await CartService.addToCart(req.cartId, req.body);
      res.status(201).json({
        success: true,
        ...cart
      });
    } catch (error) {
      logger.error('Error adding to cart:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  async removeItem(req, res) {
    try {
      const cart = await CartService.removeItem(req.cartId, req.params.itemId);
      res.json({
        success: true,
        ...cart
      });
    } catch (error) {
      logger.error('Error removing item:', error);
      res.status(404).json({ 
        success: false, 
        error: 'Item not found' 
      });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { quantity } = req.body;
      const cart = await CartService.updateQuantity(
        req.cartId, 
        req.params.itemId, 
        parseInt(quantity)
      );
      res.json({
        success: true,
        ...cart
      });
    } catch (error) {
      logger.error('Error updating quantity:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  async clearCart(req, res) {
    try {
      const result = await CartService.clearCart(req.cartId);
      res.json({
        success: true,
        ...result
      });
    } catch (error) {
      logger.error('Error clearing cart:', error);
      res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }
}

module.exports = new CartController();