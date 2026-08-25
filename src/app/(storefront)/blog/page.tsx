import { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

export const metadata: Metadata = {
  title: 'Health Guides - Metrolean-Pharma Health Tips',
  description: 'Evidence-based, plain-English guides on medications, OTC vs. prescription, and everyday health questions.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Health Guides - Metrolean-Pharma Health Tips',
    description: 'Evidence-based, plain-English guides on medications, OTC vs. prescription, and everyday health questions.',
    url: '/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  const articles = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}>Health Guides</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Evidence-based, plain-English answers to common medication and health questions.
        </p>
        <Link href="/guides" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>Browse by topic &rarr;</Link>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {articles.map((article) => (
          <article key={article.slug} style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{article.category}</span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{article.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{article.excerpt}</p>
            <Link href={`/blog/${article.slug}`} style={{ color: 'var(--accent)', fontWeight: 700 }}>Read Full Article &rarr;</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
