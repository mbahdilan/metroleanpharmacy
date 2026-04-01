'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase, Product, Category } from '@/lib/supabase';
import ProductCard from '@/components/ProductCard';

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="spinner" style={{ margin: '10rem auto' }} />}>
      <ShopContent />
    </Suspense>
  );
}

function ShopContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Advanced Filter State
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<number[]>([0, 5000]);
  const [selectedDosageForms, setSelectedDosageForms] = useState<string[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<number[]>([]);
  const [selectedClinicals, setSelectedClinicals] = useState<string[]>([]);
  const [selectedTherapeutics, setSelectedTherapeutics] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*').eq('is_active', true).order('name'),
      ]);
      
      const categoryList = cats || [];
      setCategories(categoryList);
      setProducts(prods || []);
      
      if (categorySlug) {
        const matchingCat = categoryList.find(c => c.slug.toLowerCase() === categorySlug.toLowerCase());
        if (matchingCat) {
          setSelectedCategory(matchingCat.id);
        }
      }
      
      setLoading(false);
    }
    fetchData();
  }, [categorySlug]);

  const filteredAndSorted = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.short_description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const priceValue = parseFloat(p.price);
      const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
      
      const matchesDosageForm = selectedDosageForms.length === 0 || selectedDosageForms.includes(p.dosage_form);
      const matchesVolume = selectedVolumes.length === 0 || selectedVolumes.includes(p.volume_ml);
      const matchesClinical = selectedClinicals.length === 0 || selectedClinicals.includes(p.scent_family);
      const matchesTherapeutic = selectedTherapeutics.length === 0 || selectedTherapeutics.includes(p.therapeutic_class);
      
      return matchesCategory && matchesSearch && matchesPrice && matchesDosageForm && matchesVolume && matchesClinical && matchesTherapeutic;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-high-low') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  const toggleDosageForm = (form: string) => {
    setSelectedDosageForms(prev => 
      prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]
    );
  };

  const toggleVolume = (vol: number) => {
    setSelectedVolumes(prev => 
      prev.includes(vol) ? prev.filter(v => v !== vol) : [...prev, vol]
    );
  };

  const toggleClinical = (clinical: string) => {
    setSelectedClinicals(prev => 
      prev.includes(clinical) ? prev.filter(c => c !== clinical) : [...prev, clinical]
    );
  };

  const toggleTherapeutic = (tClass: string) => {
    setSelectedTherapeutics(prev => 
      prev.includes(tClass) ? prev.filter(t => t !== tClass) : [...prev, tClass]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedDosageForms([]);
    setSelectedVolumes([]);
    setSelectedClinicals([]);
    setSelectedTherapeutics([]);
    setPriceRange([0, 5000]);
    setSortBy('newest');
    setSearchTerm('');
  };

  // Recommended products (just a slice for demo)
  const recommended = products.slice(0, 4);

  return (
    <div className="stuffus-shop-wrapper">
      <style>{`
        .stuffus-shop-wrapper {
          background: #fdfdfe;
          font-family: 'Inter', sans-serif;
          color: #1e293b;
          overflow-x: hidden;
        }

        /* Hero Section */
        .shop-hero {
          position: relative;
          height: 480px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0f172a;
          margin-top: 80px; /* Offset for navbar */
        }
        .hero-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.6;
          filter: brightness(0.7) contrast(1.1);
        }
        .hero-content {
          position: relative;
          z-index: 5;
          text-align: center;
        }
        .hero-title {
          font-size: clamp(3rem, 15vw, 10rem);
          font-weight: 900;
          color: rgba(255, 255, 255, 0.95);
          letter-spacing: -0.05em;
          margin: 0;
          line-height: 1;
          pointer-events: none;
          text-transform: uppercase;
        }

        /* --- New Mobile Header (Matches Nike Image) --- */
        .mobile-shop-header {
          display: none;
          padding: 1.5rem 1rem 0.5rem 1rem;
          flex-direction: column;
          gap: 1.5rem;
          background: white;
          position: sticky;
          top: 80px; /* Below navbar */
          z-index: 50;
        }

        .mobile-search-row {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .mobile-search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .mobile-search-input {
          width: 100%;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1e293b;
          outline: none;
        }

        .mobile-search-btn {
          width: 52px;
          height: 52px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 74, 153, 0.2);
        }

        .mobile-category-nav {
          display: flex;
          gap: 0.85rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
          padding-top: 0.5rem;
          scrollbar-width: none; /* Hide scrollbar Firefox */
        }

        .mobile-category-nav::-webkit-scrollbar { display: none; } /* Hide scrollbar Chrome/Safari */

        .mobile-cat-pill {
          padding: 0.6rem 1.4rem;
          border-radius: 10px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          border: 1px solid #e5e7eb;
          background: white;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mobile-cat-pill.active {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        
        /* Secondary Header */
        .shop-sub-header {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }
        .sub-header-left h2 { font-size: 1.5rem; font-weight: 800; color: #0f172a; margin: 0; }
        .search-area { position: relative; flex: 1; min-width: 0; }
        .search-area i { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: #94a3b8; font-style: normal; }
        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.5rem;
          border-radius: 50px;
          border: 1.5px solid #f1f5f9;
          background: #fbfcfe;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s;
        }
        .search-input:focus { border-color: #0f172a; box-shadow: 0 0 0 4px rgba(15, 23, 42, 0.05); background: white; }
        .search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: #0f172a;
          color: white;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* Main Content Layout */
        .shop-main-layout {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          padding: 0 2rem 5rem 2rem;
          position: relative;
        }

        /* Filter Dropdown Area */
        .search-container {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          max-width: 550px;
        }
        .filter-toggle-btn {
          background: #f1f5f9;
          color: #0f172a;
          border: none;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          flex-shrink: 0;
          font-size: 1.2rem;
        }
        .filter-toggle-btn:hover { background: #e2e8f0; transform: rotate(15deg); }
        .filter-toggle-btn.active { background: #0f172a; color: white; transform: rotate(90deg); }

        .filter-dropdown-overlay {
          position: absolute;
          top: 0;
          right: 2rem;
          width: 350px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          z-index: 100;
          padding: 2.5rem;
          border: 1px solid #f1f5f9;
          max-height: 80vh;
          overflow-y: auto;
          transform-origin: top right;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          opacity: 0;
          visibility: hidden;
          transform: scale(0.9) translateY(-20px);
        }
        .filter-dropdown-overlay.open {
          opacity: 1;
          visibility: visible;
          transform: scale(1) translateY(0);
        }

        /* Sidebar Filters within Dropdown */
        .shop-sidebar { width: 100%; }
        .filter-section { margin-bottom: 2rem; }
        .filter-title { font-size: 0.85rem; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; display: block; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.75rem; }
        
        .category-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .category-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer;
          transition: all 0.2s; font-size: 0.95rem; font-weight: 600; color: #64748b;
        }
        .category-item:hover { background: #f8fafc; color: #1e293b; }
        .category-item.active { background: #0f172a; color: white; }
        .cat-count { font-size: 0.75rem; padding: 2px 8px; border-radius: 50px; background: #f1f5f9; color: #94a3b8; }
        .category-item.active .cat-count { background: rgba(255,255,255,0.2); color: white; }

        .tag-list { display: flex; flex-direction: column; gap: 0.75rem; padding: 0 0.5rem; }
        .tag-item { display: flex; align-items: center; gap: 0.75rem; color: #64748b; font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .tag-item:hover { color: #0f172a; }
        .tag-bullet { width: 8px; height: 8px; border-radius: 50%; border: 2px solid #cbd5e1; }
        .tag-item.active .tag-bullet { border-color: #0f172a; background: #0f172a; }

        /* Product Grid Area */
        .grid-container { display: flex; flex-direction: column; gap: 3rem; }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        /* Recommendations Section */
        .recommendations-section {
          background: #fbfcfe;
          padding: 6rem 2rem;
          border-top: 1px solid #f1f5f9;
        }
        .rec-container { max-width: 1400px; margin: 0 auto; }
        .rec-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
        .rec-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1rem;
        }

        /* Newsletter CTA */
        .newsletter-cta {
          max-width: 1400px;
          margin: 2rem 1rem 4rem;
          background: #0f172a;
          border-radius: 20px;
          padding: 3rem 2rem;
          color: white;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          overflow: hidden;
          position: relative;
        }
        .news-content h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 800; margin-bottom: 1rem; }
        .news-form { display: flex; gap: 0.75rem; background: rgba(255,255,255,0.05); padding: 6px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 450px; }
        .news-input { background: none; border: none; padding: 0.75rem 1.5rem; color: white; width: 100%; outline: none; font-size: 0.9rem; }
        .news-btn { background: white; color: #0f172a; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 800; cursor: pointer; }

        /* Responsive Fixes */
        @media (max-width: 1200px) {
          .search-container { width: 100%; }
          .products-grid { grid-template-columns: repeat(4, 1fr); }
          .filter-dropdown-overlay { width: 300px; right: 1rem; }
        }
        @media (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
          .shop-hero { display: none !important; }
          .shop-sub-header { display: none !important; }
          .mobile-shop-header { display: flex; padding: 1rem; }
          .search-container { max-width: 100%; }
          .rec-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .products-grid { 
            grid-template-columns: 1fr 1fr !important; 
            gap: 1rem; 
            width: 100%; 
            margin-top: 2rem; /* Added margin for better clearance below sticky header */
            padding: 0;
            grid-auto-rows: 1fr;
          }
          .grid-container { padding: 40px 1rem 1rem; } /* Pushes content down to clear header */
          .filter-dropdown-overlay { width: calc(100% - 2rem); left: 1rem; right: 1rem; }
          .shop-hero { height: 200px; }
          .shop-main-layout { padding: 0 0 3rem; }
          .recommendations-section { padding: 3rem 1rem; }
        }
      `}</style>

      {/* Mobile Top Header (Nike Style) */}
      <div className="mobile-shop-header">
        <div className="mobile-search-row">
          <div className="mobile-search-input-wrapper">
            <input 
              type="text" 
              className="mobile-search-input" 
              placeholder="Search Pharmacy..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="mobile-search-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <div className="mobile-category-nav">
          <div 
            className={`mobile-cat-pill ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            All
          </div>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              className={`mobile-cat-pill ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.name}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Hero Section */}
      <section className="shop-hero">

        <img src="/images/shop/shop-hero-bg.jpg" className="hero-bg" alt="Metrolean Pharmacy" />
        <div className="hero-content">
          <h1 className="hero-title">Shop</h1>
        </div>
      </section>

      {/* Secondary Header with Search */}
      <div className="shop-sub-header">
        <div className="sub-header-left">
          <h2>Give All You Need</h2>
        </div>
        <div className="search-container">
          <div className="search-area">
            <i>🔍</i>
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search Metrolean internal inventory..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">Search</button>
          </div>
          <button 
            className={`filter-toggle-btn ${isFilterOpen ? 'active' : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            title="Filter Products"
          >
            {isFilterOpen ? '✕' : '⚙️'}
          </button>
        </div>
      </div>

      <div className="shop-main-layout">
        {/* Sidebar Filters Dropdown */}
        <div className={`filter-dropdown-overlay ${isFilterOpen ? 'open' : ''}`}>
          <aside className="shop-sidebar">
          <div className="filter-section">
            <span className="filter-title">Category</span>
            <ul className="category-list">
              <li 
                className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                <span>All Product</span>
                <span className="cat-count">{products.length}</span>
              </li>
              {categories.map(cat => (
                <li 
                  key={cat.id} 
                  className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="cat-count">{products.filter(p => p.category_id === cat.id).length}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-section">
            <span className="filter-title">Sort By Price</span>
            <select 
              className="search-input" 
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem' }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="filter-section">
            <span className="filter-title">Price Range (0 - {priceRange[1]})</span>
            <input 
              type="range" 
              min="0" 
              max="5000" 
              step="50"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
              style={{ width: '100%', cursor: 'pointer' }}
            />
          </div>

          <div className="filter-section">
            <span className="filter-title">Dosage Form</span>
            <div className="tag-list" style={{ gap: '0.5rem' }}>
              {['Solid', 'Liquid', 'Cream', 'Injection'].map(form => (
                <div 
                  key={form} 
                  className={`tag-item ${selectedDosageForms.includes(form) ? 'active' : ''}`}
                  onClick={() => toggleDosageForm(form)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.8rem' }}
                >
                  <div className="tag-bullet" />
                  <span>{form}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-title">Volume (ml)</span>
            <div className="tag-list" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[50, 100, 250, 500].map(vol => (
                <div 
                  key={vol} 
                  className={`tag-item ${selectedVolumes.includes(vol) ? 'active' : ''}`}
                  onClick={() => toggleVolume(vol)}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '50px', border: '1px solid var(--border)', fontSize: '0.75rem', minWidth: '60px', justifyContent: 'center' }}
                >
                  <span>{vol}ml</span>
                </div>
              ))}
            </div>
          </div>
          <div className="filter-section">
            <span className="filter-title">Clinical Division</span>
            <div className="tag-list" style={{ gap: '0.5rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
              {Array.from(new Set(products.map(p => p.scent_family).filter(Boolean))).map(clinical => (
                <div 
                  key={clinical} 
                  className={`tag-item ${selectedClinicals.includes(clinical) ? 'active' : ''}`}
                  onClick={() => toggleClinical(clinical)}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.75rem' }}
                >
                  <span>{clinical}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <span className="filter-title">Therapeutic Class</span>
            <div className="tag-list" style={{ gap: '0.5rem', display: 'flex', flexWrap: 'wrap', flexDirection: 'row' }}>
              {Array.from(new Set(products.map(p => p.therapeutic_class).filter(Boolean))).map(tClass => (
                <div 
                  key={tClass} 
                  className={`tag-item ${selectedTherapeutics.includes(tClass) ? 'active' : ''}`}
                  onClick={() => toggleTherapeutic(tClass)}
                  style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.75rem' }}
                >
                  <span>{tClass}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="cart-clear-btn"
            style={{ width: '100%', marginTop: '2rem', padding: '0.8rem' }}
          >
            Clear All Filters
          </button>
        </aside>
      </div>

      {/* Main Products Feed */}
        <div className="grid-container">
          {loading ? (
            <div style={{ padding: '6rem', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : (
            <>
              <div className="products-grid">
                {filteredAndSorted.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Reference Style Pagination placeholder */}
              <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                <span style={{ fontWeight: 800, color: '#0f172a' }}>1</span>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>2</span>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>3</span>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>...</span>
                <span style={{ fontWeight: 600, color: '#94a3b8' }}>Next →</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <section className="recommendations-section">
        <div className="rec-container">
          <div className="rec-header">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900 }}>Explore our recommendations</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>←</button>
              <button style={{ background: 'none', border: '1px solid #e2e8f0', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}>→</button>
            </div>
          </div>
          <div className="rec-grid">
            {recommended.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="newsletter-cta">
        <div className="news-content">
          <h2>Ready to Get<br />Our New Stuff?</h2>
          <p style={{ opacity: 0.7, maxWidth: '400px', fontSize: '0.9rem' }}>
            We'll listen to your needs, identify the best approach, and then create a bespoke smart pharmacy solution that's right for you.
          </p>
        </div>
        <div className="news-form">
          <input type="email" className="news-input" placeholder="Your Email Address" />
          <button className="news-btn">Send</button>
        </div>
      </section>
    </div>
  );
}
