import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div style={{ background: '#fdfdfe', minHeight: '100vh', padding: '120px 2rem 5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '1rem', letterSpacing: '-2px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '4rem', fontWeight: 500 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>1. Introduction</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            At Metrolean Pharmacy, we are committed to protecting your privacy and ensuring the security of your clinical and personal data. This Privacy Policy outlines how we collect, use, and safeguard the information you provide when using our medical distribution services.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>2. Information Collection</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We collect information necessary to process your clinical orders, including:
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Contact details (Name, Email, Phone Number, Physical Address).</li>
            <li>Clinical preferences and order history.</li>
            <li>Payment method preferences (we do not store full credit card details on our local servers).</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>3. Use of Data</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Your data is used exclusively for:
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Finalizing distribution details via WhatsApp clinical desk.</li>
            <li>Sending formal order receipts and payment instructions via email.</li>
            <li>Managing your account and providing customer support.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>4. Data Security</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We implement industry-standard security measures to protect your clinical information. All data transmitted through our checkout process is encrypted using Secure Socket Layer (SSL) technology. Our internal systems follow strict data access protocols.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>5. Third-Party Disclosure</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We do not sell or trade your personal information. Data is only shared with trusted third-party service providers (like payment processors and logistics partners) who assist us in operating our website and conducting our clinical business, so long as those parties agree to keep this information confidential.
          </p>
        </section>

        <section style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Contact Us</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            If you have any questions regarding this privacy policy, you may contact our clinical desk at:
          </p>
          <p style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Email: broomuhams@gmail.com<br />
            WhatsApp: +1 (801) 374-0460
          </p>
        </section>
      </div>
    </div>
  );
}
