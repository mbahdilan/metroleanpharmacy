'use client';

import ProductForm from '@/components/Admin/ProductForm';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AddProductContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'Others';

  return (
    <div style={{ paddingTop: '80px', paddingBottom: '100px' }} className="section">
      <style>{`
        .add-nav-header { display: flex; align-items: center; margin-bottom: 3rem; position: relative; }
        .back-link { 
          text-decoration: none; color: var(--text-primary); font-weight: 700; 
          display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s;
        }
        .back-link:hover { transform: translateX(-5px); }
        
        .progress-steps {
          display: flex; justify-content: space-between; align-items: center;
          margin: 0 auto; max-width: 400px; width: 100%; position: relative;
          padding: 1rem 0;
        }
        .progress-line {
          position: absolute; top: 50%; left: 0; right: 0;
          height: 2px; background: var(--border); z-index: 1; transform: translateY(-50%);
        }
        .progress-line-active {
          position: absolute; top: 50%; left: 0; width: 50%;
          height: 2px; background: var(--primary); z-index: 2; transform: translateY(-50%);
        }
        .step-node {
          width: 30px; height: 30px; border-radius: 50%; background: white;
          border: 2px solid var(--border); z-index: 3; display: flex;
          align-items: center; justify-content: center; position: relative;
        }
        .step-node.active { border-color: var(--primary); background: var(--primary); color: white; }
        .step-node.completed { border-color: var(--primary); background: white; color: var(--primary); }
        .step-label {
          position: absolute; top: 35px; left: 50%; transform: translateX(-50%);
          font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--text-muted);
          white-space: nowrap; letter-spacing: 0.05em;
        }
        .step-node.active .step-label { color: var(--text-primary); }

        @media (max-width: 600px) {
          .add-nav-header { flex-direction: column; align-items: flex-start; gap: 2rem; }
          .progress-steps { max-width: 100%; }
        }
      `}</style>

      <div className="add-nav-header">
        <Link href="/admin" className="back-link">
          <span style={{ fontSize: '1.2rem' }}>‹</span> Back
        </Link>
        
        <div className="progress-steps">
          <div className="progress-line"></div>
          <div className="progress-line-active"></div>
          
          <div className="step-node completed">
            <span style={{ fontSize: '0.8rem' }}>✓</span>
            <span className="step-label">Category</span>
          </div>
          <div className="step-node active">
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }}></div>
            <span className="step-label">Details</span>
          </div>
          <div className="step-node">
            <span className="step-label">Done</span>
          </div>
        </div>
      </div>

      <ProductForm category={category} />
    </div>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={<div className="section" style={{ paddingTop: '100px' }}><div className="spinner" /></div>}>
      <AddProductContent />
    </Suspense>
  );
}
