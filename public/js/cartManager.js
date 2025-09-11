// public/js/cartManager.js
class CartManager {
  constructor() {
    this.cartId = this.getCartId();
    this.init();
  }

  init() {
    this.loadCart();
  }

  getCartId() {
    // Check if we already have a cart ID cookie
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'cartId') {
        return value;
      }
    }
    return null;
  }

  async loadCart() {
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          this.renderCart(data);
        }
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
          'Content-Type': 'application/json'
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
        method: 'DELETE'
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
          'Content-Type': 'application/json'
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
      const response = await fetch('/api/cart/clear', {
        method: 'DELETE'
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
      const itemTotal = item.unitPrice * item.quantity;
      html += `
        <div class="cart-item" data-id="${item._id}">
          <div class="preview">
            <img src="/img/labels/${item.type}.png" alt="${typeLabels[item.type] || item.type}" width="100" height="100">
          </div>
          <div class="description">
            <h4>${item.measurements.width} × ${item.measurements.height} mm ${typeLabels[item.type] || item.type}</h4>
            <p>${item.profileColour} Aluminium profiles</p>
            <p>${item.glassThickness} ${item.glassType} glass</p>
            <button class="remove-btn" onclick="cartManager.removeItem('${item._id}')">Remove</button>
          </div>
          <div class="price">
            Ksh ${item.unitPrice.toLocaleString()}
          </div>
          <div class="quantity">
            <button class="qty-btn minus" onclick="cartManager.updateQuantity('${item._id}', ${item.quantity - 1})">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn plus" onclick="cartManager.updateQuantity('${item._id}', ${item.quantity + 1})">+</button>
          </div>
          <div class="total">
            Ksh ${itemTotal.toLocaleString()}
          </div>
        </div>
      `;
    });

    html += `
        <div class="cart-footer">
          <div class="total-items">Total Items: ${totals.totalItems || 0}</div>
          <div class="grand-total">
            <strong>Grand Total:</strong> Ksh ${(totals.grandTotal || 0).toLocaleString()}
          </div>
        </div>
        <div class="cart-actions">
          <button onclick="cartManager.clearCart()" class="clear-cart-btn">Clear Cart</button>
          <button onclick="exportQuote()" class="export-btn">Export Quote</button>
        </div>
      </div>
    `;

    cartPreview.innerHTML = html;
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// Make it available globally
window.cartManager = cartManager;