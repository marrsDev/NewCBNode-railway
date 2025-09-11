//services/calculationService.js

const PricingService = require('./pricingService');

// Define window categories as constants at the top level
const WINDOW_CATEGORIES = {
  SLIDING: 'sliding',
  CASEMENT: 'casement', 
  HYBRID: 'hybrid',
  FOLDING: 'folding'
};

class calculationService {
  constructor() {
    this.windowTypes = this.initializeWindowTypes();
  }

  initializeWindowTypes() {

    return {
      // TYPE 1: 2 sliding panels w/o fx
      type1: this.createCalculator(
        height => ({
          jambP: (height + 250) * 2,     // Full height
          interLock: (height + 250) * 2,  // Full height
          lockSection: (height + 250) * 2,   // Full height
        }),
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),
        { 
          category: WINDOW_CATEGORIES.SLIDING,
          rollers: 4, 
          lock: 2, 
          guiders: 8, 
          rubber: (h,w) => (h*4 + w*2),
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: h => (h*4)
        }
      ),

      // TYPE 2: 2 sliding panels single fx 500mm
      type2: (() => {
        const fixedHeight = 500; // Scoped globally for this window type
        
        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 2,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),

          { 
            category: WINDOW_CATEGORIES.SLIDING,
            rollers: 4,
            lock: 2,
            guiders: 8,
            rubber: (h,w) => (h*4 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*4),
            special: {
              tube: (w) => (w + 250) + fixedHeight,
              butterFly: (w) => ((w+250)*2) + (fixedHeight*4),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 3: 2 sliding panels double fx 500mm each
      type3: (() => {
        const fixedHeight = 1000; // Scoped globally for this window type

        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 2,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),
          {
            category: WINDOW_CATEGORIES.SLIDING,
            rollers: 4,
            lock: 2,
            guiders: 8,
            rubber: (h,w) => (h*4 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*4),
            special: {
              tube: (w) => ((w + 250)*2) + (fixedHeight),
              butterFly: (w) => ((w + 250)*4) + (fixedHeight*4),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),
      // TYPE 4: 3 sliding panels w/o fx
      type4: this.createCalculator(
        height => ({
          jambP: (height + 250) * 2,     // Full height
          interLock: (height + 250) * 4,  // Full height
          lockSection: (height + 250) * 2,   // Full height
        }),
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),
        { 
          category: WINDOW_CATEGORIES.SLIDING,
          rollers: 6,
          lock: 2,
          guiders: 12,
          rubber: (h,w) => (h*6 + w*2),
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: h => (h*6)
        }
      ),

      // TYPE 5: 3 sliding panels single fx 500mm
      type5: (() => {
        const fixedHeight = 500; // Scoped globally for this window type
        
        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 4,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),
          { 
            category: WINDOW_CATEGORIES.SLIDING,
            rollers: 6,
            lock: 2,
            guiders: 12,
            rubber: (h,w) => (h*6 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*6),
            special: {
              tube: (w) => (w + 250) + (fixedHeight*2),
              butterFly: (w) => ((w + 250)*2) + (fixedHeight*6),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 6: 3 sliding panels double fx 500mm each
      type6: (() => {
        const fixedHeight = 1000; // Scoped globally for this window type
        
        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 4,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),
          {
            category: WINDOW_CATEGORIES.SLIDING,
            rollers: 6,
            lock: 2,
            guiders: 12,
            rubber: (h,w) => (h*6 + w*6),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*6),
            special: {
              tube: (w) => ((w + 250)*2) + (fixedHeight*2),
              butterFly: (w) => ((w + 250)*4) + (fixedHeight*6),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 7: 4 sliding panels w/o fixed
      type7: this.createCalculator(
        height => ({
          jambP: (height + 250) * 2,     // Full height
          interLock: (height + 250) * 4,  // Full height
          lockSection: (height + 250) * 4,   // Full height
          singleHeader: (height + 250)         // Specific for four panels
        }),
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250            // Sill profile (same as headerP)
        }),
        { 
          category: WINDOW_CATEGORIES.SLIDING,
          rollers: 8,
          lock: 3,
          guiders: 16,           // 16 guiders for 4 panels
          rubber: (h,w) => (h*8 + w*2),  // 8 height pieces + 2 width pieces
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: h => (h*8)
        }
      ),

      // TYPE 8: 4 sliding panels single fx 500mm
      type8: (() => {
        const fixedHeight = 500; // Scoped globally for this window type
        
        return this.createCalculator(
          height => {
            const newHeight = height - fixedHeight;
            return {
              jambP: (height + 250) * 2,     // Full height
              interLock: (newHeight + 250) * 4,  // Reduced height
              lockSection: (newHeight + 250) * 4,   // Reduced height
              singleHeader: (newHeight + 250)         // Specific for four panels
            };
          },
          width => ({
            topBottom: (width + 250) * 2, // 2 pieces
            headerP: width + 250,         // Header profile
            sillP: width + 250            // Sill profile (same as headerP)
          }),
          { 
            category: WINDOW_CATEGORIES.SLIDING,
            rollers: 8,
            lock: 3,
            guiders: 16,
            rubber: (h,w) => (h*8 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*8),
            special: {
              tube: (w) => (w + 250) + (fixedHeight*3),
              butterFly: (w) => ((w + 250)*2) + (fixedHeight*8),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 9: 4 sliding panels double fx 500mm each
      type9: (() => {
        const fixedHeight = 1000; // Scoped globally for this window type
        
        return this.createCalculator(
          height => {
            const newHeight = height - fixedHeight;
            return {
              jambP: (height + 250) * 2,     // Full height
              interLock: (newHeight + 250) * 4,  // Reduced height
              lockSection: (newHeight + 250) * 4,   // Reduced height
              singleHeader: (newHeight + 250)         // Specific for four panels
            };
          },
          width => ({
            topBottom: (width + 250) * 2, // 2 pieces
            headerP: width + 250,         // Header profile
            sillP: width + 250            // Sill profile (same as headerP)
          }),
          {
            category: WINDOW_CATEGORIES.SLIDING,
            rollers: 8,
            lock: 3,
            guiders: 16,
            rubber: (h,w) => (h*8 + w*6),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*8),
            special: {
              tube: (w) => ((w + 250)*2) + (fixedHeight*3),
              butterFly: (w) => ((w + 250)*4) + (fixedHeight*8),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 10: 2 sliding panels btm fx openable top with 500m heights
      type10: (() => {
        const fixedHeight = 1000; // Scoped globally for this window type
        
        return this.createCalculator(
          height => {
            const newHeight = height - fixedHeight;
            return {
              jambP: (height + 250) * 2,     // Full height
              interLock: (newHeight + 250) * 2,  // Reduced height
              lockSection: (newHeight + 250) * 2,   // Reduced height
              // Add casement components for the casement portion
              pOutter: fixedHeight,
              pInner: fixedHeight,
              pBidding: fixedHeight
            };
          },
          width => ({
            topBottom: (width + 250) * 2,    // Sliding components
            headerP: width + 250,
            sillP: width + 250,
            // Add casement components for the casement portion
            pOutter: (width + 250),
            pInner: (width + 250),
            pBidding: (width + 250)
          }),
          {
            category: WINDOW_CATEGORIES.HYBRID,
            rollers: 4,
            lock: 2,
            guiders: 8,
            projectHandle: 1,
            sideArms: 2,
            rubber: (h,w) => (h*4 + w*6),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*4),
            special: {
              tube: (w) => ((w+250)*2) + fixedHeight,
              butterFly: (w) => ((w + 250)*3) + (fixedHeight*3),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 11: 3 sliding panels btm fx openable top with 500m heights.
      type11: (() => {
        const fixedHeight = 1000; // Scoped globally for this window type
        
        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 4,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
            // Add casement components for the casement portion
            pOutter: fixedHeight * 2,
            pInner: fixedHeight * 2,
            pBidding: fixedHeight * 2
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250,            // Sill profile (same as headerP)
          // Add casement components for the casement portion
          pOutter: ((width * 1.5) + 250),
          pInner: ((width * 1.5) + 250),
          pBidding: ((width * 1.5) + 250)
        }),
          {
            category: WINDOW_CATEGORIES.HYBRID,
            rollers: 6,
            lock: 2,
            guiders: 12,
            projectHandle: 2,
            sideArms: 4,
            rubber: (h,w) => (h*6 + w*6),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*6),
            special: {
              tube: (w) => ((w+250)*2) + (fixedHeight*2),
              butterFly: (w) => ((w+250)*3) + (fixedHeight*3),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 12: 4 sliding panels btm fx openable top with 500m heights.
      type12: (() => {
        const fixedHeight = 1000; // Scoped globally for this window type
        
        return this.createCalculator(
          height => {
            const newHeight = height - fixedHeight;
            return {
              jambP: (height + 250) * 2,     // Full height
              interLock: (newHeight + 250) * 4,  // Reduced height
              lockSection: (newHeight + 250) * 4,   // Reduced height
              singleHeader: (newHeight + 250),         // Specific for four panels
              // Add casement components for the casement portion
              pOutter: fixedHeight * 2,
              pInner: fixedHeight * 2,
              pBidding: fixedHeight * 2
            };
          },
          width => ({
            topBottom: (width + 250) * 2, // 2 pieces
            headerP: width + 250,         // Header profile
            sillP: width + 250,            // Sill profile (same as headerP)
            // Add casement components for the casement portion
            pOutter: (width + 250),
            pInner: (width + 250),
            pBidding: (width + 250)
          }),
          {
            category: WINDOW_CATEGORIES.HYBRID,
            rollers: 8,
            lock: 3,
            guiders: 16,
            projectHandle: 2,
            sideArms: 4,
            rubber: (h,w) => (h*8 + w*6),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*8),
            special: {
              tube: (w) => ((w+250)*2) + (fixedHeight*3),
              butterFly: (w) => ((w+250)*3) + (fixedHeight*6),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 13: Single top-hung bath window
      type13: this.createCalculator(
        height => ({
          pOutter: (height + 100) * 2, 
          pInner: (height + 100) * 2, 
          pBidding: (height + 100) * 2,
        }),
        width => ({
          pOutter: (width + 100) * 2,
          pInner: (width + 100) * 2,
          pBidding: (width + 100) * 2,
        }),

        {
          category: WINDOW_CATEGORIES.CASEMENT,
          sideArms: 2,
          projectHandle: 1,
          rubber: (h,w) => (h*2 + w*2),
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: (h,w) => (h*2 + w*2),
          special: {
            // No special components needed for this type
          }
        }
      ),

      // TYPE 14: double btm fixed top-hung bath/regular window
      type14: this.createCalculator(
        height => ({
          pOutter: (height + 100) * 2, 
          pInner: (height + 100),
          pBidding: (height + 100) * 2,
        }),
        width => ({
          pOutter: (width + 100) * 2,
          pInner: (width + 100) * 2,
          pBidding: (width + 100) * 4,
          pInnerDiv: (width + 100),
        }),

        {
          category: WINDOW_CATEGORIES.CASEMENT,
          sideArms: 2,
          projectHandle: 1,
          rubber: (h,w) => (h*2 + w*4),  // 2 height + 4 width pieces
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: (h,w) => (h*2 + w*4),  // 2 height + 4 width pieces
          special: {
            // No special components needed for this type
          }
        }
      ),

      // TYPE 15: Custom projecting light window
      type15: this.createCalculator(
        height => ({
          pOutter: (height + 100) * 2, 
          pInner: (height + 100), 
          pBidding: (height + 100) * 4,
          pInnerDiv: (height +100),
        }),
        width => ({
          pOutter: (width + 100) * 2,
          pInner: (width + 100) * 0.7,
          pBidding: (width + 100) * 2.8,
          pInnerDiv: (width + 100) * 0.3,
        }),
        {
          category: WINDOW_CATEGORIES.CASEMENT,
          sideArms: 2,
          projectHandle: 1,
          rubber: (h,w) => (h*4 + w*3),  // 4 height + 3 width pieces
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: (h,w) => (h*4 + w*3),  // 4 height + 3 width pieces
          special: {
            // No special components needed for this type
          }
        }
      ),

      // TYPE 16: Single centre-hung
      type16: this.createCalculator(
        height => ({
          pOutter: (height + 100) * 2, 
          pInner: (height + 100), 
          pBidding: (height + 100) * 2,
        }),
        width => ({
          pOutter: (width + 100) * 2,
          pInner: (width + 100) * 2,
          pBidding: (width + 100) * 6,
          pInnerDiv: (width + 100) * 2,
        }),
        {
          category: WINDOW_CATEGORIES.CASEMENT,
          sideArms: 2,
          projectHandle: 1,
          rubber: (h,w) => (h*2 + w*6),  // 2 height + 6 width pieces
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: (h,w) => (h*2 + w*6),  // 2 height + 6 width pieces
          special: {
            // No special components needed for this type
          }
        }
      ),

      // TYPE 17: 2 sliding panels with awning top and wo fx bottom
      type17: (() => {
        const fixedHeight = 500; // Scoped globally for this window type
        
        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 2,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
            // Add casement components for the casement portion
            pOutter: fixedHeight * 2,
            pInner: fixedHeight * 2,
            pBidding: fixedHeight * 2
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250,            // Sill profile (same as headerP)
          // Add casement components for the casement portion
          pOutter: (width + 250),
          pInner: (width + 250),
          pBidding: (width + 250)
        }),
          {
            category: WINDOW_CATEGORIES.HYBRID,
            rollers: 4,
            lock: 2,
            guiders: 8,
            projectHandle: 1,
            sideArms: 2,
            rubber: (h,w) => (h*4 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*4),
            special: {
              tube: (w) => (w+250) + (fixedHeight),
              butterFly: (w) => (w + 250) + (fixedHeight*2),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 18: 3 sliding panels with awning top and wo fx bottom
      type18: (() => {
        const fixedHeight = 500; // Scoped globally for this window type
        
        return this.createCalculator(
        height => {
          const newHeight = height - fixedHeight;
          return {
            jambP: (height + 250) * 2,     // Full height
            interLock: (newHeight + 250) * 4,  // Reduced height
            lockSection: (newHeight + 250) * 2,   // Reduced height
            // Add casement components for the casement portion
            pOutter: fixedHeight * 4,
            pInner: fixedHeight * 4,
            pBidding: fixedHeight * 4
          };
        },
        width => ({
          topBottom: (width + 250) * 2, // 2 pieces
          headerP: width + 250,         // Header profile
          sillP: width + 250,            // Sill profile (same as headerP)
          // Add casement components for the casement portion
          pOutter: ((width * 1.5) + 250),
          pInner: ((width * 1.5) + 250),
          pBidding: ((width * 1.5) + 250)
        }),
          {
            category: WINDOW_CATEGORIES.HYBRID,
            rollers: 6,
            lock: 2,
            guiders: 12,
            projectHandle: 2,
            sideArms: 4,
            rubber: (h,w) => (h*6 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*6),
            special: {
              tube: (w) => (w+250) + (fixedHeight*2),
              butterFly: (w) => (w + 250) + (fixedHeight*2),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 19: 4 sliding panels with awning top and wo fx bottom
      type19: (() => {
        const fixedHeight = 500; // Scoped globally for this window type
        
        return this.createCalculator(
          height => {
            const newHeight = height - fixedHeight;
            return {
              jambP: (height + 250) * 2,     // Full height
              interLock: (newHeight + 250) * 4,  // Reduced height
              lockSection: (newHeight + 250) * 4,   // Reduced height
              singleHeader: (newHeight + 250),         // Specific for four panels
              // Add casement components for the casement portion
              pOutter: fixedHeight * 4,
              pInner: fixedHeight * 4,
              pBidding: fixedHeight * 4
            };
          },
          width => ({
            topBottom: (width + 250) * 2, // 2 pieces
            headerP: width + 250,         // Header profile
            sillP: width + 250,            // Sill profile (same as headerP)
            // Add casement components for the casement portion
            pOutter: (width + 250),
            pInner: (width + 250),
            pBidding: (width + 250)
          }),
          {
            category: WINDOW_CATEGORIES.HYBRID,
            rollers: 8,
            lock: 3,
            guiders: 16,
            projectHandle: 2,
            sideArms: 4,
            rubber: (h,w) => (h*8 + w*4),
            glass: (h,w) => ((h/304.8)*(w/304.8)),
            woolFile: h => (h*8),
            special: {
              tube: (w) => (w+250) + (fixedHeight*3),
              butterFly: (w) => (w+250) + (fixedHeight*4),
              jambCover: () => fixedHeight*2
            }
          }
        );
      })(),

      // TYPE 20: 4 sliding & Folding panels
      type20: this.createCalculator(
        height => ({
          foldingSashP: (height + 250) * 8,
          foldingBeading: (height + 250) * 8,
          foldingOutterFrameP: (height + 250) * 2, 
        }),
        width => ({
          foldingSashP: (width + 250) * 2,
          foldingBeading: (width + 250) * 2,
          foldingTopRailP: (width + 250),
          foldingBottomTrackP: (width + 250),
        }),
        {
          category: WINDOW_CATEGORIES.FOLDING,
          foldingRollers: 2,
          foldingLock: 2,
          foldingGuiders: 2,
          foldingHinges: 6,
          rubber: (h,w) => (h*8 + w*2),  // 8 height + 2 width pieces
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: (h,w) => (h*8 + w*2),  // 8 height + 2 width pieces
          special: {
            // No special components needed for this type
          }
        }
      ),

      // TYPE 21: 3 sliding & Folding panels
      type21: this.createCalculator(
        height => ({
          foldingSashP: (height + 250) * 6,
          foldingBeading: (height + 250) * 6,
          foldingOutterFrameP: (height + 250) * 2, 
        }),
        width => ({
          foldingSashP: (width + 250) * 2,
          foldingBeading: (width + 250) * 2,
          foldingTopRailP: (width + 250),
          foldingBottomTrackP: (width + 250),
        }),
        {
          category: WINDOW_CATEGORIES.FOLDING,
          foldingRollers: 1,
          foldingLock: 1,
          foldingGuiders: 1,
          foldingHinges: 4,
          rubber: (h,w) => (h*6 + w*2),  // 6 height + 2 width pieces
          glass: (h,w) => ((h/304.8)*(w/304.8)),
          woolFile: (h,w) => (h*6 + w*2),  // 6 height + 2 width pieces
          special: {
            // No special components needed for this type
          }
        }
      ),

    };
  }

createCalculator(heightFns, widthFns, options) {
  return {
    calculate: (height, width, glassType, glassThickness) => {
      if (!height || !width || height <= 100 || width <= 100) {
        throw new Error('Invalid dimensions - must be >100mm');
      }

      const config = PricingService.config;
      const heightComponents = typeof heightFns === 'function' 
        ? heightFns(height) 
        : heightFns;
      const widthComponents = typeof widthFns === 'function' 
        ? widthFns(width) 
        : widthFns;

      const calculations = {};
      const category = options.category || WINDOW_CATEGORIES.SLIDING;

      // Process all frame components
      const processComponent = (name, value, configName = name) => {
        if (value !== undefined) {
          calculations[name] = (value / 1000) * (config[configName] || 0);
        }
      };

      // Handle components based on category
      switch (category) {
        case WINDOW_CATEGORIES.SLIDING:
          processComponent('jambP', heightComponents.jambP);
          processComponent('interLock', heightComponents.interLock);
          processComponent('lockSection', heightComponents.lockSection);
          processComponent('singleHeader', heightComponents.singleHeader);
          processComponent('topBottom', widthComponents.topBottom);
          processComponent('headerP', widthComponents.headerP);
          calculations.sillP = calculations.headerP; // Sill same as header
          break;

        case WINDOW_CATEGORIES.CASEMENT:
          // Combine height and width components before processing
          processComponent('pOutter', 
            (heightComponents.pOutter + widthComponents.pOutter));
          processComponent('pInner', 
            (heightComponents.pInner + widthComponents.pInner));
          processComponent('pBidding', 
            (heightComponents.pBidding + widthComponents.pBidding));
          
          // Handle dividers - checks both height and width components
          const dividerLength = (heightComponents.pInnerDiv || 0) + 
                               (widthComponents.pInnerDiv || 0);
          if (dividerLength > 0) {
            processComponent('pInnerDiv', dividerLength);
          }
          break;

        case WINDOW_CATEGORIES.HYBRID:
          // Hybrid windows use both sliding and casement components
          processComponent('jambP', heightComponents.jambP);
          processComponent('interLock', heightComponents.interLock);
          processComponent('lockSection', heightComponents.lockSection);
          processComponent('singleHeader', heightComponents.singleHeader);
          processComponent('topBottom', widthComponents.topBottom);
          processComponent('headerP', widthComponents.headerP);
          calculations.sillP = calculations.headerP; // Sill same as header
          
          // Process casement components with correct config names
          processComponent('pOutterHeight', heightComponents.pOutter, 'pOutter');
          processComponent('pInnerHeight', heightComponents.pInner, 'pInner');
          processComponent('pBiddingHeight', heightComponents.pBidding, 'pBidding');
          processComponent('pOutterWidth', widthComponents.pOutter, 'pOutter');
          processComponent('pInnerWidth', widthComponents.pInner, 'pInner');
          processComponent('pBiddingWidth', widthComponents.pBidding, 'pBidding');
          break;

        case WINDOW_CATEGORIES.FOLDING:
          processComponent('foldingSashP', heightComponents.foldingSashP);
          processComponent('foldingBeading', heightComponents.foldingBeading);
          processComponent('foldingOutterFrameP', heightComponents.outterFrameP);

          processComponent('foldingSashP', widthComponents.foldingSashP);
          processComponent('foldingBeading', widthComponents.foldingBeading);
          processComponent('foldingTopRailP', widthComponents.foldingTopRailP);
          processComponent('foldingBottomTrackP', widthComponents.foldingBottomTrackP);
          break;
      }

      // Process hardware components
      const hardwareComponents = [
        'rollers', 'lock', 'guiders', 
        'projectHandle', 'sideArms',
        'foldingRollers', 'foldingLock', 
        'foldingGuiders', 'foldingHinges'
      ];
      
      hardwareComponents.forEach(comp => {
        if (options[comp]) {
          calculations[comp] = options[comp] * (config[comp] || 0);
        }
      });

      // Process flexible components
      if (options.rubber) {
        calculations.rubber = (options.rubber(height, width) / 1000) * config.rubber;
      }
      if (options.glass) {
        calculations.glass = options.glass(height, width) * config.glass;
      }
      if (options.woolFile) {
        // For functions that take both height and width
        if (options.woolFile.length === 2) {
          calculations.woolFile = (options.woolFile(height, width) / 1000) * config.woolFile;
        } 
        // For functions that only take height
        else {
          calculations.woolFile = (options.woolFile(height) / 1000) * config.woolFile;
        }
      }

      // Process special components
      if (options.special) {
        Object.entries(options.special).forEach(([name, fn]) => {
          if (typeof fn === 'function') {
            const value = fn(width); // Some specials use width only
            calculations[name] = (value / 1000) * (config[name] || 0);
          }
        });
      }

      return {
        ...calculations,


        // Folding combined getters
        foldingSash: () => (calculations.foldingSashHeight || 0) + (calculations.foldingSashWidth || 0),
        foldingBeading: () => (calculations.foldingBeadingHeight || 0) + (calculations.foldingBeadingWidth || 0),
        
        // Totals calculation
        totals: function() {
          return Object.values(calculations).reduce((sum, val) => 
            typeof val === 'function' ? sum + val() : sum + val, 0);
        },
        // Installation calculation
        installation: function() {
          return this.totals() * config.installPc;
        },
        // Total Cost calculation
        totalCost: function() {
          return this.totals() + this.installation();
        }
      };
    }
  };
}
}

module.exports = calculationService;
