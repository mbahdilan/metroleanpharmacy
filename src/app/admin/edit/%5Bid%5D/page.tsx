'use client';

import { useEffect, useState, use } from 'react';
import { supabase, Product } from '@/lib/supabase';
import ProductForm from '@/components/Admin/ProductForm';
import Link from 'next/link';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="spinner" />;
  if (!product) return <div>Record not found.</div>;

  return (
    <div style={{ paddingTop: '100px', paddingBottom: '100px' }} className="section">
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ color: 'var(--primary)', fontWeight: 700 }}>
          ← Back to Inventory
        </Link>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
