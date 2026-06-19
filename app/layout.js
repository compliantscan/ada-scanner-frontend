import './globals.css';

export const metadata = {
  title: 'ADA Scanner',
  description: 'Scan your website for ADA violations free before a lawyer does it for you.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
