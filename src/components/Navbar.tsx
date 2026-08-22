'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import LanguagePicker from '@/components/LanguagePicker';

export default function Navbar() {
  const { totalItems, setCartOpen } = useCart() as any;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !mobileOpen) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileOpen]);

  return (
    <header
      className="navbar-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: isHidden ? 0 : 1,
        transform: isHidden ? 'translateY(-100%)' : 'translateY(0)',
        pointerEvents: isHidden ? 'none' : 'auto',
      }}
    >
      <nav className="navbar" style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', borderBottom: 'none' }}>
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand" style={{ border: 'none', outline: 'none' }}>
            <img src="/images/logo-mck.png.jpeg" alt="Metrolean-Pharma Health Tips" className="navbar-logo" style={{ maxHeight: '60px', width: 'auto', border: 'none', outline: 'none' }} />
          </Link>

          <div className="navbar-links">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop</Link>
            <Link href="/blog">Health Guides</Link>
            <Link href="/about">About Us</Link>
          </div>

          <div className="navbar-actions">
            <LanguagePicker />
            <button className="cart-btn" onClick={() => (setCartOpen as any)(true)} id="open-cart-btn">
              <svg className="cart-icon-svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="cart-text">Go to Cart</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            <button className="hamburger-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="mobile-menu">
            <Link href="/" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
            <Link href="/blog" onClick={() => setMobileOpen(false)}>Health Guides</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About Us</Link>
          </div>
        )}
      </nav>
      

    </header>
  );
}
