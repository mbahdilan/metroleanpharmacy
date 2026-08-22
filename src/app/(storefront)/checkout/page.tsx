'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useExchangeRates } from '@/hooks/useExchangeRates';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '@/lib/contact';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { formatPrice } = useExchangeRates();
  const [isOrdered, setIsOrdered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger Email Notifications
    fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, items, totalPrice }),
    }).catch(err => console.error('Email notification failed:', err));

    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <div className="checkout-section">
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem' }}>✓</span>
          <h1 style={{ marginBottom: '1rem' }}>Order Confirmed</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Thank you for your order. A confirmation receipt has been sent to <strong>{formData.email}</strong>.
          </p>
          <div style={{
            background: 'var(--accent-light)',
            border: '1px solid var(--primary-light)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '2rem',
            textAlign: 'left',
          }}>
            <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Next: confirm payment</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Call, text, or WhatsApp us at the number below and we&apos;ll walk you through payment and delivery.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href={`tel:+${BUSINESS_PHONE_TEL}`} className="btn-secondary" style={{ textDecoration: 'none' }}>📞 Call / Text {BUSINESS_PHONE_DISPLAY}</a>
              <a href={`https://wa.me/${BUSINESS_PHONE_TEL}`} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ textDecoration: 'none' }}>💬 WhatsApp Us</a>
            </div>
          </div>
          <Link href="/shop" className="btn-primary">Return to Shop</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Your cart is empty</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Add some products from our shop before checking out.</p>
        <Link href="/shop" className="btn-primary">Browse Shop</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 style={{ marginBottom: '3rem' }}>Complete Your Order</h1>

      <div className="checkout-grid">
        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-section">
            <h2 className="checkout-title">🚚 Delivery Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Full Name</label>
                <input
                  type="text" name="name" className="form-input" required
                  value={formData.name} onChange={handleChange} placeholder="Jane Miller"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Email Address</label>
                <input
                  type="email" name="email" className="form-input" required
                  value={formData.email} onChange={handleChange} placeholder="jane@example.com"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel" name="phone" className="form-input" required
                  value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Delivery Address</label>
                <input
                  type="text" name="address" className="form-input" required
                  value={formData.address} onChange={handleChange} placeholder="123 Main Street"
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text" name="city" className="form-input" required
                  value={formData.city} onChange={handleChange} placeholder="San Francisco"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Postal Code</label>
                <input
                  type="text" name="zip" className="form-input" required
                  value={formData.zip} onChange={handleChange} placeholder="94103"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Country</label>
                <input
                  type="text" name="country" className="form-input" required
                  value={formData.country} onChange={handleChange} placeholder="United States"
                />
              </div>
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-title">💳 How Payment Works</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
              We don&apos;t take payment on this page yet. After you place your order below, you&apos;ll get an email confirmation right away — then just call, text, or WhatsApp us at the number below and we&apos;ll confirm payment and delivery details with you directly.
            </p>
            <div style={{
              padding: '1rem 1.25rem',
              background: 'var(--bg-main)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--text-primary)'
            }}>
              📞 {BUSINESS_PHONE_DISPLAY}
            </div>
          </div>
        </form>

        <div className="summary-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 800 }}>Order Summary</h2>
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {item.quantity}× {item.product.name}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontWeight: 700 }}>{formatPrice(parseFloat(item.product.price) * item.quantity).usd}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {formatPrice(parseFloat(item.product.price) * item.quantity).eur} | {formatPrice(parseFloat(item.product.price) * item.quantity).gbp}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="summary-item">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice).usd}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Free</span>
          </div>
          <div className="summary-total" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', paddingTop: '1.5rem', marginTop: '0.5rem', borderTop: '2px dashed var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Total</span>
              <span>{formatPrice(totalPrice).usd}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {formatPrice(totalPrice).eur} | {formatPrice(totalPrice).gbp}
            </span>
          </div>

          <button
            type="submit"
            className="place-order-btn"
            onClick={handlePlaceOrder}
            disabled={!formData.name || !formData.email || !formData.phone || !formData.address}
          >
            Place Order
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
            By placing this order, you agree to our <Link href="/terms" style={{ textDecoration: 'underline' }}>Terms of Service</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
