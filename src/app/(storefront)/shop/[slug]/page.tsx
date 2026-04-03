'use client';

import { useEffect, useState, use, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Product, Category } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { CLINICAL_ICONS } from '@/components/ProductCard';
import './pdp.css';

type TabType = 'description' | 'details' | 'comments';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const { addToCart, setCartOpen } = useCart();
  const router = useRouter();
  
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data: currentProduct } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (currentProduct) {
        setProduct(currentProduct);
        setSelectedImage(currentProduct.image_urls?.[0] || null);
        setSelectedImageIndex(0);

        // Fetch category
        if (currentProduct.category_id) {
          const { data: cat } = await supabase
            .from('categories')
            .select('*')
            .eq('id', currentProduct.category_id)
            .single();
          setCategory(cat);
        }

        // Related products
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .or(`category_id.eq.${currentProduct.category_id},therapeutic_class.eq.${currentProduct.therapeutic_class}`)
          .neq('id', currentProduct.id)
          .eq('is_active', true)
          .limit(4);
        setRelatedProducts(related || []);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setActiveTab('description');
    setIsDescExpanded(false);
  }, [slug]);

  const handleImageSelect = (url: string, idx: number) => {
    setSelectedImage(url);
    setSelectedImageIndex(idx);
    
    // Scroll to the indexed image
    if (imgRef.current) {
      const scrollWidth = imgRef.current.offsetWidth;
      imgRef.current.scrollTo({
        left: scrollWidth * idx,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIdx = Math.round(scrollLeft / itemWidth);
    if (newIdx !== selectedImageIndex) {
      setSelectedImageIndex(newIdx);
    }
  };

  const handlePrev = () => {
    const newIdx = Math.max(0, selectedImageIndex - 1);
    handleImageSelect(images[newIdx], newIdx);
  };

  const handleNext = () => {
    const newIdx = Math.min(images.length - 1, selectedImageIndex + 1);
    handleImageSelect(images[newIdx], newIdx);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      router.push('/checkout');
    }
  };

  if (loading) return <div className="spinner" style={{ margin: '10rem auto' }} />;

  if (!product) {
    return (
      <div className="pdp-not-found">
        <h1>Medication Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/shop" className="btn-primary">Return to Pharmacy</Link>
      </div>
    );
  }

  const icon = CLINICAL_ICONS[product.scent_family] || '💊';
  const images = product.image_urls && product.image_urls.length > 0 ? product.image_urls : [];
  const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);
  const unitPrice = parseFloat(product.price).toFixed(2);

  // Dosage form icons
  const dosageIcons: Record<string, string> = {
    Solid: '💊',
    Liquid: '🧴',
    Cream: '🧴',
    Injection: '💉',
    Other: '📦',
  };

  const descriptionText = product.description || product.short_description || 'No description available for this product.';
  const shortDesc = descriptionText.length > 150 ? descriptionText.substring(0, 150) + '...' : descriptionText;

  return (
    <div className="pdp-wrapper">
      <div className="pdp-layout">

        {/* ═══ LEFT: IMAGE GALLERY ═══ */}
        <div className="pdp-left-col">
          {product.sku && (
            <span className="pdp-sku-badge">{product.sku}</span>
          )}

          <div 
            className="pdp-main-img-box" 
            ref={imgRef}
            onScroll={handleScroll}
            style={{ 
              overflowX: images.length > 1 ? 'auto' : 'hidden',
              scrollSnapType: 'x mandatory',
              display: 'flex',
              alignItems: 'center',
              justifyContent: images.length > 1 ? 'flex-start' : 'center',
              scrollBehavior: 'smooth',
              gap: 0,
              padding: 0
            }}
          >
            {images.length > 0 ? (
              images.map((url, i) => (
                <div key={i} className="pdp-slide">
                  <img src={url} alt={`${product.name} - view ${i + 1}`} />
                </div>
              ))
            ) : (
              <div className="pdp-slide">
                <span className="pdp-icon-fallback">{icon}</span>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button 
                className="pdp-nav-arrow left" 
                onClick={handlePrev}
                disabled={selectedImageIndex === 0}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button 
                className="pdp-nav-arrow right" 
                onClick={handleNext}
                disabled={selectedImageIndex === images.length - 1}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          )}

          {/* Carousel Dots */}
          {images.length > 1 && (
            <div className="pdp-carousel-dots">
              {images.map((url, i) => (
                <button
                  key={i}
                  className={`pdp-dot ${selectedImageIndex === i ? 'active' : ''}`}
                  onClick={() => handleImageSelect(url, i)}
                  aria-label={`View image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ═══ RIGHT: DARK INFO PANEL ═══ */}
        <div className="pdp-right-col">
          {/* Breadcrumb */}
          <nav className="pdp-breadcrumb">
            <Link href="/shop">Shop</Link>
            <span className="separator">›</span>
            {category && (
              <>
                <Link href={`/shop?category=${category.slug}`}>{category.name}</Link>
                <span className="separator">›</span>
              </>
            )}
            <span className="current">{product.name}</span>
          </nav>

          {/* Category Label */}
          <span className="pdp-category-label">
            {category?.name || product.therapeutic_class || 'Pharmacy'}
          </span>

          {/* Product Title */}
          <h1 className="pdp-main-title">{product.name}</h1>

          {/* Manufacturer */}
          {product.manufacturer && (
            <p className="pdp-manufacturer">{product.manufacturer}</p>
          )}

          {/* Prescription Badge */}
          {product.requires_prescription ? (
            <span className="pdp-rx-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Prescription Required
            </span>
          ) : (
            <span className="pdp-otc-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              Over The Counter
            </span>
          )}

          {/* Price & Rating */}
          <div className="pdp-price-rating-row">
            <div className="pdp-price">
              ${unitPrice}
              {product.compare_at_price && parseFloat(product.compare_at_price) > parseFloat(product.price) && (
                <span className="pdp-compare-price">${parseFloat(product.compare_at_price).toFixed(2)}</span>
              )}
            </div>
            <div className="pdp-stars-row">
              {[1, 2, 3, 4].map(n => (
                <span key={n} className="pdp-star filled">★</span>
              ))}
              <span className="pdp-star half">★</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="pdp-tabs">
            <button
              className={`pdp-tab ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`pdp-tab ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`pdp-tab ${activeTab === 'comments' ? 'active' : ''}`}
              onClick={() => setActiveTab('comments')}
            >
              Comments
            </button>
          </div>

          {/* Tab Content */}
          <div className="pdp-tab-content">
            {activeTab === 'description' && (
              <p>
                {isDescExpanded ? descriptionText : shortDesc}
                {descriptionText.length > 150 && (
                  <>
                    {' '}
                    <button className="read-more-btn" onClick={() => setIsDescExpanded(!isDescExpanded)}>
                      {isDescExpanded ? 'show less' : 'read more'}
                    </button>
                  </>
                )}
              </p>
            )}
            {activeTab === 'details' && (
              <div className="pdp-details-grid">
                <div className="pdp-detail-item">
                  <span className="pdp-detail-label">SKU</span>
                  <span className="pdp-detail-value">{product.sku || '—'}</span>
                </div>
                <div className="pdp-detail-item">
                  <span className="pdp-detail-label">Dosage Form</span>
                  <span className="pdp-detail-value">{product.dosage_form || '—'}</span>
                </div>
                <div className="pdp-detail-item">
                  <span className="pdp-detail-label">Volume</span>
                  <span className="pdp-detail-value">{product.volume_ml ? `${product.volume_ml} ml` : '—'}</span>
                </div>
                <div className="pdp-detail-item">
                  <span className="pdp-detail-label">Therapeutic Class</span>
                  <span className="pdp-detail-value">{product.therapeutic_class || '—'}</span>
                </div>
                <div className="pdp-detail-item">
                  <span className="pdp-detail-label">Clinical Division</span>
                  <span className="pdp-detail-value">{product.scent_family || '—'}</span>
                </div>
                <div className="pdp-detail-item">
                  <span className="pdp-detail-label">Active Agent</span>
                  <span className="pdp-detail-value">{product.top_notes || '—'}</span>
                </div>
                {product.manufacturer && (
                  <div className="pdp-detail-item">
                    <span className="pdp-detail-label">Manufacturer</span>
                    <span className="pdp-detail-value">{product.manufacturer}</span>
                  </div>
                )}
                {product.expiry_date && (
                  <div className="pdp-detail-item">
                    <span className="pdp-detail-label">Expiry Date</span>
                    <span className="pdp-detail-value">{new Date(product.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                  </div>
                )}
              </div>
            )}
            {activeTab === 'comments' && (
              <p style={{ fontStyle: 'italic', opacity: 0.6 }}>
                No comments yet. Be the first to share your experience with this product.
              </p>
            )}
          </div>

          <div className="pdp-divider" />

          {/* Controls Row: Dosage / Quantity / Total */}
          <div className="pdp-controls-row">
            {/* Dosage Form */}
            <div className="pdp-control-group">
              <span className="pdp-control-label">Form</span>
              <div className="pdp-dosage-selector">
                <div className="pdp-dosage-badge active">
                  {dosageIcons[product.dosage_form] || '💊'}
                </div>
                <span className="pdp-dosage-text">{product.dosage_form || 'Solid'}</span>
              </div>
            </div>

            {/* Quantity */}
            <div className="pdp-control-group">
              <span className="pdp-control-label">Quantity</span>
              <div className="pdp-qty-selector">
                <button className="pdp-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span className="pdp-qty-value">{quantity}</span>
                <button className="pdp-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* Total Price */}
            <div className="pdp-control-group">
              <span className="pdp-control-label">Total Price</span>
              <span className="pdp-total-price">${totalPrice}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pdp-actions">
            <button className="btn-pdp-wishlist" onClick={handleBuyNow}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Buy Now
            </button>
            <button className="btn-pdp-cart" onClick={handleAddToCart}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              Add to Cart
            </button>
          </div>
        </div>

      </div>

      {/* ═══ RELATED PRODUCTS SECTION ═══ */}
      {relatedProducts.length > 0 && (
        <section className="pdp-related-section">
          <div className="pdp-related-container">
            <div className="pdp-related-header">
              <h3>You may also need</h3>
              <div className="pdp-related-arrows">
                <button className="pdp-related-arrow">‹</button>
                <button className="pdp-related-arrow">›</button>
              </div>
            </div>
            <div className="pdp-related-grid">
              {relatedProducts.map(p => (
                <Link href={`/shop/${p.slug}`} key={p.id} className="pdp-related-card">
                  <div className="pdp-related-img">
                    {p.image_urls?.[0] ? (
                      <img src={p.image_urls[0]} alt={p.name} />
                    ) : (
                      <span style={{ fontSize: '2.5rem' }}>{CLINICAL_ICONS[p.scent_family] || '💊'}</span>
                    )}
                  </div>
                  <div className="pdp-related-info">
                    <span className="pdp-related-name">{p.name}</span>
                    <span className="pdp-related-price">${parseFloat(p.price).toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
