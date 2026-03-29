'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase, Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { CLINICAL_ICONS } from '@/components/ProductCard';
import './pdp.css';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, setCartOpen } = useCart();
  const router = useRouter();

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
        
        // Related products logic
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .or(`category_id.eq.${currentProduct.category_id},therapeutic_class.eq.${currentProduct.therapeutic_class}`)
          .neq('id', currentProduct.id)
          .limit(3);
        setRelatedProducts(related || []);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

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
        <Link href="/shop" className="btn-primary">Return to Pharmacy</Link>
      </div>
    );
  }

  const icon = CLINICAL_ICONS[product.scent_family] || '💊';

  return (
    <div className="pdp-wrapper">
      <div className="pdp-layout">
        
        {/* LEFT COLUMN: Gallery & Recently Viewed */}
        <div className="pdp-left-col">
          <div className="pdp-gallery-wrap">
            <div className="pdp-main-img-box">
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} />
              ) : (
                <span className="pdp-icon-fallback">{icon}</span>
              )}
            </div>
            
            <div className="pdp-thumbs-col">
              {product.image_urls && product.image_urls.length > 0 ? (
                product.image_urls.map((url, i) => (
                  <div 
                    key={i} 
                    className={`pdp-thumb ${selectedImage === url ? 'active' : ''}`}
                    onClick={() => setSelectedImage(url)}
                  >
                    <img src={url} alt={`${product.name} view ${i+1}`} />
                  </div>
                ))
              ) : (
                <div className="pdp-thumb active">
                  <span style={{ fontSize: '1.2rem' }}>{icon}</span>
                </div>
              )}
            </div>
          </div>

          {/* Recently Viewed (Related Products) */}
          {relatedProducts.length > 0 && (
            <div className="pdp-recently-viewed">
              <div className="rec-header">
                <h4>Recently viewed</h4>
                <div className="rec-arrows">
                  <button className="rec-arrow-btn">‹</button>
                  <button className="rec-arrow-btn">›</button>
                </div>
              </div>
              <div className="rec-list">
                {relatedProducts.map(p => (
                  <Link href={`/shop/${p.slug}`} key={p.id} className="rec-card-link">
                    <div className="rec-card">
                      <div className="rec-img">
                        <img src={p.image_urls?.[0]} alt={p.name} />
                      </div>
                      <div className="rec-info">
                        <span className="rec-name">{p.name}</span>
                        <span className="rec-price">$ {parseFloat(p.price).toFixed(2)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Product Details */}
        <div className="pdp-right-col">
          <div className="pdp-header-flex">
            <h1 className="pdp-main-title">{product.name}</h1>
            <button className="pdp-heart-btn" aria-label="Add to wishlist">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>
          
          <p className="pdp-sub-desc">
            {product.short_description || (product.description.length > 120 ? product.description.substring(0, 120) + '...' : product.description)} 
            It brings a great addition to your routine based on your needs.
          </p>
          
          <div className="pdp-price-qty-row">
            <div className="pdp-price">$ {(parseFloat(product.price) * quantity).toFixed(2)}</div>
            <div className="pdp-qty-selector">
              <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span className="qty-value">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          
          <div className="pdp-reviews-row">
            <div className="pdp-stars">
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star filled">★</span>
              <span className="star half-filled">★</span>
            </div>
            <span className="pdp-review-count">441 reviews</span>
          </div>

          <div className="pdp-actions-row">
            <button className="btn-pdp-outline" onClick={handleBuyNow}>Buy Now</button>
            <button className="btn-pdp-solid" onClick={handleAddToCart}>Add to cart</button>
          </div>

          <div className="pdp-delivery-info">
            <div className="del-row">
              <span className="del-text">Dispatched in 5 - 7 weeks <span className="del-info-icon">ⓘ</span></span>
              <span className="del-arrow">›</span>
            </div>
            <span className="del-link">Why the longer lead time?</span>

            <div className="del-row" style={{ marginTop: '1.5rem' }}>
              <span className="del-text">Home Delivery - $ 10</span>
              <span className="del-arrow">›</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
