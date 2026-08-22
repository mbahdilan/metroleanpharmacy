import React from 'react';
import { BUSINESS_PHONE_DISPLAY } from '@/lib/contact';

export default function TermsOfService() {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', padding: '120px 2rem 5rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '1rem', letterSpacing: '-2px' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '4rem', fontWeight: 500 }}>
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>1. Acceptance of Terms</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            By accessing and using the services provided by Metrolean-Pharma Health Tips, you agree to be bound by these Terms of Service. Our platform facilitates the purchase of over-the-counter pharmacy products. If you do not agree with any part of these terms, you must refrain from using our services.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>2. Products &amp; Orders</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Metrolean-Pharma Health Tips sells over-the-counter (non-prescription) pharmacy products. You acknowledge that:
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>All product descriptions are for informational purposes and may be subject to availability.</li>
            <li>Our health guides are educational content and are not a substitute for professional medical advice.</li>
            <li>You are responsible for reading product labels and consulting a healthcare provider with any questions before use.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>3. Payment &amp; Order Processing</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Upon placing an order, you will receive a confirmation email. Our team will then contact you by phone, text, or WhatsApp to confirm payment and delivery details.
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--text-secondary)', paddingLeft: '1.5rem', marginBottom: '1rem' }}>
            <li>Orders are only fulfilled once payment has been confirmed.</li>
            <li>Metrolean-Pharma Health Tips reserves the right to cancel any order it cannot fulfill or verify.</li>
          </ul>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>4. Shipping &amp; Handling</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            We prioritize the safe and timely delivery of your order. Shipping timelines provided during checkout are estimates. Metrolean-Pharma Health Tips is not liable for delays caused by third-party logistics providers.
          </p>
        </section>

        <section style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>5. Limitation of Liability</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            To the maximum extent permitted by law, Metrolean-Pharma Health Tips and its officers shall not be held liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our services or products.
          </p>
        </section>

        <section style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>6. Contact Information</h2>
          <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Questions regarding these Terms of Service should be directed to:
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
