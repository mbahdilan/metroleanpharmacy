'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, isHydrated } = useCart();
  const [voucher, setVoucher] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const { format } = useCurrency();

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

  if (!isHydrated) {
    return (
      <div className="cart-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Your Cart</h1>

      <div className="cart-page-grid">
        {/* ── Left Column: Product List ── */}
        <div className="cart-page-left">
          {items.length === 0 ? (
            <div className="cart-page-empty">
              <span className="cart-page-empty-icon">🛒</span>
              <h3>Your cart is empty</h3>
              <p>Browse our shop and add items to your cart.</p>
              <Link href="/shop" className="btn-primary" style={{ marginTop: '1.5rem' }}>Browse Shop</Link>
            </div>
          ) : (
            <>
              {/* Table Header (Desktop Only) */}
              <div className="cart-table-header">
                <span>Product Details</span>
                <span style={{ textAlign: 'center' }}>Quantity</span>
                <span style={{ textAlign: 'right' }}>Line Total</span>
                <span style={{ textAlign: 'center' }}></span>
              </div>

              {/* Items List */}
              <div className="cart-items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map(item => {
                  const price = parseFloat(item.product.price);
                  const lineTotal = price * item.quantity;
                  return (
                    <div key={item.product.id} className="cart-table-row">
                      {/* Product Detail Card */}
                      <div className="cart-col-product">
                        <div className="cart-product-thumb">
                          {item.product.image_urls?.[0] ? (
                            <img src={item.product.image_urls[0]} alt={item.product.name} />
                          ) : (
                            <span style={{ fontSize: '2rem' }}>📦</span>
                          )}
                        </div>
                        <div className="cart-product-details">
                          <p className="cart-product-name">{item.product.name}</p>
                          <p className="cart-product-variant">
                             {item.product.dosage_form || 'Standard'} · {item.product.volume_ml ? `${item.product.volume_ml}ml` : 'Unit'}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Container */}
                        <div className="cart-qty-controls-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                          <div className="cart-qty-controls">
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              −
                            </button>
                            <span className="cart-qty-value">{item.quantity}</span>
                            <button
                              className="cart-qty-btn"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          {item.product.min_quantity > 1 && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: 700 }}>
                              Min. {item.product.min_quantity} units
                            </span>
                          )}
                        </div>

                      {/* Price Container */}
                      <div className="cart-col-total" style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <span className="cart-line-total" style={{ fontWeight: 800 }}>{format(lineTotal)}</span>
                      </div>

                      {/* Action Container */}
                      <div className="cart-col-action" style={{ display: 'flex', justifyContent: 'center' }}>
                        <button
                          className="cart-delete-btn"
                          onClick={() => removeFromCart(item.product.id)}
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="cart-table-actions">
                <Link href="/shop" className="cart-update-btn">
                  ← Continue Shopping
                </Link>
                <button className="cart-clear-btn" onClick={clearCart}>
                  Clear cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* ── Right Column: Order Summary (Sticky) ── */}
        <div className="cart-page-right">
          <div className="order-summary-card">
            <h3 className="order-summary-title">Summary</h3>

            {/* Voucher Section */}
            <div className="voucher-row">
              <input
                type="text"
                className="voucher-input"
                placeholder="Promo Code"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <button className="voucher-apply-btn" onClick={handleApplyVoucher}>
                Apply
              </button>
            </div>

            {/* Price Calculations */}
            <div className="order-summary-lines">
              <div className="summary-line">
                <span>Sub-total</span>
                <span>{format(totalPrice)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="summary-line summary-line-discount">
                  <span>Discount ({appliedDiscount}%)</span>
                  <span>-{format(discountAmount)}</span>
                </div>
              )}
              <div className="summary-line">
                <span>Shipping</span>
                <span>{deliveryFee === 0 ? 'FREE' : format(deliveryFee)}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="order-summary-total" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Payable Total</span>
              <span className="order-summary-total-price">{format(grandTotal)}</span>
            </div>

            {/* Compliance Note */}
            <div className="order-summary-note">
              <span className="order-summary-note-icon">📋</span>
              <p>By proceeding, you agree to our <a href="/terms" style={{ textDecoration: 'underline' }}>Terms of Service</a>.</p>
            </div>

            {/* Primary Action */}
            <Link href="/checkout" className="cart-checkout-btn">
              Proceed to Secure Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
