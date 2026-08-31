'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL } from '@/lib/contact';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { currency, format } = useCurrency();
  const [isOrdered, setIsOrdered] = useState(false);
  const [showChannelPopup, setShowChannelPopup] = useState(false);
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
    setShowChannelPopup(true);
  };

  const buildOrderMessage = () => {
    const lines = items
      .map(item => `${item.quantity}x ${item.product.name} - ${format(parseFloat(item.product.price) * item.quantity)}`)
      .join('\n');
    return `New order from ${formData.name}\n\n${lines}\n\nTotal: ${format(totalPrice)}\n\nPhone: ${formData.phone}\nDelivery: ${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}`;
  };

  const sendOrder = (channel: 'sms' | 'whatsapp') => {
    const message = encodeURIComponent(buildOrderMessage());
    const url = channel === 'sms'
      ? `sms:+${BUSINESS_PHONE_TEL}?&body=${message}`
      : `https://wa.me/${BUSINESS_PHONE_TEL}?text=${message}`;

    // Trigger Email Notifications
    fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, items, totalPrice, currency, convertedTotal: format(totalPrice) }),
    }).catch(err => console.error('Email notification failed:', err));

    setShowChannelPopup(false);
    setIsOrdered(true);
    clearCart();

    if (channel === 'whatsapp') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
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
              We don&apos;t take payment on this page yet. After you place your order below, you&apos;ll choose to text or WhatsApp us your order — then we&apos;ll confirm payment and delivery details with you directly at the number below.
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
                <span style={{ fontWeight: 700 }}>{format(parseFloat(item.product.price) * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="summary-item">
            <span>Subtotal</span>
            <span>{format(totalPrice)}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Free</span>
          </div>
          <div className="summary-total" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', paddingTop: '1.5rem', marginTop: '0.5rem', borderTop: '2px dashed var(--border)' }}>
            <span>Total</span>
            <span>{format(totalPrice)}</span>
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

      {showChannelPopup && (
        <div
          className="lang-overlay"
          onClick={() => setShowChannelPopup(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose how to send your order"
        >
          <div className="lang-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="lang-modal-header">
              <div className="lang-modal-globe" style={{ fontSize: '1.5rem' }}>📦</div>
              <h2 className="lang-modal-title">Send Us Your Order</h2>
              <p className="lang-modal-sub">
                Choose how you&apos;d like to send your order — we&apos;ll reply there to confirm payment and delivery.
              </p>
            </div>

            <button className="lang-modal-close" onClick={() => setShowChannelPopup(false)} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn-primary" onClick={() => sendOrder('sms')}>
                📱 Text My Order
              </button>
              <button type="button" className="btn-secondary" onClick={() => sendOrder('whatsapp')}>
                💬 WhatsApp My Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
