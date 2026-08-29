'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase, BlogPost } from '@/lib/supabase';

export default function AdminBlogDashboard() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
      setPosts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this post? This cannot be undone.')) return;
    setDeletingId(id);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/blog/${id}`, {
      method: 'DELETE',
      headers: { Authorization: session ? `Bearer ${session.access_token}` : '' },
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const data = await res.json();
      alert('Error removing post: ' + (data.error || 'Unknown error'));
    }
    setDeletingId(null);
  };

  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <style>{`
        .admin-topbar { position: sticky; top: 0; z-index: 10; background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 0 2rem; height: 72px; display: flex; align-items: center; justify-content: space-between; }
        .admin-logo { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); }
        .admin-logo span { color: var(--primary); }
        .admin-main { max-width: 1240px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }

        .table-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
        .table-toolbar h1 { font-size: 1.5rem; }
        .search-input { border: 1px solid var(--border); border-radius: 10px; padding: 0.6rem 1rem; width: 280px; max-width: 100%; font-size: 0.9rem; background: var(--bg-card); }
        .search-input:focus { outline: none; border-color: var(--primary); }

        .product-table-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .product-table { width: 100%; border-collapse: collapse; }
        .product-table th { text-align: left; padding: 1rem 1.25rem; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        .product-table td { padding: 1rem 1.25rem; border-bottom: 1px solid var(--border); vertical-align: middle; }
        .product-table tr:last-child td { border-bottom: none; }
        .product-table tr:hover td { background: var(--bg-card-hover); }

        .product-cell { display: flex; align-items: center; gap: 0.9rem; }
        .product-thumb { width: 42px; height: 42px; border-radius: 8px; object-fit: cover; background: var(--bg-main); flex-shrink: 0; }
        .product-cell h4 { margin: 0; font-size: 0.95rem; }
        .product-cell p { margin: 0; font-size: 0.75rem; color: var(--text-muted); }

        .badge { display: inline-block; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; }
        .badge.ok { background: #e6fcf5; color: #0ca678; }
        .badge.bad { background: #fff5f5; color: var(--error); }
        .badge.rx { background: #eef2ff; color: #4338ca; margin-left: 6px; }

        .row-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .row-actions a, .row-actions button { font-size: 0.8rem; font-weight: 700; padding: 0.4rem 0.8rem; border-radius: 8px; }
        .row-actions a { color: var(--primary); background: var(--accent-light); }
        .row-actions button { color: var(--error); background: #fff5f5; }
        .row-actions button:disabled { opacity: 0.5; }

        .empty-state { padding: 5rem 2rem; text-align: center; color: var(--text-muted); }

        @media (max-width: 700px) {
          .admin-topbar { padding: 0 1.25rem; }
          .admin-main { padding: 1.5rem 1.25rem 3rem; }
          .product-table-card { overflow-x: auto; }
          .product-table { min-width: 640px; }
        }
      `}</style>

      <nav className="admin-topbar">
        <div className="admin-logo">Metrolean-Pharma <span>Blog Admin</span></div>
        <Link href="/admin" className="btn-secondary">← Products</Link>
      </nav>

      <main className="admin-main">
        <div className="table-toolbar">
          <h1>Blog Posts</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input className="search-input" placeholder="Search posts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <Link href="/admin/blog/add" className="btn-primary">+ New Post</Link>
          </div>
        </div>

        <div className="product-table-card">
          {loading ? (
            <div className="empty-state"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No posts found.</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div className="product-cell">
                        {post.featured_image && <img className="product-thumb" src={post.featured_image} alt="" />}
                        <div>
                          <h4>{post.title}</h4>
                          <p>/blog/{post.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td>{post.category}</td>
                    <td>{new Date(post.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge ${post.is_published ? 'ok' : 'bad'}`}>{post.is_published ? 'Published' : 'Draft'}</span>
                      {post.is_safety_content && <span className="badge rx">Safety</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
                        <button onClick={() => handleDelete(post.id)} disabled={deletingId === post.id}>
                          {deletingId === post.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
