import './globals.css';
import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from '@/context/CartContext';

const vazir = Vazirmatn({ subsets: ['arabic'] });

export const metadata: Metadata = {
  title: '50314374',
  description: 'فروشگاه آنلاین محصولات آرایشی و بهداشتی',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </CartProvider>
      </body>
    </html>
  );
}


