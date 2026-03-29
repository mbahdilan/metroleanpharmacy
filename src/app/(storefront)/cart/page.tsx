'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const [voucher, setVoucher] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  const deliveryFee = totalPrice > 50 ? 0 : 5.00;
  const discountAmount = totalPrice * (appliedDiscount / 100);
  const grandTotal = totalPrice - discountAmount + deliveryFee;

  const handleApplyVoucher = () => {
    // Demo: accept "SAVE10" for 10% off
    if (voucher.toUpperCase() === 'SAVE10') {
      setAppliedDiscount(10);
    } else {
      setAppliedDiscount(0);
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Shopping Cart</h1>

      <div className="cart-page-grid">
        {/* ── Left Column: Product Table ── */}
        <div className="cart-page-left">
          {items.length === 0 ? (
            <div className="cart-page-empty">
              <span className="cart-page-empty-icon">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Browse our pharmacy and add products to your cart.</p>
              <Link href="/shop" className="btn-primary">Browse Pharmacy</Link>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="cart-table-header">
                <span className="cart-col-product">Product Code</span>
                <span className="cart-col-qty">Quantity</span>
                <span className="cart-col-total">Total</span>
                <span className="cart-col-action">Action</span>
              </div>

              {/* Table Rows */}
              {items.map(item => {
                const price = parseFloat(item.product.price);
                const lineTotal = price * item.quantity;
                return (
                  <div key={item.product.id} className="cart-table-row">
                    {/* Product Info */}
                    <div className="cart-col-product">
                      <div className="cart-product-thumb">
                        {item.product.image_url ? (
                          <img src={item.product.image_url} alt={item.product.name} />
                        ) : (
                          <span className="cart-product-thumb-placeholder">💊</span>
                        )}
                      </div>
                      <div className="cart-product-details">
                        <p className="cart-product-name">{item.product.name}</p>
                        <p className="cart-product-variant">
                          {item.product.dosage_form} · {item.product.volume_ml}ml
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="cart-col-qty">
                      <div className="cart-qty-controls">
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className="cart-qty-value">{item.quantity}</span>
                        <button
                          className="cart-qty-btn"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Line Total */}
                    <div className="cart-col-total">
                      <span className="cart-line-total">${lineTotal.toFixed(2)}</span>
                    </div>

                    {/* Delete Action */}
                    <div className="cart-col-action">
                      <button
                        className="cart-delete-btn"
                        onClick={() => removeFromCart(item.product.id)}
                        title="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Bottom Actions */}
              <div className="cart-table-actions">
                <button className="cart-update-btn" onClick={() => {}}>
                  Update Cart
                </button>
                <button className="cart-clear-btn" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Right Column: Order Summary ── */}
        <div className="cart-page-right">
          <div className="order-summary-card">
            <h3 className="order-summary-title">Order Summary</h3>

            {/* Voucher Input */}
            <div className="voucher-row">
              <input
                type="text"
                className="voucher-input"
                placeholder="Discount voucher"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <button className="voucher-apply-btn" onClick={handleApplyVoucher}>
                Apply
              </button>
            </div>

            {/* Summary Lines */}
            <div className="order-summary-lines">
              <div className="summary-line">
                <span>Sub Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="summary-line summary-line-discount">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Delivery fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
            </div>

            {/* Total */}
            <div className="order-summary-total">
              <span>Total</span>
              <span className="order-summary-total-price">${grandTotal.toFixed(2)}</span>
            </div>

            {/* Warranty Note */}
            <div className="order-summary-note">
              <span className="order-summary-note-icon">🛡️</span>
              <p>All pharmaceutical products comply with <strong>regulatory standards</strong>. <a href="/terms">Details</a></p>
            </div>

            {/* Checkout Button */}
            <Link href="/checkout" className="cart-checkout-btn">
              Checkout Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
