// One-time migration: copies src/lib/articles.ts into the blog_posts table.
// Run `migrate_full_schema.sql` in Supabase first, then:
//   npx tsx --env-file=.env.local seed_blog_posts.mjs
// (npx fetches the tsx runner on demand so it can import the .ts file below —
// no need to add it as a project dependency for a one-time script. --env-file
// is Node's built-in .env loader, so no dotenv dependency either.)

import { createClient } from '@supabase/supabase-js';
import { ARTICLES, SAFETY_CATEGORY } from './src/lib/articles.ts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
const supabase = createClient(supabaseUrl, serviceKey);

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Mirrors the "## " and "\n- " conventions previously parsed at render time
// in blog/[slug]/page.tsx, but bakes them into stored HTML instead.
function blockToHtml(block) {
  if (block.startsWith('## ')) {
    const [heading, ...rest] = block.slice(3).split('\n- ');
    const items = rest.map((i) => `<li>${escapeHtml(i)}</li>`).join('');
    return `<h2>${escapeHtml(heading)}</h2>` + (items ? `<ul>${items}</ul>` : '');
  }
  if (block.includes('\n- ')) {
    const [intro, ...items] = block.split('\n- ');
    const intraHtml = intro ? `<p>${escapeHtml(intro)}</p>` : '';
    return intraHtml + `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`;
  }
  return `<p>${escapeHtml(block)}</p>`;
}

const rows = ARTICLES.map((a) => ({
  slug: a.slug,
  title: a.title,
  category: a.category,
  excerpt: a.excerpt,
  content_html: a.body.map(blockToHtml).join(''),
  is_published: true,
  is_safety_content: a.category === SAFETY_CATEGORY,
  created_at: new Date(a.date).toISOString(),
}));

const { data, error } = await supabase
  .from('blog_posts')
  .upsert(rows, { onConflict: 'slug' })
  .select('slug');

if (error) {
  console.error('Seed error:', error);
  process.exit(1);
}
console.log(`Seeded ${data.length} blog posts.`);
