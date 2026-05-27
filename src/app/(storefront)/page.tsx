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
            <p className="hero-eyebrow" style={{ background: 'var(--accent-light)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>THE UNDERGROUND COLLECTION</p>
            <h1 style={{ color: 'var(--accent)', fontSize: 'clamp(2.8rem, 6vw, 5rem)', marginBottom: '1.5rem', lineHeight: 1.05, letterSpacing: '-1px' }}>
              Elevate your state <br />
              of <span style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>consciousness.</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '3rem', maxWidth: '500px', lineHeight: 1.6 }}>
              A curated selection of premium, legally approved cannabis, artisan syrups, and profound psychedelics. Sourced for the discerning mind.
            </p>
            <div className="hero-cta" style={{ justifyContent: 'flex-start' }}>
              <Link href="/shop" className="btn-primary">EXPLORE THE STASH</Link>
            </div>
          </div>
          <div className="hero-image-container" style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Link href="/">
               <img src="/images/logo_for_homepage-removebg-preview.png" alt="The Metrolean Logo" style={{ width: '90%', height: '90%', objectFit: 'contain', cursor: 'pointer' }} />
             </Link>
          </div>
        </div>
      </section>

      {/* Split Section 1 */}
      <section className="split-section section-radiant">
        <div className="split-grid">
          <div>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              Curated <span style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Cannabis</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '450px' }}>
              From deep indicas to uplifting sativas, our strains are organically grown, meticulously harvested, and rigorously tested to ensure the highest quality experience.
            </p>
            <Link href="/shop?category=strains" className="btn-secondary">Shop Strains</Link>
          </div>
          <div style={{ background: 'var(--bg-card)', borderRadius: '1rem', padding: '1rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/images/cannabis-buds.jpg" alt="Curated Cannabis Buds" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', boxShadow: 'var(--shadow-lg)', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* Split Section 2 */}
      <section className="split-section" style={{ background: 'var(--bg-card)' }}>
        <div className="split-grid">
          <div style={{ background: '#000', borderRadius: '1rem', padding: '1rem', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <img src="/images/psychedelic-mushrooms.png" alt="Profound Psychedelic Mushrooms" style={{ width: '100%', height: 'auto', borderRadius: '0.5rem', boxShadow: 'var(--shadow-lg)', objectFit: 'contain' }} />
          </div>
          <div>
            <p style={{ textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>The Journey Inward</p>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              Profound <span style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Psychedelics</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '450px' }}>
              Safe, tested, and legally approved. Explore our selection of mind-expanding compounds designed for deep introspection and therapeutic exploration.
            </p>
            <Link href="/shop?category=relaxatives" className="btn-secondary">Explore Psychedelics</Link>
          </div>
        </div>
      </section>

      {/* Full Width Banner */}
      <section style={{ 
        padding: '10rem 2rem', 
        textAlign: 'center', 
        background: 'var(--bg-main)',

        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '4rem', color: 'var(--accent)', marginBottom: '1.5rem', fontStyle: 'italic' }}>
            Liquid Gold
          </h2>
          <p style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '3rem', lineHeight: 1.6 }}>
            Our artisan syrups and tinctures offer a discreet, precise, and delicious way to consume. Crafted in small batches for the perfect vibe.
          </p>
          <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
            <img 
              src="/images/pic to use.png" 
              alt="Liquid Gold Collection" 
              style={{ 
                maxWidth: '600px', 
                width: '100%', 
                borderRadius: '1rem', 
                boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)'
              }} 
            />
          </div>
          <Link href="/shop?category=syrups" className="btn-primary">Discover Syrups</Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-radiant" id="featured" style={{ paddingTop: '8rem', paddingBottom: '8rem' }}>
        <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem', color: 'var(--accent)' }}>
          The <span style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>Reserve</span>
        </h2>
        <div className="products-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {featuredProducts.length > 0 ? featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          )) : (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)' }}>The stash is currently hidden.</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '5rem' }}>
          <Link href="/shop" className="btn-secondary">View Entire Collection</Link>
        </div>
      </section>
    </>
  );
}

