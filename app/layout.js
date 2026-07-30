import { newsreader, inter } from './fonts';
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'CompliantScan — Accessibility reports that win client trust',
  description:
    'CompliantScan helps agencies find WCAG 2.2 issues, communicate impact clearly, and deliver accessibility improvements with confidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body>
        <Script id="oauth-return-bridge" strategy="beforeInteractive">
          {`
            (function () {
              var hash = window.location.hash || '';
              var search = window.location.search || '';
              var hasOAuthResponse =
                /(?:^|[#&])(access_token|refresh_token|error|error_description)=/.test(hash) ||
                /(?:^|[?&])(code|error|error_description)=/.test(search);

              if (!hasOAuthResponse) return;

              var isCallback = window.location.pathname.indexOf('/auth/callback') === 0;
              var isVercelFallback = window.location.hostname.endsWith('.vercel.app');
              var popupQuery = search.indexOf('popup=1') !== -1
                ? search
                : (search ? search + '&popup=1' : '?popup=1');

              if (isVercelFallback) {
                window.location.replace(
                  'https://www.compliantscan.com/auth/callback' + popupQuery + hash
                );
                return;
              }

              if (!isCallback) {
                window.location.replace('/auth/callback' + popupQuery + hash);
              }
            })();
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
