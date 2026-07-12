import { newsreader, inter } from './fonts';
import './globals.css';

export const metadata = {
  title: 'CompliantScan — Accessibility reports that win client trust',
  description:
    'CompliantScan helps agencies find WCAG 2.2 issues, communicate impact clearly, and deliver accessibility improvements with confidence.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}