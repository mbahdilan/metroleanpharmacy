import React from 'react';
import { BUSINESS_PHONE_DISPLAY } from '@/lib/contact';

export default function PrivacyPolicy() {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '120px 2rem 5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '1rem', letterSpacing: '-2px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '4rem', fontWeight: 500 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>1. Introduction</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            At Metrolean-Pharma Health Tips, we are committed to protecting your privacy and the security of your personal data. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our website and shop.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>2. Information Collection</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We collect information necessary to process your orders, including:
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Contact details (Name, Email, Phone Number, Physical Address).</li>
            <li>Order history and product preferences.</li>
            <li>Payment method preferences (we do not store full credit card details on our local servers).</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>3. Use of Data</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Your data is used exclusively for:
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Confirming and fulfilling your order, including contacting you by phone, text, or WhatsApp.</li>
            <li>Sending order receipts and updates via email.</li>
            <li>Managing your account and providing customer support.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>4. Data Security</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We implement industry-standard security measures to protect your information. All data transmitted through our checkout process is encrypted using Secure Socket Layer (SSL) technology. Our internal systems follow strict data access protocols.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>5. Third-Party Disclosure</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We do not sell or trade your personal information. Data is only shared with trusted third-party service providers (like payment processors and logistics partners) who assist us in operating our website and business, so long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Contact Us</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            If you have any questions regarding this privacy policy, you may contact us at:
          </p>
          <p style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Email: office@metrolean.com<br />
            Phone / WhatsApp: {BUSINESS_PHONE_DISPLAY}
          </p>
        </section>
      </div>
    </div>
  );
}
