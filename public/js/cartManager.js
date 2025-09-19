// public/js/cartManager.js
class CartManager {
  constructor() {
    // First check if we have a cart in URL
    const urlParams = new URLSearchParams(window.location.search);
    const cartParam = urlParams.get('cart');
    
    if (cartParam) {
      // Load from shared link
      this.loadFromSharedCart(cartParam);
    } else {
      // Normal operation
      this.cartId = this.generateCartId();
    }
    
    this.init();
  }

  generateCartId() {
    try {
      const consent = localStorage.getItem('cookieConsent');
      
      if (consent === 'rejected') {
        if (!sessionStorage.getItem('sessionCartId')) {
          sessionStorage.setItem('sessionCartId', `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
        }
        return sessionStorage.getItem('sessionCartId');
      }
      
      // Check for existing cookie
      const existingCartId = this.getCookie('cartId');
      if (existingCartId) {
        return existingCartId;
      }
      
      // Create new cart ID and set cookie
      const newCartId = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      document.cookie = `cartId=${newCartId}; max-age=31536000; path=/; secure; samesite=strict`;
      return newCartId;
      
    } catch (error) {
      console.warn('Storage access blocked, using session ID');
      return `fallback-${Date.now()}`;
    }
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  init() {
    this.loadCart();
  }

  async loadCart() {
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'X-Cart-ID': this.cartId
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.renderCart(data);
      } else {
        console.error('API returned error:', data.error);
      }
      
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }

  async addToCart(itemData) {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Cart-ID': this.cartId // Use stored ID
        },
        body: JSON.stringify(itemData)
      });

      const data = await response.json();
      
      if (data.success) {
        this.renderCart(data);
        return true;
      } else {
        console.error('Failed to add to cart:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  }

  async removeItem(itemId) {
    try {
      const response = await fetch(`/api/cart/item/${itemId}`, {
        method: 'DELETE',
        headers: {
          'X-Cart-ID': this.cartId
        }
      });

      const data = await response.json();
      
      if (data.success) {
        this.renderCart(data);
        return true;
      } else {
        console.error('Failed to remove item:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error removing item:', error);
      return false;
    }
  }

  async updateQuantity(itemId, quantity) {
    try {
      const response = await fetch(`/api/cart/item/${itemId}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Cart-ID': this.cartId
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();
      
      if (data.success) {
        this.renderCart(data);
        return true;
      } else {
        console.error('Failed to update quantity:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      return false;
    }
  }

  async clearCart() {
    try {
      const cartId = this.getCartId();
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'X-Cart-ID': this.cartId
        }
      });

      const data = await response.json();
      
      if (data.success) {
        this.renderCart(data);
        return true;
      } else {
        console.error('Failed to clear cart:', data.error);
        return false;
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  }

  renderCart(cartData) {
    const cartPreview = document.getElementById('cart-preview');
    if (!cartPreview) return;

    const { items, totals } = cartData;
    
    if (!items || items.length === 0) {
      cartPreview.innerHTML = `
        <div class="cart-container">
          <div class="empty-cart">
            <p>Your cart is empty</p>
          </div>
        </div>
      `;
      return;
    }

    // Type labels mapping
    const typeLabels = {
      type1: '2 Panel Sliding Window',
      type2: '2 Panel Sliding Window with Fixed',
      type3: '2 Panel Sliding Window with Double Fixed',
      type4: '3 Panel Sliding Window',
      type5: '3 Panel Sliding Window with Fixed',
      type6: '3 Panel Sliding Window with Double Fixed',
      type7: '4 Panel Sliding Window',
      type8: '4 Panel Sliding Window with Fixed',
      type9: '4 Panel Sliding Window with Double Fixed',
      type10: '2 Panel with Openable Top',
      type11: '3 Panel with Openable Top',
      type12: '4 Panel with Openable Top',
      type13: 'Single Top-Hung Window',
      type14: 'Double Top-Hung Window',
      type15: 'Custom Projecting Light Window',
      type16: 'Single Centre-Hung Window',
      type17: 'Sliding with Awning Top',
      type18: '4 Panel Folding Window',
      type19: '3 Panel Folding Window'
    };

    let html = `
      <div class="cart-container">
        <div class="cart-header">
          <div class="preview-head">Preview</div>
          <div class="desc-head">Description</div>
          <div class="price-head">Unit Price</div>
          <div class="qty-head">Quantity</div>
          <div class="total-head">Total</div>
        </div>
    `;

    items.forEach(item => {
      // Round the item total to whole number
      const itemTotal = Math.round(item.unitPrice * item.quantity);
      html += `
        <div class="cart-item" data-id="${item._id}">
          <div class="preview">
            <img src="/img/labels/${item.type}.png" alt="${typeLabels[item.type] || item.type}" width="100" height="100">
          </div>
          <div class="description">
            <h4>${item.measurements.width} × ${item.measurements.height} mm</h4>
            <p>[${item.profileColour}]</p>
            <p>${item.glassThickness} ${item.glassType} glass</p>
            <button class="remove-btn" onclick="cartManager.removeItem('${item._id}')">Remove</button>
          </div>
          <div class="price">
            Ksh ${Math.round(item.unitPrice).toLocaleString()}
          </div>
          <div class="quantity">
            <button class="qty-btn plus" onclick="cartManager.updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn minus" onclick="cartManager.updateQuantity('${item._id}', ${item.quantity - 1})">−</button>
          </div>
          <div class="total">
            Ksh ${itemTotal.toLocaleString()}
          </div>
        </div>
      `;
    });

    // Round the grand total as well
    const roundedGrandTotal = Math.round(totals.grandTotal || 0);
    
    html += `
        <div class="cart-footer">
          <div class="total-items">Total Items: ${totals.totalItems || 0}</div>
          <div class="grand-total">
            <strong>Grand Total:</strong> Ksh ${roundedGrandTotal.toLocaleString()}
          </div>
        </div>
        <div class="cart-actions">
          <button onclick="cartManager.clearCart()" class="clear-cart-btn">Clear Cart</button>
          <button onclick="exportQuote()" class="export-btn">Contact Us with this order</button>
        </div>
      </div>
    `;

    cartPreview.innerHTML = html;
  }

  exportQuote() {
    try {
      const consent = localStorage.getItem('cookieConsent');
      
      if (consent === 'rejected') {
        return this.handleSessionCartExport();
      }
      
      return this.handleCookieCartExport();
      
    } catch (error) {
      console.error('Error exporting quote:', error);
      alert('Sorry, there was an error preparing your quote for sharing.');
      return false;
    }
  }

  handleCookieCartExport() {
    const cartData = {
      cartId: this.cartId,
      timestamp: Date.now(),
      storageType: 'cookie'
    };
    
    const encodedCart = btoa(JSON.stringify(cartData));
    const shareableLink = `${window.location.origin}${window.location.pathname}?cart=${encodedCart}`;
    
    const whatsappMessage = `Hello! I'm interested in this window configuration: ${shareableLink}`;
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    window.open(`https://api.whatsapp.com/send/?phone=254724275877&text=${encodedMessage}&app_absent=0`, '_blank');
    return true;
  }

  async handleSessionCartExport() {
    const shouldSave = confirm('To share your cart, we need to save it to our database first. This will allow us to retrieve it later. Continue?');
    
    if (!shouldSave) return false;
    
    try {
      const persistentCartId = await this.saveSessionCartToDatabase();
      if (!persistentCartId) return false;
      
      const cartData = {
        cartId: persistentCartId,
        timestamp: Date.now(),
        storageType: 'database'
      };
      
      const encodedCart = btoa(JSON.stringify(cartData));
      const shareableLink = `${window.location.origin}${window.location.pathname}?cart=${encodedCart}`;
      
      const whatsappMessage = `Hello! I'm interested in this window configuration: ${shareableLink}`;
      const encodedMessage = encodeURIComponent(whatsappMessage);
      
      window.open(`https://api.whatsapp.com/send/?phone=254724275877&text=${encodedMessage}&app_absent=0`, '_blank');
      return true;
      
    } catch (error) {
      console.error('Error saving session cart:', error);
      alert('Failed to save your cart. Please try again or accept cookies to enable sharing.');
      return false;
    }
  }

  async saveSessionCartToDatabase() {
    try {
      const response = await fetch('/api/cart/save-session-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-Cart-ID': this.cartId
        }
      });
      
      const data = await response.json();
      return data.success ? data.persistentCartId : null;
      
    } catch (error) {
      console.error('Error saving session cart to database:', error);
      throw error;
    }
  }

  loadFromSharedCart(cartParam) {
    try {
      const cartData = JSON.parse(atob(cartParam));
      
      if (cartData.storageType === 'database') {
        this.cartId = cartData.cartId;
        this.isPersistentCart = true;
      } else {
        this.cartId = cartData.cartId;
        this.isPersistentCart = false;
      }
      
      this.loadCart();
      
    } catch (error) {
      console.error('Error loading shared cart:', error);
      this.cartId = this.generateCartId();
    }
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make it available globally
window.cartManager = cartManager;

// Global function - REMOVE FROM INSIDE CLASS, PUT HERE
window.exportQuote = function() {
  if (window.cartManager) {
    return cartManager.exportQuote();
  }
  console.error('Cart manager not initialized');
  return false;
};
