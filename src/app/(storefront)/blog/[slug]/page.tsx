import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, getArticleBySlug, SAFETY_CATEGORY } from '@/lib/articles';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found - Metrolean-Pharma Health Tips' };

  const url = `/blog/${article.slug}`;
  return {
    title: `${article.title} - Metrolean-Pharma Health Tips`,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: 'article',
      publishedTime: article.date,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

// Renders one body block. Two lightweight conventions on top of plain paragraphs:
// "## " prefix -> <h2>; a "\n- " sequence -> lead-in paragraph + <ul> of list items.
function renderBlock(block: string, key: number) {
  if (block.startsWith('## ')) {
    const [heading, ...rest] = block.slice(3).split('\n- ');
    return (
      <div key={key}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--accent)', margin: '0.5rem 0 1rem' }}>{heading}</h2>
        {rest.length > 0 && (
          <ul style={{ margin: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rest.map((item, i) => (
              <li key={i} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (block.includes('\n- ')) {
    const [intro, ...items] = block.split('\n- ');
    return (
      <div key={key}>
        {intro && <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>{intro}</p>}
        <ul style={{ margin: '0 0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <p key={key} style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{block}</p>;
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) notFound();

  const isSafetyArticle = article.category === SAFETY_CATEGORY;
  const related = ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug).slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    url: `https://metrolean.com/blog/${article.slug}`,
    publisher: { '@type': 'Organization', name: 'Metrolean-Pharma Health Tips' },
  };

  return (
    <div style={{ padding: '8rem 2rem 5rem', maxWidth: '760px', margin: '0 auto', minHeight: '80vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>&larr; Back to Health Guides</Link>

      <header style={{ margin: '2rem 0 3rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{article.category}</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--accent)', margin: '0.75rem 0 1rem', lineHeight: 1.15 }}>{article.title}</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {article.body.map((block, i) => renderBlock(block, i))}
      </div>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        This article is for general education and isn&apos;t a substitute for professional medical advice. Talk to a healthcare provider or pharmacist about your specific situation.
        {isSafetyArticle && (
          <>
            {' '}If you or someone you know needs support, the SAMHSA National Helpline (1-800-662-4357) is free, confidential, and available 24/7, and Poison Control (1-800-222-1222) can help with a suspected overdose or exposure.
          </>
        )}
      </div>

      {related.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--accent)', marginBottom: '1rem' }}>Related Articles</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {related.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>{a.title} &rarr;</Link>
            ))}
          </div>
        </div>
      )}

      {!isSafetyArticle && (
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/shop" className="btn-primary">Shop Related Products</Link>
        </div>
      )}
    </div>
  );
}
