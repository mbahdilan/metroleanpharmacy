'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useExchangeRates } from '@/hooks/useExchangeRates';

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
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBankListOpen, setIsBankListOpen] = useState(false);
  const [customBankName, setCustomBankName] = useState<string>('');
  const [confirmationMethod, setConfirmationMethod] = useState<'whatsapp' | 'imessage' | 'email'>('whatsapp');
  const [whatsappRegion, setWhatsappRegion] = useState<'us' | 'uk'>('us');

  const coreMethods = [
    { id: 'applepay', name: 'Apple Pay', logo: '/images/apple_pay_logo.png' },
    { id: 'googlepay', name: 'Google Pay', logo: '/images/google_pay_logo.png' },
    { id: 'etransfer', name: 'e-Transfer', logo: '/images/interac_etransfer_logo.png' },
    { id: 'ach', name: 'ACH', logo: '/images/ach_logo.png' },
    { id: 'cashapp', name: 'Cash App', logo: '/images/cash_app_logo.png' },
    { id: 'crypto', name: 'Crypto', logo: 'https://www.vectorlogo.zone/logos/bitcoin/bitcoin-icon.svg' },
    { id: 'zelle', name: 'Zelle', logo: 'https://www.zellepay.com/sites/default/files/bimi/Zelle_BIMI_082621.svg' },
    { id: 'paypal', name: 'PayPal', logo: 'https://www.vectorlogo.zone/logos/paypal/paypal-icon.svg' },
    { id: 'venmo', name: 'Venmo', logo: 'https://www.vectorlogo.zone/logos/venmo/venmo-icon.svg' },
    { id: 'chime', name: 'Chime', logo: '/images/chime_logo.png' },
    { id: 'otherbank', name: 'Other Bank', logo: '/images/ecb_logo.png' },
    { id: 'giftcard', name: 'Giftcard', logo: '/images/mastercard_logo.png' }, 
  ];

  const bankMethods = [
    { id: 'hsbc', name: 'HSBC Holdings PLC', logo: '/images/hsbc_logo.png' },
    { id: 'bnpparibas', name: 'BNP Paribas', logo: '/images/bnp_paribas_logo.png' },
    { id: 'deutschebank', name: 'Deutsche Bank', logo: '/images/deutsche_bank_logo.png' },
    { id: 'creditagricole', name: 'Crédit Agricole', logo: '/images/credit_agricole_logo.png' },
    { id: 'ubs', name: 'UBS Group AG', logo: '/images/ubs_logo.png' },
    { id: 'barclays', name: 'Barclays', logo: '/images/barclays_logo.png' },
    { id: 'santander', name: 'Santander', logo: '/images/santander_logo.png' },
    { id: 'ing', name: 'ING Group', logo: '/images/ing_logo.png' },
    { id: 'lloyds', name: 'Lloyds Banking Group', logo: '/images/lloyds_logo.png' },
    { id: 'societe', name: 'Société Générale', logo: '/images/societe_generale_logo.png' },
  ];

  // Combined list for finding currently selected logo
  const allMethods = [...coreMethods, ...bankMethods];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    // WhatsApp Numbers
    const whatsappNumbers = {
      us: '18013740460',
      uk: '447401663204'
    };
    const phoneNumber = whatsappNumbers[whatsappRegion];

    // Format Cart Items
    const itemsList = items
      .map(item => `• ${item.quantity}x ${item.product.name} - $${(parseFloat(item.product.price) * item.quantity).toFixed(2)}`)
      .join('\n');

    // Format Message
    const paymentInfo = selectedPayment === 'Other Bank' 
      ? `Other Bank (${customBankName || 'Not Specified'})` 
      : (selectedPayment || 'Not Selected');

    const message = `*New Syndicate Order - Metrolean Market*\n\n` +
      `*Client Information:*\n` +
      `Name: ${formData.name}\n` +
      `Email: ${formData.email}\n` +
      `Phone: ${formData.phone}\n` +
      `Address: ${formData.address}, ${formData.city}, ${formData.zip}, ${formData.country}\n\n` +
      `*Payment Method:* ${paymentInfo}\n\n` +
      `*Order Details:*\n` +
      `${itemsList}\n\n` +
      `*Total Cost: $${totalPrice.toFixed(2)}*\n\n` +
      `Please process this order for syndicate distribution.`;

    // Encode and Redirect
    const encodedMessage = encodeURIComponent(message);
    
    if (confirmationMethod === 'whatsapp') {
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } else if (confirmationMethod === 'imessage') {
      const imessageEmail = 'tchallah@icloud.com';
      const imessageUrl = `imessage:${imessageEmail}?body=${encodedMessage}`;
      window.open(imessageUrl, '_blank');
    }
    // If 'email' is selected, the success screen will just show up below

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
            Thank you for choosing Metrolean Market. Your syndicate order has been received. 
            A confirmation receipt and detailed inventory have been sent to <strong>{formData.email}</strong>. 
            <br /><br />
            <em>Please check your inbox (and spam folder) for the payment link and distribution updates.</em>
          </p>
          <Link href="/shop" className="btn-primary">Return to Market</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-container" style={{ textAlign: 'center', paddingTop: '10rem' }}>
        <h1 style={{ marginBottom: '1rem' }}>Order list is empty</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>Please select premium syndicate solutions from our digital market before checking out.</p>
        <Link href="/shop" className="btn-primary">Browse Market</Link>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 style={{ marginBottom: '3rem' }}>Finalize Syndicate Order</h1>
      
      <div className="checkout-grid">
        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-section">
            <h2 className="checkout-title">🚚 Client & Delivery Information</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label">Client Full Name</label>
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
                  value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000"
                />
              </div>
              <div className="form-group full-width">
                <label className="form-label">Delivery Address</label>
                <input 
                  type="text" name="address" className="form-input" required 
                  value={formData.address} onChange={handleChange} placeholder="456 Syndicate Road"
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
            
            <div style={{ position: 'relative', width: '100%' }}>
              {/* Custom Dropdown Trigger */}
              <div 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.5rem',
                  background: 'var(--bg-main)',
                  border: isDropdownOpen ? '2px solid var(--primary)' : '1px solid var(--border)',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isDropdownOpen ? '0 10px 25px -5px rgba(0,0,0, 0.5)' : 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {selectedPayment ? (
                    <>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-card)', 
                        padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: '1px solid var(--border)'
                      }}>
                        <img 
                          src={allMethods.find(m => m.name === selectedPayment)?.logo} 
                          alt="" 
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedPayment}</span>
                    </>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Choose a syndicate payment path...</span>
                  )}
                </div>
                <svg 
                  width="14" 
                  height="14" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ 
                    transition: 'transform 0.3s ease',
                    transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop for closing */}
                  <div 
                    onClick={() => setIsDropdownOpen(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                  />
                  
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: 0,
                    right: 0,
                    zIndex: 20,
                    background: 'rgba(10, 10, 10, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border)',
                    borderRadius: '18px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                    padding: '8px',
                    maxHeight: '350px',
                    overflowY: 'auto',
                    animation: 'dropdownIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}>
                    {/* Grouped Bank Option - Now FIRST */}
                    <div 
                      onClick={() => setIsBankListOpen(!isBankListOpen)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.8rem 1rem',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: isBankListOpen ? 'var(--bg-card-hover)' : 'transparent',
                        color: 'var(--primary)',
                        fontWeight: 700
                      }}
                      onMouseOver={(e) => {
                        if (!isBankListOpen) e.currentTarget.style.background = 'var(--bg-card-hover)';
                      }}
                      onMouseOut={(e) => {
                        if (!isBankListOpen) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-main)', 
                          padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid var(--border)', color: 'var(--primary)'
                        }}>
                          {/* Generic Bank Building SVG Icon */}
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M5 6l7-3 7 3"/><path d="M4 10v11"/><path d="M20 10v11"/><path d="M8 14v3"/><path d="M12 14v3"/><path d="M16 14v3"/></svg>
                        </div>
                        <span>Choose Bank</span>
                      </div>
                      <svg 
                        width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" 
                        style={{ transition: 'transform 0.3s ease', transform: isBankListOpen ? 'rotate(180deg)' : 'rotate(0)' }}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>

                    {/* Bank Sub-Menu */}
                    {isBankListOpen && (
                      <div style={{ marginTop: '4px', borderLeft: '2px solid var(--primary-light)', marginLeft: '1.5rem', marginBottom: '8px' }}>
                        {bankMethods.map((bank) => (
                          <div 
                            key={bank.id}
                            onClick={() => {
                              setSelectedPayment(bank.name);
                              setIsDropdownOpen(false);
                              setIsBankListOpen(false);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              padding: '0.6rem 1rem',
                              borderRadius: '0 10px 10px 0',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              background: selectedPayment === bank.name ? 'var(--primary-light)' : 'transparent',
                            }}
                            onMouseOver={(e) => {
                              if (selectedPayment !== bank.name) e.currentTarget.style.background = 'var(--bg-card-hover)';
                            }}
                            onMouseOut={(e) => {
                              if (selectedPayment !== bank.name) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div style={{ 
                                width: '32px', height: '32px', borderRadius: '8px', background: 'var(--bg-main)', 
                                padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid var(--border)'
                            }}>
                              <img src={bank.logo} alt={bank.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                            </div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>{bank.name}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="divider" style={{ height: '1px', background: 'var(--border)', margin: '8px 0', opacity: 0.5 }} />

                    {coreMethods.map((method) => (
                      <div 
                        key={method.id}
                        onClick={() => {
                          setSelectedPayment(method.name);
                          setIsDropdownOpen(false);
                          setIsBankListOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '0.8rem 1rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          background: selectedPayment === method.name ? 'var(--primary-light)' : 'transparent',
                        }}
                        onMouseOver={(e) => {
                          if (selectedPayment !== method.name) e.currentTarget.style.background = 'var(--bg-card-hover)';
                        }}
                        onMouseOut={(e) => {
                          if (selectedPayment !== method.name) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '10px', background: 'var(--bg-main)', 
                          padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          border: '1px solid var(--border)'
                        }}>
                          <img 
                            src={method.logo} 
                            alt={method.name} 
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{method.name}</div>
                          {selectedPayment === method.name && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600, textTransform: 'uppercase' }}>Selected</div>
                          )}
                        </div>
                        {selectedPayment === method.name && (
                          <span style={{ color: 'var(--primary)', fontWeight: 800 }}>✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Manual Bank Entry Field */}
            {selectedPayment === 'Other Bank' && (
              <div 
                style={{ 
                  marginTop: '1.5rem',
                  animation: 'dropdownIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🏦</span> Financial Institution Name
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter your bank name..."
                  value={customBankName}
                  onChange={(e) => setCustomBankName(e.target.value)}
                  style={{
                    background: 'rgba(var(--primary-rgb), 0.03)',
                    border: '1px solid var(--primary)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  required
                />
              </div>
            )}
            
            <style jsx>{`
              @keyframes dropdownIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-title">🛡️ Finalization Path Preference</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              How would you like to professionally coordinate your final order confirmation?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem' }}>
              {[
                { 
                  id: 'whatsapp', 
                  name: 'WhatsApp', 
                  icon: (
                    <div style={{ backgroundColor: '#25D366', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.357-.178-2.115-1.042-2.443-1.161-.328-.119-.566-.178-.804.178-.238.357-.912 1.147-1.11 1.375-.198.227-.396.254-.754.076-.357-.179-1.512-.557-2.879-1.776-1.063-.949-1.779-2.122-1.988-2.479-.21-.357-.023-.55.155-.727.16-.16.357-.414.536-.62.178-.207.237-.357.357-.591.12-.234.06-.44-.03-.619-.089-.178-.804-1.936-1.101-2.653-.29-.696-.583-.601-.803-.612-.208-.01-.447-.012-.686-.012-.239 0-.628.09-.957.447-.33.357-1.258 1.229-1.258 2.997 0 1.769 1.288 3.477 1.467 3.715.178.238 2.535 3.871 6.141 5.43.858.371 1.527.592 2.05.758.861.274 1.644.235 2.261.143.689-.103 2.115-.864 2.413-1.696.298-.832.298-1.547.21-1.696-.089-.149-.356-.227-.714-.405zM12.003 20c-1.666 0-3.298-.448-4.722-1.297l-.338-.203-3.513.921 1.143-3.425-.221-.353c-.933-1.488-1.425-3.208-1.425-4.975 0-5.147 4.187-9.333 9.333-9.333 5.148 0 9.334 4.187 9.334 9.333-.001 5.147-4.186 9.332-9.335 9.332zm10.334-10.669c0-5.69-4.644-10.331-10.334-10.331s-10.333 4.641-10.333 10.331c0 1.82.474 3.593 1.374 5.163l-1.459 5.378 5.498-1.442c1.472.804 3.125 1.232 4.92 1.233h.001c5.69 0 10.333-4.641 10.333-10.332z"/>
                      </svg>
                    </div>
                  )
                },
                { 
                  id: 'imessage', 
                  name: 'iMessage', 
                  icon: (
                    <div style={{ backgroundColor: '#666666', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M12 2C6.477 2 2 5.582 2 10c0 1.954.872 3.743 2.348 5.127-.14 1.157-.736 2.505-1.579 3.428-.152.167-.091.442.126.51.785.247 1.986.342 2.97.051 1.706-.505 3.33-1.464 4.144-2.023.63.076 1.3.111 2 .111 5.523 0 10-3.582 10-8s-4.477-8-10-8z"/>
                      </svg>
                    </div>
                  )
                },
                { 
                  id: 'email', 
                  name: 'Email Only', 
                  icon: (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                    </svg>
                  )
                }
              ].map((path) => (
                <div 
                  key={path.id}
                  onClick={() => setConfirmationMethod(path.id as any)}
                  style={{
                    padding: '1rem',
                    borderRadius: '16px',
                    border: confirmationMethod === path.id ? '2px solid var(--primary)' : '1px solid var(--border)',
                    background: confirmationMethod === path.id ? 'var(--accent-light)' : 'var(--bg-main)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    boxShadow: confirmationMethod === path.id ? '0 8px 20px -5px rgba(var(--primary-rgb), 0.1)' : 'none'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{path.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: confirmationMethod === path.id ? 'var(--primary-dark)' : 'var(--text-primary)' }}>
                    {path.name}
                  </div>
                </div>
              ))}
            </div>
            
            {confirmationMethod === 'whatsapp' && (
              <div style={{ 
                marginTop: '1.5rem', 
                padding: '1.25rem', 
                background: 'rgba(var(--primary-rgb), 0.02)', 
                borderRadius: '18px',
                border: '1px dashed var(--border)',
                animation: 'dropdownIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🌍</span> Select your Syndicate Region
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setWhatsappRegion('us')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: whatsappRegion === 'us' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: whatsappRegion === 'us' ? 'var(--bg-card-hover)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                      boxShadow: whatsappRegion === 'us' ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🇺🇸</span> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsappRegion('uk')}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: whatsappRegion === 'uk' ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: whatsappRegion === 'uk' ? 'var(--bg-card-hover)' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                      boxShadow: whatsappRegion === 'uk' ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>🇬🇧</span> WhatsApp
                  </button>
                </div>
              </div>
            )}
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
              💡 All syndicate orders automatically trigger an email receipt, regardless of your selection.
            </p>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-title">🩺 Syndicate Processing</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Metrolean Market currently processes all orders through our digital syndicate portal.
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
          <div style={{ 
            background: 'var(--bg-main)', 
            border: '1px solid var(--primary)', 
            borderRadius: '12px', 
            padding: '0.8rem', 
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '1.2rem' }}>🇪🇺</span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600, margin: 0 }}>
              Now shipping locally from <strong>Dortmund, DE</strong> and <strong>Manchester, UK</strong> for faster regional delivery.
            </p>
          </div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight: 800 }}>Order Inventory</h2>
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
            <span>Syndicate Handling</span>
            <span style={{ color: 'var(--accent)', fontWeight: 700 }}>Complimentary</span>
          </div>
          <div className="summary-total" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', paddingTop: '1.5rem', marginTop: '0.5rem', borderTop: '2px dashed var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <span>Total Cost</span>
              <span>{formatPrice(totalPrice).usd}</span>
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {formatPrice(totalPrice).eur} | {formatPrice(totalPrice).gbp}
            </span>
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
            <strong>Direct Syndicate Processing:</strong> Upon clicking below, you will be professionally coordinated via <strong>{confirmationMethod === 'whatsapp' ? 'WhatsApp' : confirmationMethod === 'imessage' ? 'iMessage' : 'Email'}</strong> to finalize distribution. A formal order receipt and secondary payment link will also be dispatched to <strong>{formData.email || 'your email'}</strong> for your syndicate records.
          </div>

          <button 
            type="submit" 
            className="place-order-btn" 
            onClick={handlePlaceOrder}
            disabled={!formData.name || !formData.email || !formData.phone || !formData.address || !selectedPayment || (selectedPayment === 'Other Bank' && !customBankName)}
          >
            Confirm & Finalize Order
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '1.25rem' }}>
            By confirming, you certify that the provided information is accurate for syndicate distribution purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
