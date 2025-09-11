//routes/api/pricingRoutes.js

const express = require('express');
const router = express.Router();
const pricingController = require('../../controllers/pricingController');

router.get('/', pricingController.getPricing);
router.post('/update', pricingController.updatePricing);

module.exports = router;
