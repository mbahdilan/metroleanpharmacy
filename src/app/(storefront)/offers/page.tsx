import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Great Offers & Promotions - +Pharmacy',
  description: 'Shop the latest deals and discounts on vitamins, skincare, pain relief, and daily essentials.',
};

export default function OffersPage() {
  const deals = [
    { title: 'Buy 1 Get 1 Free', category: 'Vitamins', code: 'VITAMINSBOGO' },
    { title: '20% Off Skincare', category: 'Skincare', code: 'SKIN20' },
    { title: 'Free Delivery over $40', category: 'Delivery', code: 'FREEDEL40' },
  ];

  return (
    <div style={{ padding: '8rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <p style={{ color: 'white', background: 'var(--error)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '50px', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '1px' }}>SALE NOW ON</p>
        <h1 style={{ fontSize: '3rem', color: 'var(--primary-dark)', margin: '1rem 0' }}>Great Offers</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Discover our latest deals and stock up on your health essentials for less.
        </p>
      </header>

      <section style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {deals.map((deal, idx) => (
             <div key={idx} style={{ background: 'var(--accent-light)', padding: '2.5rem', borderRadius: '16px', border: '2px dashed var(--accent)', textAlign: 'center' }}>
               <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.9rem', textTransform: 'uppercase' }}>{deal.category}</span>
               <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-dark)', margin: '1rem 0' }}>{deal.title}</h2>
               <div style={{ background: 'white', display: 'inline-block', padding: '0.8rem 1.5rem', borderRadius: '8px', fontSize: '1.1rem', fontWeight: 700, border: '1px solid var(--border)' }}>
                 Code: {deal.code}
               </div>
             </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: 'center' }}>
        <Link href="/shop" className="btn-primary" style={{ padding: '1rem 3rem', borderRadius: '50px', fontSize: '1.1rem' }}>Shop All Products</Link>
      </div>
    </div>
  );
}
