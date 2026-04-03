'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <aside className="cart-sidebar shadow-premium">
        <div className="cart-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ margin: 0 }}>Clinical Order</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in list
            </span>
          </div>
          <button className="close-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>🛒</span>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Your order list is empty</p>
              <button 
                className="btn-secondary" 
                onClick={() => setCartOpen(false)}
                style={{ marginTop: '1rem', width: '100%', borderRadius: '12px' }}
              >
                Browse Pharmacy
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.product.name}</p>
                  <p className="cart-item-price">
                    <span style={{ color: 'var(--primary)', fontWeight: 800 }}>${parseFloat(item.product.price).toFixed(2)}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>
                      {item.product.volume_ml ? `${item.product.volume_ml}ml` : 'Unit'}
                    </span>
                  </p>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                    <span className="qty-display">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.product.id)}
                  style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.7 }}
                >
                  REMOVE
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Subtotal</span>
              <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
            </div>
            <Link href="/cart" onClick={() => setCartOpen(false)} className="view-cart-btn-secondary" style={{ display: 'block', textAlign: 'center', marginBottom: '1rem', fontWeight: 700, color: 'var(--primary)', textDecoration: 'underline', fontSize: '0.9rem' }}>
              View Full Clinical Order
            </Link>
            <Link href="/checkout" onClick={() => setCartOpen(false)} className="checkout-btn" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Proceed to Secure Checkout
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
