// controllers/calculationController.js
const logger = require('../utils/logger');
const { calculateWindowCost } = require('../services/calculationServiceBridge.js');

// GET /api/calculations
exports.getCalculations = (req, res) => {
  const result = calculationService.getAll();
  res.json(result);
};

// POST /api/calculations
exports.createCalculation = async (req, res) => {
  try {
    const input = req.body;
    logger.debug('Calculation request:', input);
    const calculationResult = await calculateWindowCost(input);
    logger.info('Calculation completed successfully')

    // Return just the result part without the extra nesting
    res.json({
      success: true,
      ...calculationResult  // Spread the result properties directly
    });
  } catch (err) {
    // ADD DETAILED ERROR LOGGING:
    console.error('❌ Calculation error details:', err);
    logger.error('Calculation error details:', {
      message: err.message,
      stack: err.stack,
      input: req.body
    });
    res.status(500).json({ 
      success: false, 
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message 
    });
  }
};