'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext'; // اطمینان حاصل کنید که مسیر صحیح است
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, Phone, MapPin, MailCheck, CheckCircle, XCircle } from 'lucide-react'; // Added CheckCircle and XCircle icons
import { motion, AnimatePresence } from 'framer-motion'; // Import motion and AnimatePresence
import Link from 'next/link'; // <--- این خط اضافه شد

// Supabase client initialization (مطمئن شوید که متغیرهای محیطی در Netlify تنظیم شده‌اند)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CheckoutAllPage() {
  const { cartItems, totalPrice, clearCart } = useCart();

  // State variables for form inputs and messages
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null); // Changed to string | null
  const [loading, setLoading] = useState(false);
  // New state to control the visibility of the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // If cart is empty, display a message
  if (cartItems.length === 0 && !showSuccessModal) // Only show empty cart message if modal is not active
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg text-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-pink-600">سبد خرید شما خالی است 🛒</h2>
        <p className="text-lg mb-8">لطفاً ابتدا محصولاتی به سبد اضافه کنید.</p>
        <Link href="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            رفتن به فروشگاه
          </motion.button>
        </Link>
      </motion.div>
    );

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null); // Clear previous errors
    setShowSuccessModal(false); // Ensure modal is hidden before new submission

    // --- Start of Validation Logic ---
    if (!phone || !postalCode || !address) {
      setError('لطفاً تمام فیلدها را تکمیل کنید.');
      return;
    }

    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(phone)) {
      setError('شماره تماس معتبر نیست. (مثلاً: 09123456789)');
      return;
    }

    const postalCodeRegex = /^\d{10}$/;
    if (!postalCodeRegex.test(postalCode)) {
      setError('کد پستی معتبر نیست. (باید 10 رقم و فقط عدد باشد)');
      return;
    }
    // --- End of Validation Logic ---

    setLoading(true); // Set loading state to true

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;

      if (sessionError || !token) {
        setError('برای ثبت سفارش، لطفاً ابتدا وارد شوید یا ثبت نام کنید.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/orders/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          phone,
          postalCode,
          address,
          items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.discount_percentage
              ? item.price * (1 - item.discount_percentage / 100)
              : item.price,
          })),
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'خطا در ثبت سفارش');
      }

      // On successful order, show the success modal and clear cart
      setShowSuccessModal(true); // Show the success modal
      clearCart(); // Clear the cart after successful order
      setPhone(''); // Clear form fields
      setPostalCode('');
      setAddress('');
    } catch (err: unknown) { // Changed 'any' to 'unknown' for better type safety
      const errorMessage = err instanceof Error ? err.message : 'خطایی ناشناخته رخ داده است';
      setError(errorMessage);
    } finally {
      setLoading(false); // Always set loading to false after operation
    }
  };

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto p-6 md:p-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl mt-8 mb-12 relative border border-gray-100"
    >
      <h1 className="text-4xl font-extrabold text-center mb-12 text-purple-700 flex items-center justify-center gap-3">
        <ShoppingCart className="w-9 h-9 text-indigo-500" /> پرداخت نهایی
      </h1>

      <motion.section 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-indigo-50 rounded-2xl p-6 mb-10 shadow-inner border border-indigo-100"
      >
        <h2 className="text-2xl font-bold mb-5 border-b-2 border-indigo-200 pb-3 text-indigo-800">
          خلاصه سفارش
        </h2>
        <ul className="divide-y divide-indigo-200">
          {cartItems.map(item => {
            const pricePerUnit = item.discount_percentage
              ? item.price * (1 - item.discount_percentage / 100)
              : item.price;
            return (
              <li key={item.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    قیمت واحد: {pricePerUnit.toLocaleString('fa-IR')} تومان × {item.quantity}
                    {item.discount_percentage && (
                      <span className="line-through text-gray-400 ml-2 text-xs">
                        {item.price.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </p>
                </div>
                <p className="font-bold text-purple-700 text-xl mt-2 sm:mt-0">
                  {(pricePerUnit * item.quantity).toLocaleString('fa-IR')} تومان
                </p>
              </li>
            );
          })}
        </ul>
        <p className="text-right text-2xl font-extrabold mt-8 pt-4 border-t-2 border-indigo-200">
          جمع کل: <span className="text-pink-600">{totalPrice.toLocaleString('fa-IR')} تومان</span>
        </p>
      </motion.section>

      <motion.form 
        onSubmit={handleSubmit} 
        className="space-y-7"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div>
          <label htmlFor="phone" className="block mb-2 font-semibold text-gray-700">شماره تماس</label>
          <div className="relative">
            <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-3 focus:ring-pink-300 transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="مثلاً: 09121234567"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="postalCode" className="block mb-2 font-semibold text-gray-700">کد پستی</label>
          <div className="relative">
            <MailCheck className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-3 focus:ring-pink-300 transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="کد پستی (10 رقمی)"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block mb-2 font-semibold text-gray-700">آدرس</label>
          <div className="relative">
            <MapPin className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              id="address"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-3 focus:ring-pink-300 transition-all duration-200 text-gray-800 placeholder-gray-400"
              placeholder="آدرس دقیق و کامل"
              rows={4}
              required
            />
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 text-red-800 p-3 rounded-lg flex items-center gap-2 font-medium shadow-sm border border-red-200"
            >
              <XCircle className="w-5 h-5" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(236, 72, 153, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-pink-500 to-red-600 text-white py-4 rounded-xl text-xl font-bold hover:from-pink-600 hover:to-red-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
        </motion.button>
      </motion.form>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center transform border border-gray-200 relative"
            >
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-8 animate-bounce-in" />
              <h2 className="text-4xl font-extrabold text-gray-800 mb-5">سفارش شما تکمیل شد! 🎉</h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                با تشکر از خرید شما. سفارش شما با موفقیت ثبت شد.
                <br />
                لطفاً منتظر تماس ادمین‌های ما برای هماهنگی‌های نهایی باشید.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSuccessModal(false)} // Close the modal
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white py-4 rounded-xl text-xl font-bold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg"
              >
                متوجه شدم
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}

