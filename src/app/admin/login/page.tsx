'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: 'var(--bg-main)',
      padding: '2rem'
    }}>
      <div className="checkout-section" style={{ 
        maxWidth: '400px', 
        width: '100%', 
        background: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}>🔐</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Authorized Administrator Access Only
          </p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="clinical-warning-banner" style={{ padding: '0.75rem', marginBottom: '1.5rem' }}>
              <span className="warning-text" style={{ fontSize: '0.85rem' }}>{error}</span>
            </div>
          )}

          <div className="form-group full-width">
            <label className="form-label">Administrator Email</label>
            <input 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="admin@medisyrup.com"
            />
          </div>

          <div className="form-group full-width" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Secure Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '2.5rem' }} 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Access Admin Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            ← Return to Store
          </Link>
        </div>
      </div>
    </div>
  );
}
