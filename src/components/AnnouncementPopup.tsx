'use client';

import { useState, useEffect } from 'react';

export default function AnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('hasSeenHubPopup');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Show after 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenHubPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      backdropFilter: 'blur(5px)',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-main)',
        color: 'var(--text-main)',
        padding: '2.5rem',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '100%',
        position: 'relative',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        border: '1px solid var(--accent)',
        textAlign: 'center',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        <button 
          onClick={closePopup}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '1.5rem',
            cursor: 'pointer',
            padding: '5px',
            lineHeight: '1',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          ✕
        </button>
        
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌍</div>
        
        <h2 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 800, 
          marginBottom: '1rem',
          color: 'var(--accent)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}>
          Global Hubs Now Active
        </h2>
        
        <p style={{ 
          fontSize: '1rem', 
          lineHeight: '1.6', 
          marginBottom: '1.5rem',
          color: 'var(--text-secondary)'
        }}>
          We are excited to announce that we now have operational hubs in <strong>Germany</strong>, the <strong>USA</strong>, and <strong>England</strong>. 
        </p>
        
        <p style={{ 
          fontSize: '1rem', 
          lineHeight: '1.6', 
          marginBottom: '2rem',
          color: 'var(--text-secondary)'
        }}>
          No matter which region you are from, we are here to serve you and make things easier for you with faster, more discreet delivery.
        </p>

        <button 
          onClick={closePopup}
          style={{
            background: 'var(--accent)',
            color: 'var(--bg-main)',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '8px',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '1rem',
            width: '100%',
            transition: 'transform 0.2s, background 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.02)';
            e.currentTarget.style.filter = 'brightness(1.1)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.filter = 'none';
          }}
        >
          GOT IT, THANKS!
        </button>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
