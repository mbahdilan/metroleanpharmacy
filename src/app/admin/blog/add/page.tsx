'use client';

import BlogPostForm from '@/components/Admin/BlogPostForm';
import Link from 'next/link';

export default function AddBlogPostPage() {
  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px' }} className="section">
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/admin/blog" style={{ color: 'var(--primary)', fontWeight: 700 }}>← Back to Posts</Link>
        <h1 style={{ marginTop: '1rem' }}>New Post</h1>
      </div>
      <BlogPostForm />
    </div>
  );
}
