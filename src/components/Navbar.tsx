'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { totalItems, setCartOpen } = useCart() as any;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !mobileOpen) {
        // Scrolling down and not at the top and mobile menu is closed
        setIsHidden(true);
      } else {
        // Scrolling up or near top or mobile menu is open
        setIsHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-container ${isHidden ? 'navbar-hidden' : ''}`} style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'white', borderBottom: '1px solid var(--border)', transition: 'all 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <nav className="navbar" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/logo-mck.png.jpeg" alt="Metrolean Pharmacy Logo" className="navbar-logo" style={{ height: '32px', marginRight: '10px', transition: 'height 0.3s ease' }} />
          <div className="navbar-title-container" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="navbar-title" style={{ color: 'var(--primary)', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.5px' }}>Metrolean Pharmacy</span>
          </div>
        </Link>

        <div className="navbar-links" style={{ display: 'flex', gap: '2.5rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Home</Link>
          <Link href="/shop" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Shop All</Link>
          <Link href="/health-advice" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Insights</Link>
          <Link href="/about" style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>About Us</Link>
        </div>

        <div className="navbar-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div className="gtranslate_wrapper"></div>
          <button className="cart-btn" onClick={() => (setCartOpen as any)(true)} id="open-cart-btn" style={{ background: 'var(--primary)', color: 'white', borderRadius: '8px', border: 'none', padding: '0.75rem 1.5rem', fontWeight: 700, fontSize: '0.9rem', display: 'flex', gap: '0.5rem', alignItems: 'center', transition: 'all 0.2s', position: 'relative' }}>
            <svg className="cart-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-text">Go to Cart</span>
            {totalItems > 0 && <span className="cart-badge" style={{ background: 'white', color: 'var(--primary)', padding: '0 6px', borderRadius: '10px' }}>{totalItems}</span>}
          </button>

          <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem' }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileOpen && (
          <div className="mobile-menu" style={{ top: '80px' }}>
            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/health-advice" onClick={() => setMobileOpen(false)}>Insights</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About Us</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
