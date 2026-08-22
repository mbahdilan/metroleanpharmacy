import type { Metadata } from 'next';
import Script from 'next/script';
import TawkTo from '@/components/TawkTo';
import AnnouncementPopup from '@/components/AnnouncementPopup';
import './globals.css';

export const metadata: Metadata = {
  title: 'Metrolean-Pharma Health Tips',
  description: 'Evidence-based medication guides plus a trusted shop for everyday OTC pharmacy essentials.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <AnnouncementPopup />
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {`window.gtranslateSettings = {"default_language":"en","native_language_names":true,"detect_browser_language":false,"languages":["en","fr","it","es","ru","de","sq"],"wrapper_selector":".gtranslate_wrapper","flag_size":16,"switcher_open_direction":"top","flag_style":"rectangle","alt_flags":{"en":"usa"}}`}
        </Script>
        <Script src="https://cdn.gtranslate.net/widgets/latest/dwf.js" strategy="afterInteractive" defer />
        <Script id="buttonizer-script" strategy="afterInteractive">
          {`(function(n,t,c,d){if (t.getElementById(d)){return;};var o=t.createElement("script");o.id=d;o.async=!0,o.src="https://cdn.buttonizer.io/embed.js",o.onload=function(){window.Buttonizer.init(c)},t.head.appendChild(o)})(window,document,"85565231-6ee6-43ef-9525-f3849619bbab", "buttonizer_script");`}
        </Script>
        {/* Hidden GTranslate anchor — required for the CDN script to initialize */}
        <div className="gtranslate_wrapper" style={{ display: 'none' }} />
        <TawkTo />
      </body>
    </html>
  );
}
