import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase, BlogPost } from '@/lib/supabase';

async function getPost(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase.from('blog_posts').select('*').eq('slug', slug).eq('is_published', true).single();
  return data;
}

async function getRelated(category: string, slug: string): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('category', category)
    .neq('slug', slug)
    .limit(3);
  return data || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPost(slug);
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
      publishedTime: article.created_at,
      images: article.featured_image ? [article.featured_image] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPost(slug);

  if (!article) notFound();

  const related = await getRelated(article.category, article.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.created_at,
    url: `https://metrolean.com/blog/${article.slug}`,
    publisher: { '@type': 'Organization', name: 'Metrolean-Pharma Health Tips' },
  };

  return (
    <div style={{ padding: '8rem 2rem 5rem', maxWidth: '760px', margin: '0 auto', minHeight: '80vh' }}>
      <style>{`
        .article-body h2 { font-size: 1.5rem; color: var(--accent); margin: 2rem 0 1rem; }
        .article-body h3 { font-size: 1.25rem; color: var(--accent); margin: 1.5rem 0 0.75rem; }
        .article-body p { font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); margin: 0 0 1.5rem; }
        .article-body ul, .article-body ol { margin: 0 0 1.5rem 1.25rem; }
        .article-body li { font-size: 1.05rem; line-height: 1.8; color: var(--text-secondary); margin-bottom: 0.75rem; }
        .article-body a { color: var(--primary); text-decoration: underline; }
        .article-body img { max-width: 100%; border-radius: 12px; display: block; margin: 1.5rem auto; }
        .article-body blockquote { border-left: 3px solid var(--primary); margin: 0 0 1.5rem; padding-left: 1.25rem; color: var(--text-secondary); }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>&larr; Back to Health Guides</Link>

      <header style={{ margin: '2rem 0 3rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>{article.category}</span>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: 'var(--accent)', margin: '0.75rem 0 1rem', lineHeight: 1.15 }}>{article.title}</h1>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          {new Date(article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
        {article.featured_image && (
          <img src={article.featured_image} alt={article.title} style={{ width: '100%', borderRadius: '12px', marginTop: '1.5rem', display: 'block' }} />
        )}
      </header>

      <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content_html }} />

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
        This article is for general education and isn&apos;t a substitute for professional medical advice. Talk to a healthcare provider or pharmacist about your specific situation.
        {article.is_safety_content && (
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

      {!article.is_safety_content && (
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          <Link href="/shop" className="btn-primary">Shop Related Products</Link>
        </div>
      )}
    </div>
  );
}
