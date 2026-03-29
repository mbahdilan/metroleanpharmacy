'use client';

import { useState } from 'react';
import Modal from './Modal';

export default function ClientTestimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sharedCardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: '2rem',
    padding: '2.5rem',
    boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
    border: '1px solid var(--border)',
    flex: '1',
    minWidth: '300px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '220px'
  };

  const reviews = [
    { name: 'Dr. Sarah Johnson', role: 'Clinic Director', text: "Metrolean Pharmacy has been our primary supplier for 2 years. Their reliability is unmatched in the industry." },
    { name: 'Mark Stevens', role: 'Pharmacist', text: "The ordering process is seamless, and the delivery speed for specialty pharmaceuticals is impressive." },
    { name: 'Elena Rodriguez', role: 'Medical Resident', text: "Quality surgical supplies and a very responsive customer support team. Highly recommended." },
    { name: 'James Wilson', role: 'Private Practitioner', text: "The range of generic pharmaceuticals allows us to provide cost-effective care without compromising quality." }
  ];

  return (
    <>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Our Clients Card */}
        <div style={sharedCardStyle}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 700 }}>Our Clients</h3>
            <div style={{ display: 'flex', marginBottom: '1rem' }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: '48px', height: '48px', borderRadius: '50%', background: `var(--primary-light)`,
                  border: '3px solid white', marginLeft: i === 1 ? 0 : '-15px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)'
                }}>
                  {['SJ', 'MS', 'ER', 'JW'][i - 1]}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>12K+</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Happy clients</div>
            <button onClick={() => setIsModalOpen(true)} style={{ 
              background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: 0, cursor: 'pointer', fontSize: '0.95rem' 
            }}>
              View testimonial <span style={{ fontSize: '1.2rem' }}>›</span>
            </button>
          </div>
        </div>

        {/* Success Rate Card */}
        <div style={sharedCardStyle}>
          <div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontWeight: 700 }}>Service Success</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>84%</div>
              <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Healing Success</div>
            </div>
            <div style={{ width: '80px', height: '80px', position: 'relative' }}>
              <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary-light)" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--primary)" strokeWidth="3" strokeDasharray="84, 100" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="What Our Clients Say">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ paddingBottom: '2rem', borderBottom: i === reviews.length - 1 ? 'none' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)' }}>
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
