import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import ClientLayout from '../components/ClientLayout';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ELARA SILVER | Crafted for Eternity',
  description: 'Experience the art of luxury silver jewellery. Cinematic design, handcrafted 925 sterling silver rings, and timeless elegance.',
  openGraph: {
    title: 'ELARA SILVER | Crafted for Eternity',
    description: 'Experience the art of luxury silver jewellery.',
    type: 'website',
  },
};

import { AuthProvider } from '../context/AuthContext';

import { ProductsProvider } from '../context/ProductsContext';
import { PricingProvider } from '../components/PricingProvider';
import { FaqProvider } from '../context/FaqContext';
import { CategoriesProvider } from '../context/CategoriesContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} light`} suppressHydrationWarning>
      <body className={`${outfit.className} bg-[#ffffff] text-black overflow-x-hidden antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <PricingProvider>
            <ProductsProvider>
              <WishlistProvider>
                <CartProvider>
                  <FaqProvider>
                    <CategoriesProvider>
                      <ClientLayout>{children}</ClientLayout>
                    </CategoriesProvider>
                  </FaqProvider>
                </CartProvider>
              </WishlistProvider>
            </ProductsProvider>
          </PricingProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
