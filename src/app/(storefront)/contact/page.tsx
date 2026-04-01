import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Metrolean Pharmacy',
  description: 'Get in touch with Metrolean Pharmacy for medical supplies, pharmaceutical solutions, and expert advice.',
};

export default function ContactPage() {
  return (
    <div className="contact-page" style={{ paddingBottom: '5rem' }}>
      {/* Hero Section */}
      <section style={{ 
        height: '40vh', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflow: 'hidden', 
        background: 'var(--primary-dark)' 
      }}>
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white', padding: '0 1rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Contact Us</h1>
          <p style={{ fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto', fontWeight: 500, opacity: 0.9 }}>
            Dedicated 24/7 assistance for healthcare providers and patients worldwide.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1200px', margin: '-5rem auto 5rem', padding: '0 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          {/* Contact Form */}
          <div style={{ 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '24px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid var(--border)'
          }}>
            <h2 style={{ fontSize: '1.75rem', color: 'var(--primary-dark)', marginBottom: '2rem' }}>Send us a Message</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>First Name</label>
                  <input type="text" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)' }} placeholder="John" />
                </div>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Last Name</label>
                  <input type="text" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)' }} placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Email Address</label>
                <input type="email" className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)' }} placeholder="john@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Subject</label>
                <select className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                  <option>Medical Inquiry</option>
                  <option>Order Support</option>
                  <option>Product Information</option>
                  <option>General Feedback</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>Message</label>
                <textarea className="form-input" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-main)', minHeight: '150px' }} placeholder="How can we help you?"></textarea>
              </div>
              <button className="btn-primary" style={{ border: 'none', cursor: 'pointer', textAlign: 'center' }}>SEND MESSAGE</button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1.5rem', fontWeight: 800 }}>Global Headquarters</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📍</span>
                <p style={{ color: 'var(--text-secondary)' }}>
                  700 Universe Blvd<br />
                  Juno Beach, FL 33408<br />
                  United States
                </p>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>📞</span>
                <p style={{ color: 'var(--text-secondary)' }}>+1 (555) 012-3456</p>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontSize: '1.5rem' }}>✉️</span>
                <p style={{ color: 'var(--text-secondary)' }}>office@metrolean.com</p>
              </div>
            </div>

            <div style={{ background: 'var(--primary-light)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--primary-light)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-dark)', marginBottom: '1rem', fontWeight: 800 }}>Emergency Support</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                For urgent medical supply needs outside of business hours, please use our priority helpline.
              </p>
              <p style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>+1 (555) 999-0000</p>
            </div>

            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '1rem', fontWeight: 800 }}>Business Hours</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monday - Friday:</span>
                <span style={{ fontWeight: 700 }}>8:00 AM - 6:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Saturday:</span>
                <span style={{ fontWeight: 700 }}>9:00 AM - 2:00 PM</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sunday:</span>
                <span style={{ fontWeight: 700 }}>Closed</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
