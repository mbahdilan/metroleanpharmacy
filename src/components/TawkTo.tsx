'use client';

import { useEffect } from 'react';

export default function TawkTo() {
  useEffect(() => {
    // Tawk.to Script
    var Tawk_API = (window as any).Tawk_API || {};
    var Tawk_LoadStart = new Date();
    (window as any).Tawk_API = Tawk_API;

    var s1 = document.createElement('script');
    var s0 = document.getElementsByTagName('script')[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/69d2b1b79680621c33789fe2/1jlfgce3n';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0?.parentNode?.insertBefore(s1, s0);

    return () => {
      // Cleanup on unmount
      s1.remove();
    };
  }, []);

  return null;
}
