'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  // مجموع quantity آیتم‌ها
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  // تابع برای باز/بسته کردن منو
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // وقتی منو بازه و کاربر روی یکی از لینک‌ها کلیک کرد، منو بسته شود
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center flex-wrap gap-4">

          {/* بخش راست: لوگو + لینک‌ها در دسکتاپ */}
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-pink-600 whitespace-nowrap">
             پرشین بیوتی
            </Link>
            

            {/* لینک‌ها در حالت دسکتاپ */}
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

          {/* بخش چپ: آیکون‌ها + منوی موبایل */}
          <div className="flex items-center gap-6">

            {/* آیکون سبد خرید */}
            <Link href="/cart" className="text-gray-600 hover:text-gray-900 relative">
              <FiShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* ورود یا حساب کاربری */}
            {user ? (
              <Link href="/account" className="text-gray-600 hover:text-gray-900">
                <FiUser size={24} />
              </Link>
            ) : (
              <Link href="/auth" className="text-gray-600 hover:text-gray-900">
                ورود
              </Link>
            )}

            {/* دکمه منوی موبایل */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
            </button>
          </div>
        </div>

        {/* منوی موبایل که وقتی menuOpen === true نمایش داده می‌شود */}
        {menuOpen && (
          <div className="md:hidden mt-4 flex flex-col gap-3 border-t border-gray-200 pt-4">
            <Link href="/products" className="text-gray-600 hover:text-gray-900" onClick={closeMenu}>
              محصولات
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900" onClick={closeMenu}>
              درباره ما
            </Link>
            <Link href="/contactus" className="text-gray-600 hover:text-gray-900" onClick={closeMenu}>
              تماس با ما
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-gray-900" onClick={closeMenu}>
              پشتیبانی
            </Link>
            <Link href="/trak-order" className="text-gray-600 hover:text-gray-900" onClick={closeMenu}>
              پیگیری سفارش
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

