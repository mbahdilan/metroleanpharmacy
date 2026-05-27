'use client';

import { useState } from 'react';
import Modal from './Modal';

export default function ClientTestimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sharedCardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    borderRadius: '2rem',
    padding: '2.5rem',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border)',
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px'
  };

  const reviews = [
    { name: 'Ghost', role: 'Syndicate Connect', text: "Metrolean Market has been our primary source for 2 years. Their reliability and stealth shipping are unmatched." },
    { name: 'Marcus T.', role: 'Connoisseur', text: "The ordering process is seamless, and the quality of the premium syrups is absolutely top-tier." },
    { name: 'Elena R.', role: 'Local Distributor', text: "Quality exotic strains and a very discreet customer support team. Highly recommended for bulk stash." },
    { name: 'J. Wilson', role: 'Nightlife Provider', text: "The range of relaxatives allows us to provide exclusive experiences without compromising on potency." }
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Our Clients Card */}
        <div style={sharedCardStyle}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 700 }}>Our Network</h3>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: `var(--bg-card-hover)`,
                  border: '3px solid var(--bg-card)', marginLeft: i === 1 ? 0 : '-15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)'
                }}>
                  {['GH', 'MT', 'ER', 'JW'][i - 1]}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>12K+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Verified Connects</div>
            <button onClick={() => setIsModalOpen(true)} style={{ 
              background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, cursor: 'pointer', fontSize: '0.95rem' 
            }}>
              View intel <span style={{ fontSize: '1.2rem' }}>›</span>
            </button>
          </div>
        </div>

        {/* Success Rate Card */}
        <div style={sharedCardStyle}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 700 }}>Drop Success</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>99%</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Stealth Delivery</div>
            </div>
            <div style={{ width: '80px', height: '80px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--border)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="99, 100" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Underground Feedback">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ paddingBottom: '2rem', borderBottom: i === reviews.length - 1 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-card-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)' }}>
                  {r.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{r.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{r.role}</div>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
