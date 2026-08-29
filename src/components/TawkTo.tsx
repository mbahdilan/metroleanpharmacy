'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function TawkTo() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const loaded = useRef(false);

  useEffect(() => {
    const Tawk_API = ((window as any).Tawk_API ||= {});

    if (isAdmin) {
      Tawk_API.hideWidget?.();
      return;
    }

    if (loaded.current) {
      Tawk_API.showWidget?.();
      return;
    }
    loaded.current = true;

    // Tawk.to Script
    var s1 = document.createElement('script');
    var s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69d2b1b79680621c33789fe2/1jlfgce3n';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0?.parentNode?.insertBefore(s1, s0);
  }, [isAdmin]);

  return null;
}
