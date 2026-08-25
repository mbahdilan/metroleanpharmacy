import { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Browse by Topic - Metrolean-Pharma Health Tips',
  description: 'Browse our health guides by topic — cold & flu, pain relief, allergies, vitamins, and more.',
  alternates: { canonical: '/guides' },
  openGraph: {
    title: 'Browse by Topic - Metrolean-Pharma Health Tips',
    description: 'Browse our health guides by topic — cold & flu, pain relief, allergies, vitamins, and more.',
    url: '/guides',
    type: 'website',
  },
};

export default function GuidesPage() {
  const categories = Array.from(new Set(ARTICLES.map((a) => a.category)));

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}>Browse by Topic</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
          Evidence-based health guides, organized by the questions you actually have.
        </p>
      </header>

      <section style={{ marginBottom: '5rem' }}>
        {categories.map((category) => (
          <div key={category} style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>{category}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {ARTICLES.filter((a) => a.category === category).map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  style={{ display: 'block', padding: '1.5rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', textDecoration: 'none', transition: 'all 0.2s ease' }}
                >
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontWeight: 700 }}>{article.title}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{article.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section-radiant" style={{ padding: '4rem', borderRadius: '24px', textAlign: 'center', border: '1px solid var(--border)' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--accent)', marginBottom: '1rem' }}>Looking for a product instead?</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>Shop everyday OTC essentials backed by the guides above.</p>
        <Link href="/shop" className="btn-primary">Shop Now</Link>
      </section>
    </div>
  );
}
