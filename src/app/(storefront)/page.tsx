import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

async function getFeaturedProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .eq('is_active', true)
    .limit(4);
  return data || [];
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="hero-grid">
          <div className="hero-info">
            <p className="hero-eyebrow" style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>EVIDENCE-BASED HEALTH GUIDES</p>
            <h1 style={{ color: 'var(--accent)', fontSize: 'clamp(2.8rem, 6vw, 5rem)', marginBottom: '1.5rem', lineHeight: 1.05, letterSpacing: '-1px' }}>
              Trusted health tips, <br />
              <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>every day essentials.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '3rem', maxWidth: '500px', lineHeight: 1.6 }}>
              Clear, evidence-based medication guides plus a trusted shop for the over-the-counter essentials your family reaches for most.
            </p>
            <div className="hero-cta" style={{ justifyContent: 'flex-start' }}>
              <Link href="/shop" className="btn-primary">SHOP NOW</Link>
            </div>
          </div>
          <div className="hero-image-container">
            <img src="/images/hero-medical.jpg.jpg" alt="Pharmacist assisting a customer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Split Section 1 */}
      <section className="split-section section-radiant">
        <div className="split-grid">
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              Cold &amp; Flu <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Relief</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '450px' }}>
              From decongestants to sore-throat relief, shop trusted over-the-counter remedies to help you feel like yourself again.
            </p>
            <Link href="/shop?category=cold-flu" className="btn-secondary">Shop Cold & Flu</Link>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: '1rem', padding: '1rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/images/categories/cold-flu.png" alt="Cold and flu relief products" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', boxShadow: 'var(--shadow-lg)', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Split Section 2 */}
      <section className="split-section" style={{ background: 'var(--bg-card)' }}>
        <div className="split-grid">
          <div style={{ background: 'var(--bg-main)', borderRadius: '1rem', padding: '1rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/images/categories/vitamins & immunity.jpeg" alt="Vitamins and supplements" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', boxShadow: 'var(--shadow-lg)', objectFit: 'cover' }} />
          </div>
          <div>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>Daily Wellness</p>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              Vitamins &amp; <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Supplements</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '450px' }}>
              Support your immune system and everyday wellness with our range of vitamins and supplements, backed by clear, honest labeling.
            </p>
            <Link href="/shop?category=vitamins-supplements" className="btn-secondary">Shop Vitamins</Link>
          </div>
        </div>
      </section>

      {/* Full Width Banner */}
      <section style={{
        padding: '8rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-main)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1.5rem' }}>
            Not sure what you need?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '3rem', lineHeight: 1.6 }}>
            Our health guides break down common medication questions in plain English — from OTC vs. prescription to how to read a drug facts label.
          </p>
          <Link href="/blog" className="btn-primary">Browse Health Guides</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-radiant" id="featured" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', color: 'var(--accent)' }}>
          Featured <span style={{ color: 'var(--primary)', fontStyle: 'italic' }}>Products</span>
        </h2>
        <div className="products-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {featuredProducts.length > 0 ? featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>New products coming soon.</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Link href="/shop" className="btn-secondary">View All Products</Link>
        </div>
      </section>
    </>
  );
}

