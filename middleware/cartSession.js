//middleware/cartSession.js
const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  // Check for header first, then cookie
  let cartId = req.headers['x-cart-id'] || req.cookies?.cartId;
  
  if (!cartId) {
    cartId = require('uuid').v4();
    // Only set cookie if not session storage ID
    if (!req.headers['x-cart-id']) {
      res.cookie('cartId', cartId, {
        maxAge: 365 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      });
    }
  }

  req.cartId = cartId;
  next();
};
