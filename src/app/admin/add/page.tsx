'use client';

import ProductForm from '@/components/Admin/ProductForm';
import Link from 'next/link';

export default function AddProductPage() {
  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px' }} className="section">
      <div style={{ marginBottom: '2.5rem' }}>
        <Link href="/admin" style={{ color: 'var(--primary)', fontWeight: 700 }}>← Back to Products</Link>
        <h1 style={{ marginTop: '1rem' }}>Add Product</h1>
      </div>
      <ProductForm />
    </div>
  );
}
