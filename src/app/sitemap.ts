import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const BASE_URL = 'https://metrolean.com';

const STATIC_ROUTES = ['/', '/shop', '/blog', '/guides', '/about', '/contact', '/privacy', '/terms'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, created_at')
    .eq('is_published', true);

  const articleEntries = (posts || []).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.created_at),
  }));

  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')
    .eq('is_active', true);

  const productEntries = (products || []).map((product) => ({
    url: `${BASE_URL}/shop/${product.slug}`,
    lastModified: new Date(product.created_at),
  }));

  return [...staticEntries, ...articleEntries, ...productEntries];
}
