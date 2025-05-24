'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingCart, FiUser } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const { cartItems } = useCart();

  // مجموع quantity آیتم‌ها
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">

          {/* بخش راست: لینک‌ها */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-pink-600 whitespace-nowrap">
              فروشگاه لوازم آرایشی
            </Link>
            <div className="hidden md:flex items-center gap-5">
              <Link href="/products" className="text-gray-600 hover:text-gray-900">
                محصولات
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                درباره ما
              </Link>
              <Link href="/contactus" className="text-gray-600 hover:text-gray-900">
                تماس با ما
              </Link>
              <Link href="/support" className="text-gray-600 hover:text-gray-900">
                پشتیبانی
              </Link>
               <Link href="/trak-order" className="text-gray-600 hover:text-gray-900">
                پیگیری سفارش
              </Link>
            </div>
          </div>

          {/* بخش چپ: آیکون‌ها */}
          <div className="flex items-center gap-6">
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <Link href="/account" className="text-gray-600 hover:text-gray-900">
                <FiUser size={24} />
              </Link>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                ورود
              </Link>
            )}
          </div>

        </div>
      </nav>
    </header>
  );
}
