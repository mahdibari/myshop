'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@supabase/supabase-js';
import { ShoppingCart, Phone, MapPin, MailCheck } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CheckoutAllPage() {
  const { cartItems, totalPrice, clearCart } = useCart();

  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0)
    return (
      <div className="p-10 text-center text-gray-600 bg-white rounded-xl shadow mt-10">
        <h2 className="text-2xl font-semibold mb-4">سبد خرید شما خالی است 🛒</h2>
        <p className="text-gray-500">لطفاً ابتدا محصولاتی به سبد اضافه کنید.</p>
      </div>
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!phone || !postalCode || !address) {
      setError('لطفا تمام فیلدها را تکمیل کنید.');
      return;
    }

    setLoading(true);

    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        setError('لطفا ابتدا وارد شوید.');
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

      setSuccessMsg('سفارش شما با موفقیت ثبت شد 🎉');
      clearCart();
    } catch (err: any) {
      setError(err.message || 'خطایی رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto p-6 md:p-10 bg-white rounded-2xl shadow-lg mt-8">
      <h1 className="text-3xl font-extrabold text-center mb-10 text-pink-600 flex items-center justify-center gap-2">
        <ShoppingCart className="w-7 h-7" /> پرداخت نهایی
      </h1>

      <section className="bg-gray-50 rounded-xl p-6 mb-8 shadow-inner">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">خلاصه سفارش</h2>
        <ul className="divide-y divide-gray-200">
          {cartItems.map(item => {
            const pricePerUnit = item.discount_percentage
              ? item.price * (1 - item.discount_percentage / 100)
              : item.price;
            return (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    قیمت: {pricePerUnit.toLocaleString('fa-IR')} × {item.quantity}
                  </p>
                </div>
                <p className="font-bold text-pink-600">
                  {(pricePerUnit * item.quantity).toLocaleString('fa-IR')} تومان
                </p>
              </li>
            );
          })}
        </ul>
        <p className="text-right text-lg font-bold mt-6">
          جمع کل: <span className="text-pink-600">{totalPrice.toLocaleString('fa-IR')} تومان</span>
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-semibold">شماره تماس</label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="مثلاً: 09121234567"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">کد پستی</label>
          <div className="relative">
            <MailCheck className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              className="w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="کد پستی"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold">آدرس</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full border rounded-lg px-10 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="آدرس دقیق"
              rows={3}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-600 font-medium">{error}</p>}
        {successMsg && <p className="text-green-600 font-medium">{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-pink-700 text-white py-3 rounded-xl text-lg font-semibold hover:from-pink-600 hover:to-pink-800 transition-all duration-200"
        >
          {loading ? 'در حال ثبت سفارش...' : 'ثبت نهایی سفارش'}
        </button>
      </form>
    </main>
  );
}

