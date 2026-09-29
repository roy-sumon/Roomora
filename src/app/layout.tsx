import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';

const cormorant = Cormorant_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Roomora — Interactive Interior Living Spaces',
  description: 'An immersive editorial shopping experience. Explore curated spaces and discover physical architectural pieces directly within the room.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#0E0D0C] text-[#F3EFEA] font-sans selection:bg-[#C5A880]/30 selection:text-[#FFFDF8] overflow-x-hidden">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
