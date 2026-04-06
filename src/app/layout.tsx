import type { Metadata } from 'next';
import Script from 'next/script';
import TawkTo from '@/components/TawkTo';
import './globals.css';
// Global imports

export const metadata: Metadata = {
  title: 'Metrolean Pharmacy — Your Local Online Pharmacy',
  description: 'From everyday essentials and prescriptions to health advice and great offers. We are here to support your healthy lifestyle.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <Script id="gtranslate-settings" strategy="afterInteractive">
          {`window.gtranslateSettings = {"default_language":"en","native_language_names":true,"detect_browser_language":true,"languages":["en","de","es","fr"],"wrapper_selector":".gtranslate_wrapper","flag_size":16}`}
        </Script>
        <Script src="https://cdn.gtranslate.net/widgets/latest/popup.js" strategy="afterInteractive" defer />
        <Script id="buttonizer-script" strategy="afterInteractive">
          {`(function(n,t,c,d){if (t.getElementById(d)){return;};var o=t.createElement("script");o.id=d;o.async=!0,o.src="https://cdn.buttonizer.io/embed.js",o.onload=function(){window.Buttonizer.init(c)},t.head.appendChild(o)})(window,document,"85565231-6ee6-43ef-9525-f3849619bbab", "buttonizer_script");`}
        </Script>
        <TawkTo />
      </body>
    </html>
  );
}
