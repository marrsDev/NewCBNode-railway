//services/pricingService.js

const WindowConfig = require('../models/WindowConfig');

class PricingService {
  constructor() {
    this.config = {
      // Initialize with default values matching original config.js
      jambP: 600,
      interLock: 550,
      lockSection: 550,
      topBottom: 550,
      headerP: 600,
      sillP: 600,
      glass: 130,
      rubber: 70,
      woolFile: 100,
      rollers: 200,
      lock: 950,
      guiders: 49,
      tube: 600,
      butterFly: 550,
      jambCover: 300,
      singleHeader: 400,
      divider: 480,
      installPc: 0.285,
      pOutter: 570,
      pInner: 570,
      pInnerDiv: 580, 
      sideArms: 840,
      projectHandle: 600,
      pBidding: 340,
      curtainWallingP: 870,
      curtainWallingPInner: 750,
      doubleTape: 60,
      silicone: 400,
      foldingTopRailP: 2812,
      foldingBottomTrackP: 950,
      foldingSashP: 1240,
      foldingBeading: 510,
      foldingOutterFrameP: 510,
      foldingRubber: 100,
      foldingRollers: 4000,
      foldingLock: 3000,
      foldingGuiders: 2000,
      foldingHinges: 800
    };

    this.glassPricing = {
      clear: { '4mm': 130, '5mm': 160, '6mm': 180, '8mm': 230,
               '3+3mmLam': 320, '4+4mmLam': 370, '5+5mmLam': 410,
               '6mmTuff': 380, '8mmTuff': 500, '10mmTuff': 550 },
      oneWay: { '4mm': 160, '5mm': 220, '6mm': 250, '8mm': 300,
                '3+3mmLam': 380, '4+4mmLam': 400, '5+5mmLam': 460,
                '6mmTuff': 450, '8mmTuff': 510, '10mmTuff': 570 },
      tinted: { '4mm': 160, '5mm': 220, '6mm': 250, '8mm': 300,
                '3+3mmLam': 380, '4+4mmLam': 400, '5+5mmLam': 460,
                '6mmTuff': 450, '8mmTuff': 510, '10mmTuff': 570 },
      obscured: { '4mm': 160, '5mm': 220, '6mm': 260, '8mm': 280 },
      nashiji: { '4mm': 160, '5mm': 220, '6mm': 260, '8mm': 280 }
    };
  }

  // Profile color update - matches original switch cases
  async updateProfileConfig(selectedValue) {
    try {
      switch(selectedValue) {
        case 'white':
        case 'silver':
        case 'brown':
          this.setOuterFrameProfileProperties(600);
          this.setInnerFrameProfileProperties(550);
          this.setButterFlyProperties(550);
          this.setJambCoverProperties(300);
          this.setProjectedInnerProperties(570);
          this.setProjectedInnerDivProperties(580);
          this.setProjectedOuterProperties(570);
          this.setProjectBiddingProperties(370);
          this.setSingleHeaderProperties(400);
          this.setCurtainWallingProperties(890);
          break;

        case 'black':
        case 'grey':
        case 'champagne':
          this.setOuterFrameProfileProperties(620);
          this.setInnerFrameProfileProperties(570);
          this.setButterFlyProperties(560);
          this.setJambCoverProperties(320);
          this.setProjectedInnerProperties(580);
          this.setProjectedInnerDivProperties(590);
          this.setProjectedOuterProperties(580);
          this.setProjectBiddingProperties(390);
          this.setSingleHeaderProperties(420);
          this.setCurtainWallingProperties(920);
          break;
      }
      
      // Save to DB if needed
      await this.persistConfig();
      return this.config;
    } catch (err) {
      throw new Error(`Profile config update failed: ${err.message}`);
    }
  }

  // Glass price update - original logic
  async updateGlassConfig(selectedType, selectedThickness) {
    try {
      if (!this.glassPricing[selectedType] || !this.glassPricing[selectedType][selectedThickness]) {
        throw new Error('Invalid glass type/thickness combination');
      }
      
      this.config.glass = this.glassPricing[selectedType][selectedThickness];
      await this.persistConfig();
      return this.config.glass;
    } catch (err) {
      throw new Error(`Glass config update failed: ${err.message}`);
    }
  }

  // Helper methods (identical to original)
  setOuterFrameProfileProperties(value) {
    this.config.jambP = value;
    this.config.headerP = value;
    this.config.sillP = value;
    this.config.tube = value;
  }

  setInnerFrameProfileProperties(value) {
    this.config.interLock = value;
    this.config.lockSection = value;
    this.config.topBottom = value;
    this.config.divider = value;
  }

  setButterFlyProperties(value) {
    this.config.butterFly = value;
  }

  setJambCoverProperties(value) {
    this.config.jambCover = value;
  }

  setProjectedInnerProperties(value) {
    this.config.pInner = value;
  }

  setProjectedInnerDivProperties(value) {
    this.config.pInnerDiv = value;
  }

  setProjectedOuterProperties(value) {
    this.config.pOutter = value;
  }

  setProjectBiddingProperties(value) {
    this.config.projectBidding = value;
  }

  setSingleHeaderProperties(value) {
    this.config.singleHeader = value;
  }

  setCurtainWallingProperties(value) {
    this.config.curtainWallingP = value;
    this.config.curtainWallingPInner = value;
  }

  // Database persistence
  async persistConfig() {
    try {
      await WindowConfig.findOneAndUpdate(
        { profileColour: 'active' },
        { $set: this.config },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.error('Failed to persist config:', err);
    }
  }

  // Initialization
  async loadConfig() {
    try {
      const savedConfig = await WindowConfig.findOne({ profileColour: 'active' });
      if (savedConfig) {
        this.config = { ...this.config, ...savedConfig._doc };
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }
  }
}

module.exports = new PricingService();
