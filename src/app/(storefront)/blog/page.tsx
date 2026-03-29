import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pharmacy Blog - Latest News & Tips',
  description: 'Read the latest health tips, pharmacy news, and medical advice from the +Pharmacy team.',
};

export default function BlogPage() {
  const articles = [
    { title: 'The Importance of Vitamin D in Winter', date: 'Oct 12, 2026', excerpt: 'Learn why supplementing Vitamin D is essential during the darker months...' },
    { title: 'Managing Seasonal Allergies', date: 'Sep 05, 2026', excerpt: 'Top tips from our pharmacists on keeping hayfever and springtime allergies at bay...' },
    { title: 'Understanding Your Prescription', date: 'Aug 22, 2026', excerpt: 'A guide to reading the labels and instructions on your daily medications...' },
  ];

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>The +Pharmacy Blog</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>News, tips, and insights from our experts.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {articles.map((article, idx) => (
          <article key={idx} style={{ padding: '2rem', background: 'white', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{article.date}</span>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', margin: '0.5rem 0' }}>{article.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{article.excerpt}</p>
            <Link href="#" style={{ color: 'var(--primary)', fontWeight: 700 }}>Read Full Article &rarr;</Link>
          </article>
        ))}
      </div>
    </div>
  );
}
