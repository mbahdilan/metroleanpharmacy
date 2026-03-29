import Link from 'next/link';
import { supabase, Product } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';
import ClientTestimonials from '@/components/ClientTestimonials';

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
            <p className="hero-eyebrow">MEDICAL SUPPLY SOLUTIONS</p>
            <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', marginBottom: '2rem', lineHeight: 1.1, letterSpacing: '-2px', fontWeight: 800 }}>
              Delivering Supplies, <br />
              <span style={{ color: 'var(--primary)' }}>Services & solutions</span> <br />
              for you and your patients.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '580px', lineHeight: 1.6 }}>
              We provide the medical-surgical supplies and pharmaceutical solutions healthcare providers need to deliver the best possible care.
            </p>
            <div className="hero-cta">
              <Link href="/shop" className="btn-primary" style={{ padding: '1.1rem 2.8rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 800, background: 'var(--primary)', boxShadow: '0 10px 25px rgba(0, 76, 151, 0.2)' }}>EXPLORE PRODUCTS</Link>
            </div>
            <div className="hero-trust-stat" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2.5rem' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>10,000+</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '150px', lineHeight: 1.2 }}>Healthcare providers trust us daily</span>
            </div>
          </div>
          <div className="hero-image-container" style={{ border: '1px solid var(--border)' }}>
             <img src="/images/hero-medical.jpg.jpg" alt="Medical Supply Solutions" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="section" id="categories" style={{ background: 'white', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="category-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <h2 className="category-section-title">Explore by category</h2>
              <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Quality supplies for every healthcare specialty.</p>
            </div>
            <Link href="/shop" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>VIEW ALL CATEGORIES</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {[
              { title: 'Relaxatives', desc: 'Psychedelics & Mood Enhancers for clinical relief.', link: '/shop?category=Relaxatives', img: '/images/illustrations/pharma.png', color: '#f5f3ff' },
              { title: 'Strains', desc: 'Medical-grade cannabis & hemp clinical products.', link: '/shop?category=Strains', img: '/images/illustrations/strains.png', color: '#ecfdf5' },
              { title: 'Syrups', desc: 'Tinctures, drops & liquid pharmaceutical medications.', link: '/shop?category=Syrups', img: '/images/illustrations/lab.png', color: '#e0f2fe' },
              { title: 'Others', desc: 'Vitamins, supplements & everyday healthcare essentials.', link: '/shop?category=Others', img: '/images/illustrations/equipment.png', color: '#ffedd5' },
            ].map(c => (
              <Link href={c.link} key={c.title} className="category-card">
                <div className="category-card-icon-box" style={{ backgroundColor: c.color }}>
                  <img src={c.img} alt={c.title} />
                </div>
                <h3 className="category-card-title">{c.title}</h3>
                <p className="category-card-description">{c.desc}</p>
                <div className="category-card-arrow">
                  <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews & Success Section */}
      <section style={{ background: 'var(--bg-main)', padding: '6rem 2rem' }}>
        <ClientTestimonials />
      </section>

      {/* Featured Products */}
      <section className="section" id="featured" style={{ paddingTop: '2rem' }}>
        <h2 className="section-title" style={{ fontSize: '2rem', marginBottom: '3rem', color: 'var(--primary-dark)' }}>Trending Products</h2>
        <div className="products-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {featuredProducts.length > 0 ? featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>No products available at the moment.</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/shop" className="btn-secondary" style={{ padding: '0.8rem 2.5rem', borderRadius: '50px', fontWeight: 600 }}>View All Products</Link>
        </div>
      </section>

      {/* Trust Badges section */}
      <section style={{
        background: 'var(--primary-dark)',
        color: 'white',
        padding: '6rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem 6rem' }}>
          {[
            { 
              title: 'Approved Pharmacy', 
              desc: 'Regulated & Trusted medical provider.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg> 
            },
            { 
              title: 'Secure Checkout', 
              desc: '100% Safe Payments with SSL encryption.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> 
            },
            { 
              title: 'Fast Delivery', 
              desc: 'Dispatched within 24h to your facility.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> 
            },
            { 
              title: 'Expert Advice', 
              desc: 'Consult our licensed pharmacy team anytime.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> 
            },
            { 
              title: 'Clinical Excellence', 
              desc: 'Strict quality control for all pharmaceuticals.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="M8.5 8.5l7 7"/></svg> 
            },
            { 
              title: 'Global Logistics', 
              desc: 'Trusted partner for international healthcare.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> 
            },
            { 
              title: 'Data Privacy', 
              desc: 'HIPAA compliant data protection standards.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><circle cx="12" cy="16" r="1"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg> 
            },
            { 
              title: 'Priority Support', 
              desc: 'Dedicated 24/7 assistance for providers.', 
              icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> 
            },
          ].map(b => (
             <div key={b.title} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
               <div style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.25rem' }}>{b.icon}</div>
               <div>
                 <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white', letterSpacing: '-0.3px' }}>{b.title}</h4>
                 <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', lineHeight: 1.5 }}>{b.desc}</p>
               </div>
             </div>
          ))}
        </div>
      </section>
    </>
  );
}
