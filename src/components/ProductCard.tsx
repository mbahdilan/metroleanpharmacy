'use client';

import Link from 'next/link';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useExchangeRates } from '@/hooks/useExchangeRates';

const STRAIN_ICONS: Record<string, string> = {
  Respiratory: '🫁',
  Strains: '🌿',
  Relaxatives: '🧘',
  Vitamins: '🍎',
  General: '💊',
  Calming: '🍃',
  Energy: '⚡',
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart, setCartOpen } = useCart();
  const { formatPrice } = useExchangeRates();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setCartOpen(true);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    // Directly open cart/checkout logic can be added here
    setCartOpen(true);
  };

  // Mocking ratings and category tag for the "Stuffus" aesthetic
  const mockRating = (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1);
  const mockReviews = Math.floor(Math.random() * 2000) + 100;
  const categoryTag = product.therapeutic_class || product.scent_family || 'Other';

  return (
    <div className="stuffus-product-card">
      <style>{`
        .stuffus-product-card {
          background: var(--bg-card);
          border-radius: 16px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--border);
          height: 100%;
          cursor: pointer;
        }
        .stuffus-product-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--primary);
        }
        
        /* Category Tag */
        .category-tag {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: var(--bg-main);
          color: var(--accent);
          border: 1.5px solid var(--accent);
          font-size: 0.6rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          z-index: 10;
        }

        /* Image Area */
        .card-image-wrapper {
          width: 100%;
          aspect-ratio: 1/1;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-main);
          border-radius: 12px;
          overflow: hidden;
        }
        .card-image-wrapper img {
          max-width: 85%;
          max-height: 85%;
          object-fit: contain;
          transition: transform 0.5s ease;
        }
        .stuffus-product-card:hover .card-image-wrapper img {
          transform: scale(1.05);
        }

        /* Content */
        .card-info { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
        .card-title {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--accent);
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .card-rating {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-weight: 600;
        }
        .star-icon { color: var(--accent); font-size: 0.75rem; }
        
        .card-price {
          font-size: 0.95rem;
          font-weight: 900;
          color: var(--accent);
          margin: 0.2rem 0 0.1rem 0;
        }
        .card-price-converted {
          font-size: 0.7rem;
          color: var(--text-secondary);
          font-weight: 600;
          margin-bottom: 0.6rem;
        }

        /* Actions */
        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-top: auto;
        }
        .btn-stuffus {
          border: none;
          border-radius: 6px;
          padding: 0.5rem 0.3rem;
          font-size: 0.65rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          text-align: center;
        }
        .btn-add-to-chart {
          background: transparent;
          color: var(--text-primary);
          border: 1.5px solid var(--accent);
        }
        .btn-add-to-chart:hover {
          background: var(--accent);
          color: white;
        }
        .btn-buy-now {
          background: var(--primary);
          color: white;
        }
        .btn-buy-now:hover {
          background: var(--primary-light);
          transform: scale(1.02);
        }
        /* Mobile Simplification */
        @media (max-width: 768px) {
          .stuffus-product-card { 
            padding: 0; 
            border-radius: 20px; 
            aspect-ratio: 1 / 1.25; 
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            overflow: hidden;
            background: var(--bg-card);
            box-shadow: var(--shadow-md);
          }
          .category-tag, .star-icon, .card-rating, .card-actions { display: none !important; }
          .card-image-wrapper { background: var(--bg-main); margin-bottom: 0; border-radius: 0; height: 65%; width: 100%; flex: 0 0 auto; overflow: hidden; position: relative; }
          .card-image-wrapper img { width: 100% !important; height: 100% !important; object-fit: cover !important; position: absolute; top: 0; left: 0; max-width: none !important; max-height: none !important; }
          .card-title { font-size: 0.8rem; font-weight: 700; color: var(--accent); -webkit-line-clamp: 2; display: -webkit-box; -webkit-box-orient: vertical; overflow: hidden; margin-top: 0.5rem; margin-bottom: 0.2rem; padding: 0 0.6rem; min-height: 2.2em; line-height: 1.1; }
          .card-price { font-size: 0.9rem; margin-top: auto; font-weight: 800; color: var(--accent); padding: 0 0.6rem 0.6rem; }
          .card-info { flex: 1; display: flex; flex-direction: column; }
        }
      `}</style>

      <Link href={`/shop/${product.slug}`} className="stuffus-card-link-wrapper" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <span className="category-tag">{categoryTag}</span>
        
        <div className="card-image-wrapper">
          <img 
            src={product.image_urls?.[0] || 'https://via.placeholder.com/400x400/0a0a0a/c4a962?text=Premium+Goods'} 
            alt={product.name} 
          />
        </div>

        <div className="card-info">
          <h3 className="card-title">{product.name}</h3>
          <div className="card-rating">
            <span className="star-icon">★</span>
            <span>{mockRating} ({mockReviews / 1000 >= 1 ? `${(mockReviews/1000).toFixed(1)}k` : mockReviews} Reviews)</span>
          </div>
          <div className="card-price" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{formatPrice(product.price).usd}</span>
            {product.min_quantity > 1 && (
              <span style={{ fontSize: '0.65rem', background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                Min. {product.min_quantity}
              </span>
            )}
          </div>
          <div className="card-price-converted">
            {formatPrice(product.price).eur} | {formatPrice(product.price).gbp}
          </div>
        </div>
      </Link>

      <div className="card-actions">
        <button className="btn-stuffus btn-add-to-chart" onClick={handleAddToCart}>
          Add to Cart
        </button>
        <button className="btn-stuffus btn-buy-now" onClick={handleBuyNow}>
          Buy Now
        </button>
      </div>
    </div>
  );
}

export { STRAIN_ICONS };
