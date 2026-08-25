'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalSales: 0, totalOrders: 0, activeProducts: 0, outOfStock: 0 });

  useEffect(() => {
    async function load() {
      const [{ data: productData }, { data: orders }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('total_amount'),
      ]);

      const list = productData || [];
      setProducts(list);
      setStats({
        totalSales: (orders || []).reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0),
        totalOrders: (orders || []).length,
        activeProducts: list.filter(p => p.is_active).length,
        outOfStock: list.filter(p => p.units_in_stock === 0).length,
      });
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this product? This cannot be undone.')) return;
    setDeletingId(id);
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: session ? `Bearer ${session.access_token}` : '' },
    });
    if (res.ok) {
      setProducts(prev => prev.filter(p => p.id !== id));
    } else {
      const data = await res.json();
      alert('Error removing product: ' + (data.error || 'Unknown error'));
    }
    setDeletingId(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.therapeutic_class || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)' }}>
      <style>{`
        .admin-topbar { position: sticky; top: 0; z-index: 10; background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 0 2rem; height: 72px; display: flex; align-items: center; justify-content: space-between; }
        .admin-logo { font-size: 1.2rem; font-weight: 800; color: var(--text-primary); }
        .admin-logo span { color: var(--primary); }
        .admin-main { max-width: 1240px; margin: 0 auto; padding: 2.5rem 2rem 5rem; }

        .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.25rem; margin-bottom: 2.5rem; }
        .stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 16px; padding: 1.5rem; box-shadow: var(--shadow-sm); }
        .stat-card label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem; }
        .stat-card .value { font-size: 1.75rem; font-weight: 800; color: var(--text-primary); }
        .stat-card.warn .value { color: var(--error); }

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
        <div className="admin-logo">Metrolean-Pharma <span>Admin</span></div>
        <button className="btn-secondary" onClick={handleLogout}>Log Out</button>
      </nav>

      <main className="admin-main">
        <div className="stat-grid">
          <div className="stat-card">
            <label>Total Revenue</label>
            <div className="value">${stats.totalSales.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <label>Total Orders</label>
            <div className="value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <label>Active Products</label>
            <div className="value">{stats.activeProducts}</div>
          </div>
          <div className={`stat-card ${stats.outOfStock > 0 ? 'warn' : ''}`}>
            <label>Out of Stock</label>
            <div className="value">{stats.outOfStock}</div>
          </div>
        </div>

        <div className="table-toolbar">
          <h1>Products</h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input className="search-input" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <Link href="/admin/add" className="btn-primary">+ Add Product</Link>
          </div>
        </div>

        <div className="product-table-card">
          {loading ? (
            <div className="empty-state"><div className="spinner" /></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No products found.</div>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img className="product-thumb" src={product.image_urls?.[0] || product.image_url || ''} alt="" />
                        <div>
                          <h4>{product.name}</h4>
                          <p>REF: {product.id.substring(0, 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td>{product.therapeutic_class || '—'}</td>
                    <td style={{ fontWeight: 700 }}>${parseFloat(product.price).toFixed(2)}</td>
                    <td>{product.units_in_stock}</td>
                    <td>
                      <span className={`badge ${product.is_active ? 'ok' : 'bad'}`}>{product.is_active ? 'Visible' : 'Hidden'}</span>
                      {product.requires_prescription && <span className="badge rx">Rx</span>}
                    </td>
                    <td>
                      <div className="row-actions">
                        <Link href={`/admin/edit/${product.id}`}>Edit</Link>
                        <button onClick={() => handleDelete(product.id)} disabled={deletingId === product.id}>
                          {deletingId === product.id ? '...' : 'Delete'}
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
