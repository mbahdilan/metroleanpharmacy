import { MetadataRoute } from 'next';
import { ARTICLES } from '@/lib/articles';

const BASE_URL = 'https://metrolean.com';

const STATIC_ROUTES = ['/', '/shop', '/blog', '/guides', '/about', '/contact', '/privacy', '/terms'];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  const articleEntries = ARTICLES.map((article) => ({
    url: `${BASE_URL}/blog/${article.slug}`,
    lastModified: new Date(article.date),
  }));

  return [...staticEntries, ...articleEntries];
}
