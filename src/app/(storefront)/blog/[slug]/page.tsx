import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticleBySlug } from '@/lib/articles';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found - Metrolean-Pharma Health Tips' };
  return {
    title: `${article.title} - Metrolean-Pharma Health Tips`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  return (
    <div style={{ padding: '8rem 2rem 5rem', maxWidth: '760px', margin: '0 auto', minHeight: '80vh' }}>
      <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>&larr; Back to Health Guides</Link>

      <header style={{ margin: '2rem 0 3rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{article.category}</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--accent)', margin: '0.75rem 0 1rem', lineHeight: 1.15 }}>{article.title}</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {article.body.map((paragraph, i) => (
          <p key={i} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{paragraph}</p>
        ))}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        This article is for general education and isn&apos;t a substitute for professional medical advice. Talk to a healthcare provider or pharmacist about your specific situation.
      </div>

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <Link href="/shop" className="btn-primary">Shop Related Products</Link>
      </div>
    </div>
  );
}
