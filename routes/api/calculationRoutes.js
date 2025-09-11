//routes/api/calculationRoutes.js

const express = require('express');
const router = express.Router();
const calculationController = require('../../controllers/calculationController');

// GET all calculations (stubbed history for now)
router.get('/', calculationController.getCalculations);

// POST to perform a calculation
router.post('/', calculationController.createCalculation);

module.exports = router;
