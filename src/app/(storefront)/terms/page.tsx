import React from 'react';

export default function TermsOfService() {
  return (
    <div style={{ background: '#fdfdfe', minHeight: '100vh', padding: '120px 2rem 5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--primary-dark)', marginBottom: '1rem', letterSpacing: '-2px' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '4rem', fontWeight: 500 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            By accessing and using the services provided by Metrolean Pharmacy, you agree to be bound by these Terms of Service. Our platform facilitates the procurement and distribution of clinical medical supplies. If you do not agree with any part of these terms, you must refrain from using our services.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>2. Clinical Distribution & Procurement</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Metrolean Pharmacy operates as a clinical inventory distributor. You acknowledge that:
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Orders are finalized and confirmed via our WhatsApp clinical desk.</li>
            <li>All product descriptions are for clinical informational purposes and may be subject to supply availability.</li>
            <li>You are responsible for ensuring your procurement follows local healthcare regulations.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>3. Payment & Order Processing</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Upon placing an order, you will receive a confirmation email and be redirected to our WhatsApp desk. 
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Official payment links (Zelle, Crypto, etc.) are provided via the admin email (broomuhams@gmail.com) following clinical verification.</li>
            <li>Orders are only processed once payment has been cleared by our financial department.</li>
            <li>Metrolean Pharmacy reserved the right to cancel any order that fails clinical verification.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>4. Shipping & Handling</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We prioritize the safe and timely delivery of medical inventory. Shipping timelines provided during the checkout process are estimates. Metrolean Pharmacy is not liable for delays caused by third-party logistics or regulatory customs inspections.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>5. Limitation of Liability</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            To the maximum extent permitted by law, Metrolean Pharmacy and its officers shall not be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our distribution services or products.
          </p>
        </section>

        <section style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>6. Contact Information</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Questions regarding these Terms of Service should be directed to:
          </p>
          <p style={{ fontWeight: 700, color: 'var(--primary)' }}>
            Email: broomuhams@gmail.com<br />
            WhatsApp: +237670666946
          </p>
        </section>
      </div>
    </div>
  );
}
