import type { Metadata } from 'next';
import Script from 'next/script';
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
        <Script id="smartsupp-script" strategy="afterInteractive">
          {`
            var _smartsupp = _smartsupp || {};
            _smartsupp.key = '593a113e71ef15928c1a48b851aaa6593995cc33';
            window.smartsupp||(function(d) {
              var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
              s=d.getElementsByTagName('script')[0];c=d.createElement('script');
              c.type='text/javascript';c.charset='utf-8';c.async=true;
              c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
            })(document);
          `}
        </Script>
        <noscript>Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a></noscript>
      </body>
    </html>
  );
}
