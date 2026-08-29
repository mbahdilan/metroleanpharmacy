'use client';

import { useEffect, useState, use } from 'react';
import { supabase, BlogPost } from '@/lib/supabase';
import BlogPostForm from '@/components/Admin/BlogPostForm';
import Link from 'next/link';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from('blog_posts').select('*').eq('id', id).single();
      setPost(data);
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!post) return <div>Record not found.</div>;

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px' }} className="section">
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/admin/blog" style={{ color: 'var(--primary)', fontWeight: 700 }}>← Back to Posts</Link>
        <h1 style={{ marginTop: '1rem' }}>Edit Post</h1>
      </div>
      <BlogPostForm initialData={post} />
    </div>
  );
}
