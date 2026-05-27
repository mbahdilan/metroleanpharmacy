'use client';

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
      <div className="modal-overlay" onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.7)', zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
        backdropFilter: 'blur(12px)', animation: 'fadeIn 0.3s ease'
      }}>
        <div className="modal-content" onClick={e => e.stopPropagation()} style={{
          background: 'var(--bg-card)', borderRadius: '24px', width: '100%', maxWidth: '600px',
          maxHeight: '80vh', overflowY: 'auto', position: 'relative', padding: '3rem',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)', animation: 'slideUp 0.4s ease'
        }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--bg-main)',
          border: 'none', width: '36px', height: '36px', borderRadius: '10px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          color: 'var(--text-secondary)', fontSize: '1.2rem'
        }}>✕</button>
        <h2 style={{ marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '1.8rem' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
