import Link from 'next/link';
import Script from 'next/script';
import { CartProvider } from '@/context/CartContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import Navbar from '@/components/Navbar';
import CartSidebar from '@/components/CartSidebar';

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CurrencyProvider>
    <CartProvider>
      <Navbar />
      <CartSidebar />
      <main>{children}</main>
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-main)', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'left' }}>
          <div>
            <Link href="/">
              <img src="/images/logo-mck.png.jpeg" alt="Metrolean-Pharma Health Tips" style={{ maxHeight: '80px', marginBottom: '1.5rem', display: 'block', border: 'none', outline: 'none' }} />
            </Link>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Evidence-based medication guides and a trusted shop for everyday over-the-counter pharmacy essentials.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent)' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/shop?category=cold-flu" className="footer-link">Cold & Flu</Link>
              <Link href="/shop?category=pain-relief" className="footer-link">Pain Relief</Link>
              <Link href="/shop?category=allergy-hayfever" className="footer-link">Allergy & Hayfever</Link>
              <Link href="/shop?category=vitamins-supplements" className="footer-link">Vitamins & Supplements</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent)' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/blog" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Health Guides</Link>
              <Link href="/about" className="footer-link" style={{ color: 'var(--text-secondary)' }}>About Us</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase', color: 'var(--accent)' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/privacy" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link>
              <Link href="/terms" className="footer-link" style={{ color: 'var(--text-secondary)' }}>Terms of Service</Link>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Metrolean-Pharma Health Tips</span>
            </div>
          </div>
        </div>
      </footer>
    </CartProvider>
    </CurrencyProvider>
  );
}
