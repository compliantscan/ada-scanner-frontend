import { newsreader, inter } from './fonts';
import './globals.css';

export const metadata = {
  title: 'CompliantScan — Accessibility reports that win client trust',
  description:
    'CompliantScan helps agencies find WCAG 2.2 issues, communicate impact clearly, and deliver accessibility improvements with confidence.',
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/compliantscan-mark.png', type: 'image/png' },
    ],
    shortcut: '/logo-top.png',
    apple: '/logo-top.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}