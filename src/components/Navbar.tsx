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
    <header className={`navbar-container ${isHidden ? 'navbar-hidden' : ''}`}>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <img src="/images/logo-mck.png.jpeg" alt="Metrolean Pharmacy Logo" className="navbar-logo" />
            <div className="navbar-title-container">
              <span className="navbar-title">Metrolean Pharmacy</span>
            </div>
          </Link>

          <div className="navbar-links">
            <Link href="/">Home</Link>
            <Link href="/shop">Shop All</Link>
            <Link href="/health-advice">Insights</Link>
            <Link href="/about">About Us</Link>
          </div>

          <div className="navbar-actions">
            <div className="gtranslate_wrapper"></div>
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
            <Link href="/health-advice" onClick={() => setMobileOpen(false)}>Insights</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About Us</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
