'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
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
  const [selectedPayment, setSelectedPayment] = useState<string>('');

  const paymentMethods = [
    { id: 'crypto', name: 'Crypto', logo: 'https://www.vectorlogo.zone/logos/bitcoin/bitcoin-icon.svg' },
    { id: 'zelle', name: 'Zelle', logo: 'https://www.zellepay.com/sites/default/files/bimi/Zelle_BIMI_082621.svg' },
    { id: 'paypal', name: 'PayPal', logo: 'https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg' },
    { id: 'venmo', name: 'Venmo', logo: 'https://www.vectorlogo.zone/logos/venmo/venmo-icon.svg' },
    { id: 'chime', name: 'Chime', logo: 'https://amplify.valimail.com/bimi/chime/DLFmWEqpvyA-chime_financial_inc_1456987116.svg' },
    { id: 'giftcard', name: 'Giftcard', logo: 'https://www.vectorlogo.zone/logos/mastercard/mastercard-icon.svg' }, // Mastercard as requested
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // WhatsApp Number
    const phoneNumber = '237670666946';

    // Format Cart Items
    const itemsList = items
      .map(item => `• ${item.quantity}x ${item.product.name} - $${(parseFloat(item.product.price) * item.quantity).toFixed(2)}`)
      .join('\n');

    // Format Message
    const message = `*New Clinical Order - Metrolean Pharmacy*\n\n` +
      `*Patient Information:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}\n\n` +
      `*Payment Method:* ${selectedPayment || 'Not Selected'}\n\n` +
      `*Order Details:*\n` +
      `${itemsList}\n\n` +
      `*Total Cost: $${totalPrice.toFixed(2)}*\n\n` +
      `Please process this order for clinical distribution.`;

    // Encode and Redirect
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');

    // Trigger Email Notifications
    fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData, items, totalPrice, selectedPayment }),
    }).catch(err => console.error('Email notification failed:', err));

    // Simulate internal order placement and clear cart
    setIsOrdered(true);
    clearCart();
  };

  if (isOrdered) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <div className="checkout-section">
          <span style={{ fontSize: '4rem', display: 'block', marginBottom: '1.5rem' }}>✓</span>
          <h1 style={{ marginBottom: '1rem' }}>Order Confirmed</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Thank you for choosing Metrolean Pharmacy. Your clinical order has been received. 
            A confirmation receipt and detailed inventory have been sent to <strong>{formData.email}</strong>. 
            <br /><br />
            <em>Please check your inbox (and spam folder) for the payment link and distribution updates.</em>
          </p>
          <Link href="/shop" className="btn-primary">Return to Pharmacy</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Order list is empty</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Please select clinical solutions from our digital pharmacy before checking out.</p>
        <Link href="/shop" className="btn-primary">Browse Pharmacy</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 style={{ marginBottom: '3rem' }}>Finalize Clinical Order</h1>
      
      <div className="checkout-grid">
        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-section">
            <h2 className="checkout-title">🚚 Patient & Delivery Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Patient Full Name</label>
                <input 
                  type="text" name="name" className="form-input" required 
                  value={formData.name} onChange={handleChange} placeholder="Johnathan Miller"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Contact Email</label>
                <input 
                  type="email" name="email" className="form-input" required 
                  value={formData.email} onChange={handleChange} placeholder="j.miller@client.com"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Phone Number</label>
                <input 
                  type="tel" name="phone" className="form-input" required 
                  value={formData.phone} onChange={handleChange} placeholder="+237 6XX XXX XXX"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Delivery Address</label>
                <input 
                  type="text" name="address" className="form-input" required 
                  value={formData.address} onChange={handleChange} placeholder="456 Clinical Road"
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
            <h2 className="checkout-title">💳 Selection of Payment Method</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Please select your preferred secure payment method below.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', 
              gap: '1.5rem',
              padding: '1rem 0'
            }}>
              {paymentMethods.map((method) => (
                <div 
                  key={method.id}
                  onClick={() => setSelectedPayment(method.name)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: selectedPayment === method.name ? 'scale(1.25)' : 'scale(1)',
                    filter: selectedPayment && selectedPayment !== method.name ? 'grayscale(0.8) opacity(0.6)' : 'none',
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '16px',
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '10px',
                    boxShadow: selectedPayment === method.name 
                      ? '0 10px 25px -5px rgba(var(--primary-rgb), 0.4), 0 0 0 3px var(--primary)' 
                      : '0 4px 6px -1px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border)',
                  }}>
                    <img 
                      src={method.logo} 
                      alt={method.name} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain' 
                      }} 
                    />
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: 700, 
                    color: selectedPayment === method.name ? 'var(--primary-dark)' : 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-title">🩺 Clinical Processing</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Metrolean Pharmacy currently processes all orders through our digital clinical portal.
            </p>
            <div style={{ 
              padding: '1rem', 
              background: 'var(--primary-light)', 
              borderRadius: '12px', 
              border: '1px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '1.5rem' }}>✅</span>
              <div>
                <p style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>Verified Order Path</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Secure order confirmation and distribution.</p>
              </div>
            </div>
          </div>
        </form>

        <div className="summary-card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 800 }}>Order Inventory</h2>
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map(item => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {item.quantity}× {item.product.name}
                </span>
                <span style={{ fontWeight: 700 }}>${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="summary-item">
            <span>Subtotal</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>
          <div className="summary-item">
            <span>Clinical Handling</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Complimentary</span>
          </div>
          <div className="summary-total">
            <span>Total Cost</span>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div style={{ 
            background: 'var(--primary-light)', 
            padding: '1rem', 
            borderRadius: '12px', 
            fontSize: '0.8rem', 
            marginBottom: '1.5rem',
            border: '1px solid var(--primary)',
            color: 'var(--primary-dark)',
            lineHeight: 1.5
          }}>
            <strong>Direct Clinical Processing:</strong> Upon clicking below, you will be professionally redirected to our WhatsApp desk to finalize distribution. A formal order receipt and secondary payment link will also be dispatched to <strong>{formData.email || 'your email'}</strong> for your clinical records.
          </div>

          <button 
            type="submit" 
            className="place-order-btn" 
            onClick={handlePlaceOrder}
            disabled={!formData.name || !formData.email || !formData.phone || !formData.address || !selectedPayment}
          >
            Confirm & Finalize Order
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
            By confirming, you certify that the provided information is accurate for clinical distribution purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
