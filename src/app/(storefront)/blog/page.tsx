import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Syndicate Blog - Latest News & Tips',
  description: 'Read the latest syndicate tips, market news, and premium advice from the Metrolean Market team.',
};

export default function BlogPage() {
  const articles = [
    { title: 'The Importance of Premium Stash in Winter', date: 'Oct 12, 2026', excerpt: 'Learn why supplementing your stash is essential during the darker months...' },
    { title: 'Managing Supply Chains', date: 'Sep 05, 2026', excerpt: 'Top tips from our brokers on keeping your inventory moving without delay...' },
    { title: 'Understanding Your Drops', date: 'Aug 22, 2026', excerpt: 'A guide to reading the labels and instructions on your premium drops...' },
  ];

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', marginBottom: '1rem' }}>The Metrolean Market Blog</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>News, tips, and insights from our brokers.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {articles.map((article, idx) => (
          <article key={idx} style={{ padding: '2rem', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{article.date}</span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{article.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{article.excerpt}</p>
            <Link href="#" style={{ color: 'var(--accent)', fontWeight: 700 }}>Read Full Article &rarr;</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
