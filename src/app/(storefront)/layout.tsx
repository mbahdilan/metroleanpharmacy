import Link from 'next/link';
import Script from 'next/script';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      <CartSidebar />
      <main>{children}</main>
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-main)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'left' }}>
          <div>
            <Link href="/">
              <img src="/images/logo_for_homepage-removebg-preview.png" alt="The Metrolean Logo" style={{ maxHeight: '80px', marginBottom: '1.5rem', display: 'block', border: 'none', outline: 'none' }} />
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Providing premium, legally approved cannabis, syrups, and psychedelics to discerning individuals worldwide. Now with local hubs in <strong>Germany</strong>, the <strong>USA</strong>, and <strong>England</strong> to serve you better.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent)' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/shop?category=relaxatives" className="footer-link">Relaxatives</Link>
              <Link href="/shop?category=strains" className="footer-link">Strains</Link>
              <Link href="/shop?category=syrups" className="footer-link">Syrups</Link>
              <Link href="/shop?category=others" className="footer-link">Others</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent)' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/about" className="footer-link" style={{ color: 'var(--text-secondary)' }}>About Metrolean Market</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent)' }}>Compliance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/privacy" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
              <Link href="/terms" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Metrolean Market</span>
            </div>
          </div>
        </div>
      </footer>
    </CartProvider>
  );
}
