// models/WindowConfig.js
const mongoose = require('mongoose');

const windowMeasurementsSchema = new mongoose.Schema({
  height: { type: Number, required: true, min: 100, max: 9999 }, // in mm
  width: { type: Number, required: true, min: 100, max: 9999 }   // in mm
}, { _id: false });

const windowComponentsSchema = new mongoose.Schema({
  // Aluminium framing components
  jambP: { type: Number, default: 0 },
  interLock: { type: Number, default: 0 },
  lockSection: { type: Number, default: 0 },
  topBottom: { type: Number, default: 0 },
  headerP: { type: Number, default: 0 },
  sillP: { type: Number, default: 0 },
  tube: { type: Number, default: 0 },
  butterFly: { type: Number, default: 0 },
  jambCover: { type: Number, default: 0 },
  pInner: { type: Number, default: 0 },
  pOutter: { type: Number, default: 0 },
  projectBidding: { type: Number, default: 0 },
  singleHeader: { type: Number, default: 0 },
  
  // Hardware components
  rollers: { type: Number, default: 0 },
  lock: { type: Number, default: 0 },
  guiders: { type: Number, default: 0 },
  sideArms: { type: Number, default: 0 },
  projectHandle: { type: Number, default: 0 },
  
  // Glass and sealing
  glass: { type: Number, required: true },
  rubber: { type: Number, required: true },
  woolFile: { type: Number, required: true },
  
  // Installation
  installation: { type: Number, required: true }
}, { _id: false });

const windowConfigSchema = new mongoose.Schema({
  cartId: { 
    type: String, 
    required: true, 
    index: true 
  },
  type: { 
    type: String, 
    required: true,
    enum: [
      'type1', 'type2', 'type3', 'type4', 'type5', 'type6', 'type7', 
      'type8', 'type9', 'type10', 'type11', 'type12', 'type13', 
      'type14', 'type15', 'type16', 'type17', 'type18', 'type19'
    ]
  },
  measurements: { 
    type: windowMeasurementsSchema, 
    required: true 
  },
  glassType: { 
    type: String, 
    required: true,
    enum: ['clear', 'oneWay', 'tinted', 'obscured', 'nashiji']
  },
  glassThickness: { 
    type: String, 
    required: true,
    enum: [
      '4mm', '5mm', '6mm', '8mm', '3+3mmLam', '4+4mmLam', 
      '5+5mmLam', '6mmTuff', '8mmTuff', '10mmTuff'
    ]
  },
  profileColour: { 
    type: String, 
    required: true,
    enum: ['white', 'black', 'silver', 'brown', 'champagne', 'grey']
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1, 
    default: 1 
  },
  unitPrice: { 
    type: Number, 
    required: true 
  },
  components: { 
    type: windowComponentsSchema, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Indexes for faster queries - UPDATED FOR cartId
windowConfigSchema.index({ cartId: 1, isActive: 1 });
windowConfigSchema.index({ 
  cartId: 1, 
  type: 1, 
  'measurements.height': 1, 
  'measurements.width': 1,
  glassType: 1,
  glassThickness: 1,
  profileColour: 1,
  isActive: 1
});

// Static methods - UPDATED FOR cartId
windowConfigSchema.statics = {
  // Find active cart items for a cart
  async findActiveCart(cartId) {
    return this.find({ cartId, isActive: true })
      .sort({ createdAt: -1 })
      .lean();
  },

  // Clear cart
  async clearCart(cartId) {
    return this.updateMany(
      { cartId, isActive: true },
      { $set: { isActive: false } }
    );
  },

  // Calculate cart totals
  async calculateCartTotals(cartId) {
    const result = await this.aggregate([
      { $match: { cartId, isActive: true } },
      {
        $group: {
          _id: null,
          grandTotal: { $sum: { $multiply: ['$unitPrice', '$quantity'] } },
          totalItems: { $sum: '$quantity' },
          aluminiumFraming: { 
            $sum: { 
              $multiply: [
                { $add: [
                  '$components.jambP',
                  '$components.interLock',
                  '$components.lockSection',
                  '$components.topBottom',
                  '$components.headerP',
                  '$components.sillP',
                  '$components.tube',
                  '$components.butterFly',
                  '$components.jambCover',
                  '$components.pInner',
                  '$components.pOutter',
                  '$components.projectBidding',
                  '$components.singleHeader'
                ]},
                '$quantity'
              ]
            }
          },
          rubber: {
            $sum: { $multiply: ['$components.rubber', '$quantity'] }
          },
          woolFile: {
            $sum: { $multiply: ['$components.woolFile', '$quantity'] }
          },
          rollers: {
            $sum: { $multiply: ['$components.rollers', '$quantity'] }
          },
          lock: {
            $sum: { $multiply: ['$components.lock', '$quantity'] }
          },
          guiders: {
            $sum: { $multiply: ['$components.guiders', '$quantity'] }
          },
          sideArms: {
            $sum: { $multiply: ['$components.sideArms', '$quantity'] }
          },
          projectHandle: {
            $sum: { $multiply: ['$components.projectHandle', '$quantity'] }
          },
          glass: {
            $sum: { $multiply: ['$components.glass', '$quantity'] }
          },
          installation: {
            $sum: { $multiply: ['$components.installation', '$quantity'] }
          }
        }
      }
    ]);
    
    return result[0] || {
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
};

// Remove the pre-save hook since we're using timestamps
// The timestamps option automatically handles createdAt and updatedAt

module.exports = mongoose.model('WindowConfig', windowConfigSchema);