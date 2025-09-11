//middleware/cartSession.js
const { v4: uuidv4 } = require('uuid');

module.exports = (req, res, next) => {
  // Get or create cart session ID
  let cartId = req.cookies?.cartId;
  
  if (!cartId) {
    cartId = uuidv4();
    res.cookie('cartId', cartId, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });
  }

  req.cartId = cartId;
  next();
};