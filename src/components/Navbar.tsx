'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { totalItems, setCartOpen } = useCart() as any;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Smart Hide Logic
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

  const isActive = (path: string) => pathname === path;

  return (
    <header className={`navbar-container ${isHidden ? 'navbar-hidden' : ''}`}>
      {/* 1. Desktop Navbar (Hidden on Mobile) */}
      <div className="navbar-brand-bar desktop-only">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <img src="/images/logo-mck.png.jpeg" alt="Metrolean Pharmacy Logo" className="navbar-logo" />
            <div className="navbar-title-container">
              <span className="navbar-title">Metrolean Pharmacy</span>
            </div>
          </Link>

          <div className="navbar-links">
            <Link href="/" className={isActive('/') ? 'active' : ''}>Home</Link>
            <Link href="/shop" className={isActive('/shop') ? 'active' : ''}>Shop All</Link>
            <Link href="/health-advice" className={isActive('/health-advice') ? 'active' : ''}>Insights</Link>
            <Link href="/about" className={isActive('/about') ? 'active' : ''}>About Us</Link>
          </div>

          <div className="navbar-actions">
            <div className="gtranslate_wrapper"></div>
            <button className="cart-btn" onClick={() => (setCartOpen as any)(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="cart-text">Go to Cart</span>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Blended Mobile Pill (Mobile Only) */}
      <div className="mobile-blended-pill mobile-only">
        {/* Brand Logo Icon */}
        <Link href="/" className="pill-logo-link">
          <img src="/images/logo-mck.png.jpeg" alt="MCK Logo" className="pill-logo-img" />
        </Link>

        {/* Divider */}
        <div className="pill-divider" />

        {/* Navigation Group (Grouped Left) */}
        <div className="pill-nav-group">
          <Link href="/" className={`pill-icon ${isActive('/') ? 'active' : ''}`} aria-label="Home">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </Link>
          
          <Link href="/shop" className={`pill-icon ${isActive('/shop') ? 'active' : ''}`} aria-label="Shop">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="12" x="2" y="7" rx="2" ry="2" />
              <path d="M7 21v-4" />
              <path d="M17 21v-4" />
              <path d="M12 21v-4" />
            </svg>
          </Link>

          <button className="pill-icon cart-pill-btn" onClick={() => (setCartOpen as any)(true)} aria-label="Cart">
            <div className="cart-badge-wrapper">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {totalItems > 0 && <span className="pill-cart-badge">{totalItems}</span>}
            </div>
          </button>

          <button className={`pill-icon ${mobileOpen ? 'active' : ''}`} onClick={() => setMobileOpen(!mobileOpen)} aria-label="More">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>

          {/* Translator in Pill */}
          <div className="pill-translator-wrapper">
            <div className="gtranslate_wrapper"></div>
          </div>
        </div>
      </div>

      {/* 3. More Menu Drawer */}
      {mobileOpen && (
        <div className="mobile-more-drawer">
          <div className="drawer-overlay" onClick={() => setMobileOpen(false)} />
          <div className="drawer-content">
            <div className="drawer-header">
              <h3>More Resources</h3>
              <button className="close-drawer" onClick={() => setMobileOpen(false)}>✕</button>
            </div>
            <div className="drawer-links">
              <Link href="/health-advice" onClick={() => setMobileOpen(false)}>Insights & Advice</Link>
              <Link href="/about" onClick={() => setMobileOpen(false)}>About Us</Link>
              <hr />
              <a href="https://wa.me/something" target="_blank" rel="noopener noreferrer" className="wa-link">💬 WhatsApp Support</a>
              <a href="#contact" className="contact-link">Contact Live Support</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
