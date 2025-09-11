// services/cartService.js - Updated version
const logger = require('../utils/logger');
const WindowConfig = require('../models/WindowConfig');
const { calculateWindowCost } = require('./calculationServiceBridge');

class CartService {
  async getCart(cartId) {
    try {
      logger.debug('Getting cart for ID:', cartId);
      const items = await WindowConfig.find({ cartId, isActive: true });
      logger.debug('Found items:', items.length);

      const totals = await WindowConfig.calculateCartTotals(cartId);
      logger.debug('Calculated totals:', totals);
      
      return {
        items,
        totals
      };
    } catch (error) {
      logger.error('Error getting cart:', error);
      throw error;
    }
  }

  async addToCart(cartId, windowConfigData) {

    const startTime = Date.now(); // Logger timestamp
    try {
      // First calculate the cost
      const calculationResult = await calculateWindowCost(windowConfigData);

      // Only log cart additions in debug mode
      logger.debug('Cart addition', {
        cartId: cartId.substring(0, 8), // Log only first 8 chars of UUID
        type: windowConfigData.type,
        cost: calculationResult.totalCost
      });
      
      // Create the cart item
      const windowConfig = {
        cartId,
        type: windowConfigData.type || getSelectedWindowType(windowConfigData),
        measurements: {
          height: windowConfigData.height,
          width: windowConfigData.width
        },
        glassType: windowConfigData.glassType,
        glassThickness: windowConfigData.glassThickness,
        profileColour: windowConfigData.profileColour,
        quantity: windowConfigData.quantity || 1,
        unitPrice: calculationResult.totalCost,
        components: this.prepareComponentsForDB(calculationResult.breakdown),
        isActive: true
      };

      // Check if identical item exists
      const existing = await WindowConfig.findOne({
        cartId,
        isActive: true,
        type: windowConfig.type,
        'measurements.height': windowConfig.measurements.height,
        'measurements.width': windowConfig.measurements.width,
        glassType: windowConfig.glassType,
        glassThickness: windowConfig.glassThickness,
        profileColour: windowConfig.profileColour
      });

      if (existing) {
        existing.quantity += windowConfig.quantity;
        await existing.save();
        return this.getCart(cartId);
      }

      await WindowConfig.create(windowConfig);
      return this.getCart(cartId);
    } catch (error) {
      logger.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Add this helper method to handle function values
  prepareComponentsForDB(components) {
    const dbSafeComponents = {};
    
    Object.keys(components).forEach(key => {
      if (typeof components[key] === 'function') {
        // Call the function to get the actual value
        dbSafeComponents[key] = components[key]();
      } else {
        // Copy non-function values as-is
        dbSafeComponents[key] = components[key];
      }
    });
    
    return dbSafeComponents;
  }

  async removeItem(cartId, itemId) {
    try {
      await WindowConfig.findOneAndUpdate(
        { _id: itemId, cartId },
        { isActive: false }
      );
      return this.getCart(cartId);
    } catch (error) {
      logger.error('Error removing item:', error);
      throw error;
    }
  }

  async updateQuantity(cartId, itemId, quantity) {
    try {
      if (quantity < 1) {
        return this.removeItem(cartId, itemId);
      }
      
      await WindowConfig.findOneAndUpdate(
        { _id: itemId, cartId },
        { quantity }
      );
      return this.getCart(cartId);
    } catch (error) {
      logger.error('Error updating quantity:', error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      await WindowConfig.updateMany(
        { cartId, isActive: true },
        { isActive: false }
      );
      return { items: [], totals: this.emptyTotals() };
    } catch (error) {
      logger.error('Error clearing cart:', error);
      throw error;
    }
  }

  emptyTotals() {
    return {
      grandTotal: 0,
      totalItems: 0,
      aluminiumFraming: 0,
      rubber: 0,
      woolFile: 0,
      rollers: 0,
      lock: 0,
      guiders: 0,
      sideArms: 0,
      projectHandle: 0,
      glass: 0,
      installation: 0
    };
  }
}

// Helper function to determine window type from frontend data
function getSelectedWindowType(data) {
  const { noOfPanels, fixedPartition } = data;
  
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
    '2-openAbleTopFxBtm': 'type10',
    '3-openAbleTopFxBtm': 'type11',
    '4-openAbleTopFxBtm': 'type12',
  };
  
  const key = `${noOfPanels}-${fixedPartition}`;
  return typeMap[key] || 'type1';
}

module.exports = new CartService();