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
  const [selectedTherapeutics, setSelectedTherapeutics] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const searchParams = useSearchParams();
  const categorySlug = searchParams.get('category');

  useEffect(() => {
    async function fetchData() {
      try {
        const [{ data: cats, error: catsError }, { data: prods, error: prodsError }] = await Promise.all([
          supabase.from('categories').select('*').order('name'),
          supabase.from('products').select('*').eq('is_active', true).order('name'),
        ]);
        
        if (catsError) console.error('Categories fetch error:', catsError);
        if (prodsError) console.error('Products fetch error:', prodsError);
        
        const categoryList = cats || [];
        setCategories(categoryList);
        setProducts(prods || []);
        
        if (categorySlug) {
          const matchingCat = categoryList.find(c => 
            c.slug.toLowerCase() === categorySlug.toLowerCase() || 
            c.name.toLowerCase() === categorySlug.toLowerCase()
          );
          if (matchingCat) {
            setSelectedCategory(matchingCat.id);
          }
        }
      } catch (err) {
        console.error('Unexpected error fetching shop data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [categorySlug]);

  // Responsive items per page detection
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setItemsPerPage(8);
      else if (width < 1200) setItemsPerPage(12);
      else setItemsPerPage(15);
    };
    
    // Set initial
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy, priceRange, selectedDosageForms, selectedTherapeutics]);

  const filteredAndSorted = products
    .filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (p.short_description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const priceValue = parseFloat(p.price);
      const matchesPrice = priceValue >= priceRange[0] && priceValue <= priceRange[1];
      
      const matchesDosageForm = selectedDosageForms.length === 0 || selectedDosageForms.includes(p.dosage_form);
      const matchesTherapeutic = selectedTherapeutics.length === 0 || selectedTherapeutics.includes(p.therapeutic_class);

      return matchesCategory && matchesSearch && matchesPrice && matchesDosageForm && matchesTherapeutic;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-high-low') return parseFloat(b.price) - parseFloat(a.price);
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      return 0;
    });

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const paginatedProducts = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleDosageForm = (form: string) => {
    setSelectedDosageForms(prev => 
      prev.includes(form) ? prev.filter(f => f !== form) : [...prev, form]
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
          background: var(--bg-main);
          font-family: 'Inter', sans-serif;
          color: var(--text-primary);
          overflow-x: hidden;
        }

        /* --- New Custom Hero with Grid --- */
        .shop-hero {
          position: relative;
          min-height: 600px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--bg-main);
          margin-top: 170px;
          padding: 2rem;
        }

        .hero-grid-container {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-template-rows: repeat(12, 1fr);
          gap: 15px;
          padding: 40px;
          opacity: 0.7;
          filter: grayscale(0.2) contrast(1.1);
        }

        .grid-item {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          transition: transform 0.4s ease;
        }
        .grid-item:hover { transform: scale(1.02); z-index: 10; opacity: 1 !important; }
        .grid-item img { width: 100%; height: 100%; object-fit: cover; }

        /* Laptop/Tablet Grid Mapping (Reference-inspired) */
        .item-1 { grid-area: 1 / 4 / 6 / 7; }
        .item-2 { grid-area: 2 / 7 / 5 / 9; }
        .item-3 { grid-area: 3 / 1 / 6 / 4; }
        .item-4 { grid-area: 6 / 2 / 10 / 5; }
        .item-5 { grid-area: 6 / 5 / 11 / 8; }
        .item-6 { grid-area: 5 / 8 / 9 / 11; }
        .item-7 { grid-area: 9 / 8 / 12 / 12; }
        .item-8 { grid-area: 8 / 11 / 11 / 13; display: none; } /* Extra placeholder */

        .hero-content {
          position: relative;
          z-index: 20;
          text-align: center;
          pointer-events: none;
        }

        .hero-title {
          font-size: clamp(4rem, 18vw, 14rem);
          font-weight: 900;
          margin: 0;
          line-height: 1;
          text-transform: uppercase;
          letter-spacing: -0.04em;
          color: var(--text-primary);
          animation: titleFadeIn 1s ease-out;
        }

        @keyframes titleFadeIn {
          from { opacity: 0; transform: translateY(30px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Mobile Gallery (Nike Style Swiper) */
        .mobile-hero-gallery {
          display: none;
          width: 100%;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding: 1rem 0;
          gap: 1rem;
          scrollbar-width: none;
          margin-top: 2rem;
        }
        .mobile-hero-gallery::-webkit-scrollbar { display: none; }
        
        .mobile-gallery-item {
          flex: 0 0 85%;
          aspect-ratio: 16/9;
          scroll-snap-align: center;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
        .mobile-gallery-item img { width: 100%; height: 100%; object-fit: cover; }

        @media (max-width: 900px) {
          .hero-grid-container { display: none; }
          .shop-hero { 
            min-height: auto; 
            flex-direction: column; 
            padding: 2rem 0; 
            margin-top: 140px;
          }
          .hero-title {
            font-size: 6rem;
          }
          .mobile-hero-gallery { display: flex; }
        }

        @media (max-width: 600px) {
           .hero-title { font-size: 5rem; }
           .shop-hero { margin-top: 120px; }
        }

        /* --- New Mobile Header (Matches Nike Image) --- */
        .mobile-shop-header {
          display: none;
          padding: 1.5rem 1rem 0.5rem 1rem;
          flex-direction: column;
          gap: 1.5rem;
          background: var(--bg-main);
          position: sticky;
          top: 130px; /* Below navbar + banner */
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
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 0.85rem 1.25rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-primary);
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
           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
          border: 1px solid var(--border);
          background: var(--bg-card);
          color: var(--text-secondary);
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
        .sub-header-left h2 { font-size: 1.5rem; font-weight: 800; color: var(--accent); margin: 0; }
        .search-area { position: relative; flex: 1; min-width: 0; }
        .search-area i { position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-style: normal; }
        .search-input {
          width: 100%;
          padding: 1rem 1rem 1rem 3.5rem;
          border-radius: 50px;
          border: 1.5px solid var(--border);
          background: var(--bg-card);
          color: var(--text-primary);
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          transition: all 0.3s;
        }
        .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(157, 191, 203, 0.1); background: var(--bg-main); }
        .search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--primary);
          color: white;
          border: none;
          padding: 0.6rem 1.4rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 800;
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
          background: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border);
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
        .filter-toggle-btn:hover { background: var(--bg-main); transform: rotate(15deg); }
        .filter-toggle-btn.active { background: var(--primary); color: white; transform: rotate(90deg); }

        .filter-dropdown-overlay {
          position: absolute;
          top: 0;
          right: 2rem;
          width: 350px;
          background: var(--bg-card);
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          z-index: 100;
          padding: 2.5rem;
          border: 1px solid var(--border);
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
        .filter-title { font-size: 0.85rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; display: block; border-bottom: 2px solid var(--border); padding-bottom: 0.75rem; }
        
        .category-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .category-item {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0.75rem 1rem; border-radius: 12px; cursor: pointer;
          transition: all 0.2s; font-size: 0.95rem; font-weight: 600; color: var(--text-secondary);
        }
        .category-item:hover { background: var(--bg-main); color: var(--text-primary); }
        .category-item.active { background: var(--primary); color: white; }
        .cat-count { font-size: 0.75rem; padding: 2px 8px; border-radius: 50px; background: var(--bg-main); color: var(--text-muted); }
        .category-item.active .cat-count { background: rgba(0,0,0,0.2); color: var(--bg-main); }

        .tag-list { display: flex; flex-direction: column; gap: 0.75rem; padding: 0 0.5rem; }
        .tag-item { display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.9rem; font-weight: 600; cursor: pointer; transition: color 0.2s; }
        .tag-item:hover { color: var(--text-primary); }
        .tag-bullet { width: 8px; height: 8px; border-radius: 50%; border: 2px solid var(--text-muted); }
        .tag-item.active .tag-bullet { border-color: var(--primary); background: var(--primary); }

        /* Product Grid Area */
        .grid-container { display: flex; flex-direction: column; gap: 3rem; }
        .products-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        /* Recommendations Section */
        .recommendations-section {
          background: var(--bg-card);
          padding: 6rem 2rem;
          border-top: 1px solid var(--border);
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
          margin: 2rem auto 4rem;
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 3rem 2rem;
          color: var(--text-primary);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          overflow: hidden;
          position: relative;
        }
        .news-content h2 { font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 800; margin-bottom: 1rem; color: var(--accent); }
        .news-form { display: flex; gap: 0.75rem; background: var(--bg-card); padding: 6px; border-radius: 50px; border: 1px solid var(--border); width: 100%; max-width: 450px; }
        .news-input { background: none; border: none; padding: 0.75rem 1.5rem; color: var(--text-primary); width: 100%; outline: none; font-size: 0.9rem; }
        .news-btn { background: var(--primary); color: white; border: none; padding: 0.75rem 2rem; border-radius: 50px; font-weight: 800; cursor: pointer; }

        /* Responsive Fixes */
        @media (max-width: 1200px) {
          .search-container { width: 100%; }
          .products-grid { grid-template-columns: repeat(4, 1fr); }
          .filter-dropdown-overlay { width: 300px; right: 1rem; }
        }
        @media (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(3, 1fr); }
          .shop-sub-header { display: none !important; }
          .mobile-shop-header { display: flex; padding: 1rem; }
          .search-container { max-width: 100%; }
          .rec-header { flex-direction: column; gap: 1rem; align-items: flex-start; }
        }
        @media (max-width: 600px) {
          .products-grid { 
            grid-template-columns: 1fr 1fr !important; 
            gap: 0.75rem; 
            width: 100%; 
            margin: 2rem auto 0;
            padding: 0;
            grid-auto-rows: 1fr;
          }
          .grid-container { padding: 40px 0.75rem 1rem; margin: 0; width: 100%; }
          .filter-dropdown-overlay { width: calc(100% - 2rem); left: 1rem; right: 1rem; }
          .shop-hero { height: 200px; }
          .shop-main-layout { padding: 0 !important; width: 100%; }
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
              placeholder="Search products..."
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

      {/* Custom Hero Section */}
      <section className="shop-hero">
        {/* Desktop/Tablet Grid View */}
        <div className="hero-grid-container">
          <div className="grid-item item-1"><img src="/images/hero-medical.jpg.jpg" alt="" /></div>
          <div className="grid-item item-2"><img src="/images/about/hero.png" alt="" /></div>
          <div className="grid-item item-3"><img src="/images/categories/cold-flu.png" alt="" /></div>
          <div className="grid-item item-4"><img src="/images/categories/pain relief.jpeg" alt="" /></div>
          <div className="grid-item item-5"><img src="/images/categories/vitamins & immunity.jpeg" alt="" /></div>
          <div className="grid-item item-6"><img src="/images/about/story.jpg" alt="" /></div>
          <div className="grid-item item-7"><img src="/images/about/hero.png" alt="" /></div>
        </div>

        <div className="hero-content">
          <h1 className="hero-title">Shop</h1>
        </div>

        {/* Mobile Swipeable Gallery */}
        <div className="mobile-hero-gallery">
          <div className="mobile-gallery-item"><img src="/images/hero-medical.jpg.jpg" alt="" /></div>
          <div className="mobile-gallery-item"><img src="/images/about/hero.png" alt="" /></div>
          <div className="mobile-gallery-item"><img src="/images/categories/cold-flu.png" alt="" /></div>
          <div className="mobile-gallery-item"><img src="/images/categories/pain relief.jpeg" alt="" /></div>
          <div className="mobile-gallery-item"><img src="/images/categories/vitamins & immunity.jpeg" alt="" /></div>
          <div className="mobile-gallery-item"><img src="/images/about/story.jpg" alt="" /></div>
        </div>
      </section>

      {/* Secondary Header with Search */}
      <div className="shop-sub-header">
        <div className="sub-header-left">
          <h2>Shop Our Products</h2>
        </div>
        <div className="search-container">
          <div className="search-area">
            <i>🔍</i>
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
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
            <span className="filter-title">Show</span>
            <select 
              className="search-input" 
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', fontSize: '0.85rem' }}
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            >
              <option value="8">8 per page</option>
              <option value="12">12 per page</option>
              <option value="15">15 per page</option>
              <option value="24">24 per page</option>
              <option value="48">48 per page</option>
              <option value="96">96 per page</option>
            </select>
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
                {paginatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Reference Style Pagination functional */}
              {totalPages > 1 && (
                <div className="pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '4rem' }}>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                    style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', opacity: currentPage === 1 ? 0.3 : 1, fontWeight: 700, color: 'var(--text-muted)' }}
                  >
                    ← Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Simple logic to show only relevant pages if there are many
                    if (totalPages > 7) {
                      if (page !== 1 && page !== totalPages && (page < currentPage - 1 || page > currentPage + 1)) {
                        if (page === currentPage - 2 || page === currentPage + 2) return <span key={page}>...</span>;
                        return null;
                      }
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          border: 'none',
                           background: currentPage === page ? 'var(--primary)' : 'transparent',
                          color: currentPage === page ? 'var(--bg-main)' : 'var(--text-muted)',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {page}
                      </button>
                    )
                  })}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                    style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', opacity: currentPage === totalPages ? 0.3 : 1, fontWeight: 700, color: 'var(--primary)' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Recommendations Section */}
      <section className="recommendations-section section-radiant">
        <div className="rec-container">
          <div className="rec-header">
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--accent)' }}>Explore our recommendations</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'var(--text-primary)' }}>←</button>
              <button style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', color: 'var(--text-primary)' }}>→</button>
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
      <section className="newsletter-cta section-radiant">
        <div className="news-content">
          <h2>Stay Up to Date<br />On New Arrivals</h2>
          <p style={{ opacity: 0.7, maxWidth: '400px', fontSize: '0.9rem' }}>
            Get notified about new products and health tips, straight to your inbox.
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
