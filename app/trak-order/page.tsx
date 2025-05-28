'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // اطمینان حاصل کنید که مسیر صحیح است
import { CheckCircle2, Clock, PackageSearch, Phone, Search, XCircle, Loader2, ShoppingCart } from 'lucide-react'; // XCircle, Loader2 و ShoppingCart اضافه شدند
import { motion, AnimatePresence } from 'framer-motion'; // Framer Motion اضافه شد
import toast from 'react-hot-toast'; // Toast اضافه شد

// تعریف رابط برای آیتم‌های سفارش
interface OrderItem {
  id: number; // فرض می‌کنیم id از نوع number است
  quantity: number;
  price: number;
  product?: { name: string }; // product می‌تواند undefined باشد
}

// تعریف رابط برای سفارش
interface Order {
  id: number; // فرض می‌کنیم id از نوع number است
  address: string;
  phone: string;
  postal_code: string;
  created_at: string;
  shipped?: boolean; // shipped می‌تواند undefined باشد
  order_items: OrderItem[];
}

export default function TrackOrderPage() {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState<Order | null>(null); // نوع را به Order | null تغییر دادیم
  const [error, setError] = useState<string | null>(null); // نوع را به string | null تغییر دادیم
  const [loading, setLoading] = useState(false);

  async function handleSearch() {
    setLoading(true);
    setError(null); // خطا را پاک می‌کنیم
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
            product:products (
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
            product:products (
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
      toast.error('سفارشی با این مشخصات یافت نشد.'); // نمایش toast خطا
    } else {
      setOrder(data as Order); // Cast به نوع Order
      toast.success('سفارش با موفقیت یافت شد!'); // نمایش toast موفقیت
    }

    setLoading(false);
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-8 flex flex-col items-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl w-full bg-gradient-to-r from-blue-600 to-purple-700 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center mb-6 sm:mb-8 border border-blue-500" // پدینگ و مارجین ریسپانسیو
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-2"> {/* اندازه فونت و چینش ریسپانسیو */}
          <PackageSearch className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" /> {/* اندازه آیکون ریسپانسیو */}
          پیگیری سفارش
        </h1>
        <p className="mt-2 text-base sm:text-lg font-light">کد سفارش یا شماره تماس خود را وارد کنید</p> {/* اندازه فونت ریسپانسیو */}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="max-w-2xl w-full bg-white p-6 sm:p-8 shadow-xl rounded-3xl border border-gray-100 flex flex-col items-center" // پدینگ ریسپانسیو
      >
        <div className="flex flex-col sm:flex-row w-full gap-3 mb-6 relative"> {/* flex-col در موبایل */}
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" /> {/* اندازه آیکون ریسپانسیو */}
          <input
            type="text"
            placeholder="کد سفارش یا شماره تماس (مثلاً: 12345 یا 09123456789)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow px-5 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-purple-400 transition-all duration-200 text-gray-800 placeholder-gray-400 text-base sm:text-lg" // اندازه فونت ریسپانسیو
          />
          <motion.button
            onClick={handleSearch}
            disabled={!input || loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-3 sm:mt-0" // پدینگ و مارجین ریسپانسیو
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> جستجو...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" /> جستجو
              </>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-100 text-red-800 p-3 rounded-lg flex items-center gap-2 font-medium shadow-sm border border-red-200 w-full text-sm sm:text-base" // اندازه فونت ریسپانسیو
            >
              <XCircle className="w-5 h-5" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {order && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 sm:mt-8 space-y-6 sm:space-y-8 w-full" // مارجین و اسپیسینگ ریسپانسیو
            >
              {/* مشخصات سفارش */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-purple-50 rounded-2xl p-5 sm:p-6 border border-purple-200 shadow-lg" // پدینگ ریسپانسیو
              >
                <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 sm:mb-4 border-b-2 border-purple-300 pb-2 sm:pb-3 flex items-center gap-2"> {/* اندازه فونت و پدینگ ریسپانسیو */}
                  <PackageSearch className="w-5 h-5 sm:w-6 sm:h-6" /> مشخصات سفارش
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base"> {/* اندازه فونت و گپ ریسپانسیو */}
                  <p><strong>کد سفارش:</strong> <span className="font-semibold text-gray-900">{order.id}</span></p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" /> {/* اندازه آیکون ریسپانسیو */}
                    <strong>شماره تماس:</strong> <span className="font-semibold text-gray-900">{order.phone}</span>
                  </p>
                  <p className="md:col-span-2 break-words"><strong>آدرس:</strong> <span className="font-semibold text-gray-900">{order.address}</span></p> {/* break-words اضافه شد */}
                  <p>
                    <strong>تاریخ ثبت سفارش:</strong>{' '}
                    <span className="font-semibold text-gray-900">
                      {new Date(order.created_at).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </p>
                  <p className="mt-2">
                    <strong>وضعیت ارسال:</strong>{' '}
                    {order.shipped ? (
                      <span className="inline-flex items-center gap-1 text-green-700 bg-green-100 px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base font-medium shadow-sm"> {/* پدینگ و اندازه فونت ریسپانسیو */}
                        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> {/* اندازه آیکون ریسپانسیو */}
                        ارسال شده
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-700 bg-yellow-100 px-2 sm:px-3 py-1 rounded-full text-sm sm:text-base font-medium shadow-sm"> {/* پدینگ و اندازه فونت ریسپانسیو */}
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 animate-spin-slow" /> {/* اندازه آیکون ریسپانسیو */}
                        در حال ارسال / پیگیری
                      </span>
                    )}
                  </p>
                </div>
              </motion.div>

              {/* آیتم‌های سفارش */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-lg" // پدینگ ریسپانسیو
              >
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 border-b-2 border-gray-300 pb-2 sm:pb-3 flex items-center gap-2"> {/* اندازه فونت و پدینگ ریسپانسیو */}
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500" /> آیتم‌های سفارش
                </h2>
                <ul className="space-y-3 sm:space-y-4"> {/* اسپیسینگ ریسپانسیو */}
                  {order.order_items.map((item: any) => (
                    <li
                      key={item.id}
                      className="border border-gray-100 rounded-xl p-3 sm:p-4 bg-gray-50 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center" // flex-col در موبایل، پدینگ ریسپانسیو
                    >
                      <div>
                        <p className="font-semibold text-gray-900 text-base sm:text-lg"> {/* اندازه فونت ریسپانسیو */}
                          محصول: <span className="text-indigo-600 break-words">{item.product?.name || 'نامشخص'}</span> {/* break-words اضافه شد */}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          تعداد: <span className="font-medium">{item.quantity}</span>
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0"> {/* مارجین ریسپانسیو */}
                        <p className="font-bold text-gray-800 text-sm sm:text-base"> {/* اندازه فونت ریسپانسیو */}
                          قیمت واحد: {item.price.toLocaleString('fa-IR')} تومان
                        </p>
                        <p className="font-bold text-purple-700 text-base sm:text-lg mt-1"> {/* اندازه فونت ریسپانسیو */}
                          جمع کل: {(item.price * item.quantity).toLocaleString('fa-IR')} تومان
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}



