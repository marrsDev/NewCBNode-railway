// services/calculationServiceBridge.js
const logger = require('../utils/logger');
const CalculationService = require('./calculationService');
const PricingService = require('./pricingService');

// instantiate once
const service = new CalculationService();
const windowTypes = service.initializeWindowTypes();

// Map frontend input to legacy type key
function resolveType(noOfPanels, fixedPartition) {
  // ADD DEBUG LOG HERE:
  logger.debug('🔍 Resolving type for:', { noOfPanels, fixedPartition });
  
  const typeMap = {
    '2-noPartition': 'type1',
    '2-fixedBottom': 'type2',
    '2-fixedTop': 'type2',
    '2-doubleFixed': 'type3',
    '3-noPartition': 'type4',
    '3-fixedBottom': 'type5',
    '3-fixedTop': 'type5', 
    '3-doubleFixed': 'type6',
    '4-noPartition': 'type7',
    '4-fixedBottom': 'type8',
    '4-fixedTop': 'type8',
    '4-doubleFixed': 'type9',
    // Add other mappings as needed
  };
  
  const key = `${noOfPanels}-${fixedPartition}`;
  const resolvedType = typeMap[key] || null;
  
  // ADD DEBUG LOG HERE:
  logger.debug('🔍 Mapping key:', key, '->', resolvedType);
  
  return resolvedType;
}

async function calculateWindowCost(input) {

  const startTime = Date.now(); //logging time

  // Lightweight logging
  if (logger.level === 'debug') {
    logger.debug('Calc request', { 
      h: input.height, 
      w: input.width, 
      panels: input.noOfPanels 
    });
  }
  
  const { height, width, noOfPanels, fixedPartition, glassType, glassThickness, profileColour} = input;
    // Update glass config first
    await PricingService.updateGlassConfig(glassType, glassThickness);
    logger.debug('🔄 Updated glass price to:', PricingService.config.glass);

  const typeKey = resolveType(noOfPanels, fixedPartition);
  

  if (!typeKey || !windowTypes[typeKey]) {
    logger.warn('Unsupported window configuration:', { noOfPanels, fixedPartition });
    throw new Error(`Unsupported window configuration: panels=${noOfPanels}, partition=${fixedPartition}`);
  }

  // Use the calculator directly from windowTypes
  const calculator = windowTypes[typeKey];

  const result = calculator.calculate(height, width, glassType, glassThickness);

  logger.debug('✅ Calculation successful');


  return {
    breakdown: result,
    totals: result.totals?.(),
    installation: result.installation?.(),
    totalCost: result.totalCost?.()
  };
}

module.exports = { calculateWindowCost };