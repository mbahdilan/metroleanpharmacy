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
      <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'white', padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', textAlign: 'left' }}>
          <div>
            <p className="footer-brand" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '1rem' }}>
              Metrolean Pharmacy
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Delivering medical-surgical supplies and pharmaceutical solutions to healthcare providers worldwide.
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Shop</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/shop?category=relaxatives" className="footer-link">Relaxatives</Link>
              <Link href="/shop?category=strains" className="footer-link">Strains</Link>
              <Link href="/shop?category=syrups" className="footer-link">Syrups</Link>
              <Link href="/shop?category=others" className="footer-link">Others</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Support</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/contact" className="footer-link">Contact Us</Link>
              <Link href="/about" className="footer-link">About Metrolean Pharmacy</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1.5rem', textTransform: 'uppercase' }}>Compliance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
              <Link href="/terms" className="footer-link">Terms of Service</Link>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>© {new Date().getFullYear()} Metrolean Pharmacy Solutions</span>
            </div>
          </div>
        </div>
      </footer>
    </CartProvider>
  );
}
