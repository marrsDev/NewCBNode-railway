// routes/api/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cartController');
const WindowConfig = require('../../models/WindowConfig'); // ADD THIS IMPORT

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/item/:itemId', cartController.removeItem);
router.put('/item/:itemId/quantity', cartController.updateQuantity);
router.delete('/clear', cartController.clearCart);

// ADD WindowConfig import and fix this route
router.post('/save-session-cart', async (req, res) => {
  try {
    const sessionCartId = req.headers['x-session-cart-id'];
    
    if (!sessionCartId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session cart ID required' 
      });
    }
    
    // Get items from session cart
    const sessionItems = await WindowConfig.find({ 
      cartId: sessionCartId, 
      isActive: true 
    });
    
    if (sessionItems.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No items in session cart' 
      });
    }
    
    // Create persistent cart ID
    const persistentCartId = `persistent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Copy items to persistent storage
    for (const item of sessionItems) {
      const newItem = new WindowConfig({
        ...item.toObject(),
        _id: undefined,
        cartId: persistentCartId,
        isPersistent: true,
        createdAt: new Date()
      });
      await newItem.save();
    }
    
    res.json({
      success: true,
      persistentCartId: persistentCartId,
      message: 'Cart saved successfully'
    });
    
  } catch (error) {
    console.error('Error saving session cart:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

module.exports = router;
