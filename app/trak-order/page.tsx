
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, Clock, PackageSearch, Phone } from 'lucide-react';

export default function TrackOrderPage() {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError('');
    setOrder(null);

    let data = null;
    let fetchError = null;

    // اگر عدد بود اول با id امتحان کن
    if (!isNaN(Number(input))) {
      const { data: idData, error: idError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:product_id (
              name
            )
          )
        `)
        .eq('id', Number(input))
        .limit(1)
        .maybeSingle();

      data = idData;
      fetchError = idError;
    }

    // اگر چیزی پیدا نشد، با phone امتحان کن
    if (!data) {
      const { data: phoneData, error: phoneError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:product_id (
              name
            )
          )
        `)
        .eq('phone', input)
        .order('created_at', { ascending: false }) // جدیدترین سفارش رو بیاره
        .limit(1)
        .maybeSingle();

      data = phoneData;
      fetchError = phoneError;
    }

    if (fetchError || !data) {
      setError('سفارشی با این مشخصات یافت نشد.');
    } else {
      setOrder(data);
    }

    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <PackageSearch className="w-8 h-8" />
          پیگیری سفارش
        </h1>
        <p className="mt-2 text-sm">کد سفارش یا شماره تماس را وارد کنید</p>
      </div>

      <div className="bg-white p-6 shadow-lg rounded-b-xl -mt-2">
        <div className="flex gap-2 mb-4 mt-4">
          <input
            type="text"
            placeholder="کد سفارش یا شماره تماس"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            disabled={!input || loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'جستجو...' : 'جستجو'}
          </button>
        </div>

        {error && <p className="text-red-600 text-center">{error}</p>}

        {order && (
          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 rounded-xl p-5 border shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-3">🧾 مشخصات سفارش</h2>
              <p><strong>کد سفارش:</strong> <span className="text-gray-700">{order.id}</span></p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <strong>شماره تماس:</strong> <span className="text-gray-700">{order.phone}</span>
              </p>
              <p><strong>آدرس:</strong> <span className="text-gray-700">{order.address}</span></p>
              <p><strong>تاریخ ثبت سفارش:</strong>{' '}
                <span className="text-gray-700">
                  {new Date(order.created_at).toLocaleDateString('fa-IR')}
                </span>
              </p>
              <p className="mt-2">
                <strong>وضعیت ارسال:</strong>{' '}
                {order.shipped ? (
                  <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 py-1 rounded-full text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    ارسال شده
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    در حال ارسال / پیگیری
                  </span>
                )}
              </p>
            </div>

            <div className="bg-white rounded-xl border p-5 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-3">🛍 آیتم‌های سفارش</h2>
              <ul className="space-y-3">
                {order.order_items.map((item: any) => (
                  <li
                    key={item.id}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm text-sm"
                  >
                    <p><strong>محصول:</strong> {item.product?.name}</p>
                    <p><strong>تعداد:</strong> {item.quantity}</p>
                    <p><strong>قیمت واحد:</strong> {item.price.toLocaleString()} تومان</p>
                    <p><strong>جمع کل:</strong> {(item.price * item.quantity).toLocaleString()} تومان</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


