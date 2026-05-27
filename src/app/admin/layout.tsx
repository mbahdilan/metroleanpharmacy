'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // If we are on the login page, don't protect it
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setAuthenticated(false);
        router.push('/admin/login');
      } else {
        setAuthenticated(true);
      }
      setLoading(false);
    }

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && pathname !== '/admin/login') {
        setAuthenticated(false);
        router.push('/admin/login');
      } else if (session) {
        setAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner" />
      </div>
    );
  }

  // If not authenticated and not on login page, don't show children (redirect happening)
  if (!authenticated && pathname !== '/admin/login') {
    return null;
  }

  return <>{children}</>;
}
