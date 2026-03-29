'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartSidebar() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setCartOpen } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={() => setCartOpen(false)} />
      <aside className="cart-sidebar">
        <div className="cart-header">
          <h2>Clinical Order {items.length > 0 && `(${items.length})`}</h2>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="empty-cart">
              <p>Your order list is empty</p>
              <button className="btn-secondary" onClick={() => setCartOpen(false)}>Browse Pharmacy</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-info">
                  <p className="cart-item-name">{item.product.name}</p>
                  <p className="cart-item-price">${parseFloat(item.product.price).toFixed(2)} · {item.product.volume_ml}ml</p>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>−</button>
                    <span className="qty-display">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={() => removeFromCart(item.product.id)}>Remove</button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total</span>
              <span className="cart-total-price">${totalPrice.toFixed(2)}</span>
            </div>
            <Link href="/checkout" onClick={() => setCartOpen(false)}>
              <button className="checkout-btn">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
