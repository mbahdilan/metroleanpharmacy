'use client';

import Link from 'next/link';
import { Product } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

const CLINICAL_ICONS: Record<string, string> = {
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
          background: white;
          border-radius: 16px;
          padding: 0.75rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #f1f5f9;
          height: 100%;
          cursor: pointer;
        }
        .stuffus-product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          border-color: #e2e8f0;
        }
        
        /* Category Tag */
        .category-tag {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: #f8fafc;
          color: #64748b;
          font-size: 0.6rem;
          font-weight: 700;
          padding: 2px 8px;
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
          background: #fbfcfe;
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
          color: #1e293b;
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
          color: #94a3b8;
          font-weight: 600;
        }
        .star-icon { color: #f59e0b; font-size: 0.75rem; }
        
        .card-price {
          font-size: 0.95rem;
          font-weight: 900;
          color: #0f172a;
          margin: 0.2rem 0 0.6rem 0;
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
          background: white;
          color: #1e293b;
          border: 1.5px solid #e2e8f0;
        }
        .btn-add-to-chart:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }
        .btn-buy-now {
          background: #0f172a;
          color: white;
        }
        .btn-buy-now:hover {
          background: #1e293b;
          transform: scale(1.02);
        }
        /* Mobile Simplification */
        @media (max-width: 768px) {
          .stuffus-product-card { padding: 0.5rem; border-radius: 20px; }
          .category-tag, .card-rating, .card-actions { display: none !important; }
          .card-image-wrapper { background: #f3f4f6; margin-bottom: 0.5rem; border-radius: 16px; }
          .card-title { font-size: 0.85rem; height: auto; -webkit-line-clamp: 1; margin-bottom: 2px; padding: 0 0.2rem; }
          .card-price { font-size: 0.9rem; margin: 0; font-weight: 800; padding: 0 0.2rem; }
          .card-info { gap: 1px; }
        }
      `}</style>

      <Link href={`/shop/${product.slug}`} className="stuffus-card-link-wrapper" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <span className="category-tag">{categoryTag}</span>
        
        <div className="card-image-wrapper">
          <img 
            src={product.image_urls?.[0] || 'https://via.placeholder.com/400x400?text=Premium+Medication'} 
            alt={product.name} 
          />
        </div>

        <div className="card-info">
          <h3 className="card-title">{product.name}</h3>
          <div className="card-rating">
            <span className="star-icon">★</span>
            <span>{mockRating} ({mockReviews / 1000 >= 1 ? `${(mockReviews/1000).toFixed(1)}k` : mockReviews} Reviews)</span>
          </div>
          <div className="card-price">
            ${parseFloat(product.price).toFixed(2)}
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

export { CLINICAL_ICONS };
