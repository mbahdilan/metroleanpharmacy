'use client';

import { useState, useEffect } from 'react';
import { supabase, Product } from '@/lib/supabase';
import ProductForm from '@/components/Admin/ProductForm';

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Inventory' | 'Analytics'>('Inventory');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Slide Panel State
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Deletion Confirmation State
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Analytics State
  const [stats, setStats] = useState({
    totalSales: 0,
    activeProducts: 0,
    outOfStock: 0,
    totalOrders: 0
  });

  useEffect(() => {
    async function fetchProducts() {
      console.log('Fetching products...');
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchStats() {
      // 1. Total Sales & Orders
      const { data: orders } = await supabase.from('orders').select('total_amount');
      const totalSales = orders?.reduce((acc, curr) => acc + (parseFloat(curr.total_amount) || 0), 0) || 0;
      const totalOrders = orders?.length || 0;

      // 2. Active Products
      const { count: activeCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // 3. Out of Stock
      const { count: oosCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('units_in_stock', 0);

      setStats({
        totalSales,
        activeProducts: activeCount || 0,
        outOfStock: oosCount || 0,
        totalOrders
      });
    }
    
    if (activeTab === 'Analytics') {
      fetchStats();
    }
  }, [activeTab]);

  const handleDelete = async (id: string) => {
    console.log('Initiating delete for product ID:', id);
    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': session ? `Bearer ${session.access_token}` : '',
        }
      });
      
      console.log('Delete API response status:', response.status);
      if (response.ok) {
        console.log('Delete successful, refreshing list');
        setProducts(prev => prev.filter(p => p.id !== id));
        setProductToDelete(null);
        setIsSlidePanelOpen(false);
        return true;
      } else {
        const data = await response.json();
        alert('Error removing product: ' + (data.error || 'Unknown error'));
        return false;
      }
    } catch (err: any) {
      console.error('Delete API catch error:', err);
      alert('Error removing product: ' + err.message);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditClick = (product: Product) => {
    console.log('Editing product:', product.name);
    setEditingProduct(product);
    setSelectedCategory(product.therapeutic_class || product.scent_family || 'General');
    setIsSlidePanelOpen(true);
  };

  const handleAddNewClick = (category: string) => {
    setEditingProduct(null);
    setSelectedCategory(category);
    setIsCategoryModalOpen(false);
    setIsSlidePanelOpen(true);
  };

  const handleRefreshProducts = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (p.therapeutic_class || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-premium-wrapper" style={{ minHeight: '100vh', background: '#f4f7fa' }}>
      <style>{`
        .admin-premium-wrapper { font-family: 'Inter', sans-serif; color: #1e293b; }
        
        .top-nav {
          position: sticky; top: 0; z-index: 100;
          background: white; border-bottom: 1px solid #edf2f7;
          padding: 0 2.5rem; display: flex; justify-content: space-between; align-items: center;
          height: 80px;
        }
        .nav-left { display: flex; align-items: center; gap: 4rem; }
        .logo-text { font-size: 1.4rem; font-weight: 800; color: #0f172a; letter-spacing: -0.01em; }
        .logo-text span { color: #2563eb; }
        
        .desktop-tabs { display: flex; gap: 2.5rem; align-items: center; height: 100%; }
        .nav-tab { font-size: 0.9rem; font-weight: 600; color: #64748b; cursor: pointer; text-decoration: none; padding: 0.5rem 0; border: none; background: none; position: relative; }
        .nav-tab.active { color: #2563eb; }
        .nav-tab.active::after { content: ''; position: absolute; bottom: -14px; left: 0; right: 0; height: 3px; background: #2563eb; border-radius: 50px; }

        .nav-right { display: flex; align-items: center; gap: 1.5rem; }
        .nav-icon-btn { color: #64748b; font-size: 1.2rem; background: none; border: none; cursor: pointer; padding: 10px; border-radius: 50%; transition: all 0.2s; }
        .nav-icon-btn:hover { background: #f1f5f9; color: #0f172a; }
        
        .user-profile { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; padding: 6px 12px; border-radius: 12px; transition: all 0.2s; }
        .user-profile:hover { background: #f1f5f9; }
        .avatar-circle { width: 42px; height: 42px; border-radius: 12px; overflow: hidden; border: 2px solid white; box-shadow: 0 0 0 1px #e2e8f0; }
        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

        .dashboard-main { padding: 3rem 2.5rem; max-width: 1500px; margin: 0 auto; }
        
        .section-header { margin-bottom: 2.5rem; }
        .section-header h1 { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0 0 2rem 0; }
        
        .header-controls { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1.5rem; }
        .content-tabs { display: flex; gap: 2rem; border-bottom: 2px solid #f1f5f9; padding-right: 2rem; }
        .content-tab { font-size: 0.95rem; font-weight: 700; color: #94a3b8; background: none; border: none; cursor: pointer; padding: 0 0 1rem 0; position: relative; transition: color 0.2s; }
        .content-tab.active { color: #0f172a; }
        .content-tab.active::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 3px; background: #2563eb; border-radius: 50px; }
        
        .right-actions { display: flex; align-items: center; gap: 1.25rem; }
        .btn-blue { background: #2563eb; color: white; border: none; border-radius: 12px; padding: 0.8rem 1.6rem; font-weight: 700; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: all 0.2s; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25); }
        .btn-blue:hover { transform: translateY(-1px); }

        .table-card { background: white; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.03); padding: 2rem; border: 1px solid #f1f5f9; }
        .table-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        
        .search-box { position: relative; width: 340px; }
        .search-box i { position: absolute; left: 1.1rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-style: normal; }
        .search-input-modern { border: 2px solid #f1f5f9; border-radius: 12px; padding: 0.8rem 1rem 0.8rem 3rem; width: 100%; font-size: 0.95rem; font-weight: 500; background: #f8fafc; outline: none; }
        .search-input-modern:focus { border-color: #2563eb; background: white; }

        .krafts-table { width: 100%; border-collapse: collapse; }
        .krafts-table th { text-align: left; padding: 1.5rem 1rem; color: #94a3b8; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; border-bottom: 2px solid #f8fafc; }
        .krafts-table td { padding: 1.5rem 1rem; border-bottom: 1.5px solid #f8fafc; vertical-align: middle; cursor: pointer; }
        .krafts-table tr:hover td { background: #fbfcfe; }
        
        .product-cell { display: flex; align-items: center; gap: 1.25rem; }
        .avatar-thumb { width: 48px; height: 48px; border-radius: 12px; object-fit: cover; background: #f1f5f9; }
        .product-meta h4 { margin: 0; font-size: 1rem; font-weight: 700; color: #0f172a; }
        .product-meta p { margin: 0; font-size: 0.8rem; color: #94a3b8; font-weight: 600; }
        
        .status-chip { display: inline-flex; align-items: center; padding: 6px 14px; border-radius: 10px; font-size: 0.8rem; font-weight: 700; }
        .status-chip.activated { background: #e6fcf5; color: #0ca678; }
        .status-chip.muted { background: #fff5f5; color: #fa5252; }

        .action-dots { background: none; border: none; color: #cbd5e1; font-size: 1.4rem; cursor: pointer; padding: 5px 10px; transition: all 0.2s; border-radius: 8px; }
        .action-dots:hover { background: #f1f5f9; color: #64748b; }

        .slide-panel-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 1000; animation: fadeIn 0.4s forwards; }
        .slide-panel { position: fixed; bottom: 0; left: 0; right: 0; height: 75vh; background: white; z-index: 1001; border-top-left-radius: 40px; border-top-right-radius: 40px; transform: translateY(100%); animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; display: flex; flex-direction: column; overflow: hidden; }
        .slide-panel-header { padding: 2rem 3rem; border-bottom: 2px solid #f8fafc; display: flex; justify-content: space-between; align-items: center; }
        .slide-panel-body { flex: 1; overflow-y: auto; padding: 3rem; background: #f8fafc; }
        .close-btn-round { background: #f1f5f9; border: none; width: 44px; height: 44px; border-radius: 50%; cursor: pointer; font-size: 1.25rem; color: #64748b; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .close-btn-round:hover { transform: rotate(90deg); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { to { transform: translateY(0); } }

        .metrics-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2.5rem; }
        .stat-card-krafts { background: white; border-radius: 20px; padding: 2rem; border: 1px solid #f1f5f9; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
        .stat-card-krafts label { font-size: 0.8rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 1rem; }
        .stat-card-krafts .value { font-size: 2.4rem; font-weight: 800; color: #0f172a; }
        .stat-card-krafts .trend { font-size: 0.9rem; font-weight: 700; padding: 4px 10px; border-radius: 8px; margin-left: 1rem; }
        .trend.up { background: #e6fcf5; color: #0ca678; }
        .trend.down { background: #fff5f5; color: #fa5252; }

        .category-grid { display: grid; gap: 1.5rem; }
        .category-card { background: white; padding: 2rem; border-radius: 20px; border: 2px solid #f1f5f9; transition: all 0.2s; }
        .category-card:hover { border-color: #2563eb; transform: translateY(-4px); }
        .category-icon { font-size: 2rem; margin-bottom: 1rem; }
        .category-card h4 { margin: 0; font-weight: 800; }
        .category-card p { margin: 0.5rem 0 0 0; color: #64748b; font-size: 0.9rem; }

        /* Confirmation Modal */
        .confirm-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.2s forwards; }
        .confirm-modal { background: white; padding: 2.5rem; border-radius: 24px; width: 440px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); text-align: center; }
        .confirm-modal h3 { margin: 0 0 1rem; font-size: 1.25rem; font-weight: 800; }
        .confirm-modal p { color: #64748b; margin-bottom: 2rem; font-size: 0.95rem; }
        .confirm-actions { display: flex; gap: 1rem; justify-content: center; }

        .btn-ghost { background: #f1f5f9; color: #475569; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
        .btn-danger-solid { background: #ef4444; color: white; border: none; padding: 0.8rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
        .btn-danger-solid:disabled { opacity: 0.6; cursor: not-allowed; }

        @media (max-width: 1024px) {
          .nav-left { gap: 1.5rem; }
          .desktop-tabs { display: none; }
          .dashboard-main { padding: 2rem 1.25rem; }
          .slide-panel { height: 90vh; }
        }
      `}</style>

      <nav className="top-nav">
        <div className="nav-left">
          <div className="logo-text">Metrolean <span>Pharmacy</span></div>
          <div className="desktop-tabs">
            <button className={`nav-tab ${activeTab === 'Inventory' ? 'active' : ''}`} onClick={() => setActiveTab('Inventory')}>Homepage</button>
            <button className={`nav-tab ${activeTab === 'Analytics' ? 'active' : ''}`} onClick={() => setActiveTab('Analytics')}>Analytics</button>
          </div>
        </div>
        <div className="nav-right">
          <button className="nav-icon-btn">⚙️</button>
          <button className="nav-icon-btn">🔔</button>
          <div className="user-profile">
            <div className="avatar-circle">
              <img src="https://i.pravatar.cc/150?u=admin_pharmacist" alt="Admin" />
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'Inventory' ? (
          <>
            <div className="section-header">
              <h1>Inventory Management</h1>
              <div className="header-controls">
                <div className="content-tabs">
                  <button className="content-tab active">Catalog</button>
                </div>
                <div className="right-actions">
                  <button onClick={() => setIsCategoryModalOpen(true)} className="btn-blue"><span>+</span> Add product</button>
                </div>
              </div>
            </div>

            <div className="table-card">
              <div className="table-toolbar">
                <div className="search-box">
                  <i>🔍</i>
                  <input 
                    type="text" 
                    className="search-input-modern" 
                    placeholder="Search medicines..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="krafts-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th style={{ textAlign: 'center' }}>Status</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} onClick={() => handleEditClick(product)}>
                        <td>
                          <div className="product-cell">
                            <img className="avatar-thumb" src={product.image_urls?.[0] || 'https://via.placeholder.com/200x200?text=Metrolean'} alt="" />
                            <div className="product-meta">
                              <h4>{product.name}</h4>
                              <p>REF: {product.id.substring(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td>{product.therapeutic_class || 'General'}</td>
                        <td style={{ fontWeight: 800 }}>${parseFloat(product.price).toFixed(2)}</td>
                        <td>{product.units_in_stock}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`status-chip ${product.units_in_stock > 0 ? 'activated' : 'muted'}`}>
                            {product.units_in_stock > 0 ? 'Active' : 'Empty'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button 
                            className="action-dots"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(product);
                            }}
                          >
                            •••
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!loading && filteredProducts.length === 0 && (
                  <div style={{ padding: '6rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🔎</div>
                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>No medical records found matching your search.</p>
                  </div>
                )}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} />
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="analytics-view">
            <div className="section-header">
              <h1>Business Intelligence</h1>
            </div>
            
            <div className="metrics-row">
              <div className="stat-card-krafts">
                <label>Total Sales Revenue</label>
                <div className="value">${stats.totalSales.toLocaleString()} <span className="trend up">Live</span></div>
              </div>
              <div className="stat-card-krafts">
                <label>Active Products</label>
                <div className="value">{stats.activeProducts} <span className="trend up">Catalog</span></div>
              </div>
              <div className="stat-card-krafts">
                <label>Out of Stock</label>
                <div className="value">{stats.outOfStock} <span className={`trend ${stats.outOfStock > 0 ? 'down' : 'up'}`}>{stats.outOfStock > 0 ? 'Warning' : 'Healthy'}</span></div>
              </div>
              <div className="stat-card-krafts">
                <label>Total Orders</label>
                <div className="value">{stats.totalOrders} <span className="trend up">Total</span></div>
              </div>
            </div>

            <div className="table-card">
              <h3 style={{ margin: 0 }}>Category Analysis</h3>
              <p style={{ color: '#64748b', padding: '4rem 0', textAlign: 'center' }}>Detailed metrics for Metrolean Pharmacy are currently being aggregated.</p>
            </div>
          </div>
        )}
      </main>

      {/* Slide Panels */}
      {isCategoryModalOpen && (
        <>
          <div className="slide-panel-overlay" onClick={() => setIsCategoryModalOpen(false)}></div>
          <div className="slide-panel">
            <div className="slide-panel-header">
              <h3 style={{ margin: 0 }}>Select Category</h3>
              <button className="close-btn-round" onClick={() => setIsCategoryModalOpen(false)}>×</button>
            </div>
            <div className="slide-panel-body">
              <div className="category-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {['Relaxatives', 'Strains', 'Syrups', 'Others'].map(cat => (
                  <div key={cat} onClick={() => handleAddNewClick(cat)} className="category-card">
                    <div className="category-icon">{cat === 'Relaxatives' ? '🍄' : cat === 'Strains' ? '🌿' : cat === 'Syrups' ? '🧪' : '💊'}</div>
                    <h4>{cat}</h4>
                    <p>Manage {cat.toLowerCase()} collection</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {isSlidePanelOpen && (
        <>
          <div className="slide-panel-overlay" onClick={() => setIsSlidePanelOpen(false)}></div>
          <div className="slide-panel">
            <div className="slide-panel-header">
              <div>
                <h3 style={{ margin: 0 }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                {editingProduct && <span style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {editingProduct.id}</span>}
              </div>
              <button className="close-btn-round" onClick={() => setIsSlidePanelOpen(false)}>×</button>
            </div>
            <div className="slide-panel-body">
              <ProductForm 
                initialData={editingProduct || undefined} 
                category={selectedCategory || undefined}
                onSuccess={() => { setIsSlidePanelOpen(false); handleRefreshProducts(); }}
                onCancel={() => setIsSlidePanelOpen(false)}
                onDelete={() => {
                  console.log('onDelete triggered from ProductForm');
                  if (editingProduct) {
                    setProductToDelete(editingProduct.id);
                  }
                }}
              />
            </div>
          </div>
        </>
      )}

      {/* Custom Confirmation Modal */}
      {productToDelete && (
        <div className="confirm-overlay">
          <div className="confirm-modal">
            <h3>Confirm Deletion</h3>
            <p>This action will permanently remove this record and all associated images from the repository. This cannot be undone.</p>
            <div className="confirm-actions">
              <button className="btn-ghost" onClick={() => setProductToDelete(null)}>Cancel</button>
              <button 
                className="btn-danger-solid" 
                onClick={() => handleDelete(productToDelete)}
                disabled={isDeleting}
              >
                {isDeleting ? 'Removing...' : 'Permanently Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
