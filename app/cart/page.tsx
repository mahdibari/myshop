'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext'; // اطمینان حاصل کنید که مسیر صحیح است
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Pencil, Plus, Minus, X } from 'lucide-react'; // وارد کردن آیکون‌های Plus، Minus و X
import toast from 'react-hot-toast'; // وارد کردن toast برای پیام‌ها
import { motion, AnimatePresence } from 'framer-motion'; // وارد کردن motion و AnimatePresence برای انیمیشن مودال

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, totalPrice, updateQuantity } = useCart();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);

  // تابع برای شروع حالت ویرایش یک محصول خاص
  const startEditing = (id: string, quantity: number) => {
    setEditingItemId(id);
    setNewQuantity(quantity);
    console.log(`شروع ویرایش آیتم: ${id} با تعداد فعلی: ${quantity}`);
  };

  // تابع برای لغو حالت ویرایش و بستن مودال
  const cancelEditing = () => {
    setEditingItemId(null);
    console.log('ویرایش لغو شد.');
  };

  // تابع برای ذخیره تعداد جدید محصول
  const saveQuantity = async () => {
    console.log(`تلاش برای ذخیره تعداد. Item ID: ${editingItemId}, New Quantity: ${newQuantity}`);
    
    if (newQuantity < 1) {
      toast.error('تعداد باید حداقل 1 باشد');
      return;
    }
    
    if (editingItemId) {
      await updateQuantity(editingItemId, newQuantity); 
      setEditingItemId(null);
      toast.success('تعداد محصول با موفقیت به‌روزرسانی شد!');
      console.log(`تعداد آیتم ${editingItemId} به ${newQuantity} به‌روزرسانی شد.`);
    } else {
      console.error('شناسه محصول برای ویرایش نامعتبر است.');
      toast.error('خطا در به‌روزرسانی محصول.');
    }
  };

  // تابع برای افزایش تعداد محصول در مودال
  const handleIncrement = () => {
    setNewQuantity(prev => {
      const updated = prev + 1;
      console.log('تعداد افزایش یافت به:', updated);
      return updated;
    });
  };

  // تابع برای کاهش تعداد محصول در مودال (حداقل 1)
  const handleDecrement = () => {
    setNewQuantity(prev => {
      const updated = (prev > 1 ? prev - 1 : 1);
      console.log('تعداد کاهش یافت به:', updated);
      return updated;
    });
  };

  // اگر سبد خرید خالی باشد، این پیام نمایش داده می‌شود
  if (cartItems.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] p-8 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg text-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-pink-600">سبد خرید شما خالی است 🛒</h2>
        <p className="text-lg mb-8">هیچ محصولی برای نمایش در سبد خرید شما وجود ندارد.</p>
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
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-8 max-w-6xl mx-auto bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100 my-8"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-gray-800 mb-12 tracking-tight">
        🛍️ سبد خرید شما
      </h1>

      <div className="grid grid-cols-1 gap-6 md:gap-8">
        <AnimatePresence>
          {cartItems.map(item => {
            const discountedPrice = item.discount_percentage
              ? item.price * (1 - item.discount_percentage / 100)
              : item.price;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-5 border border-gray-100 relative overflow-hidden"
              >
                {/* Discount Badge */}
                {item.discount_percentage && (
                  <div className="absolute top-0 left-0 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-br-lg z-10 shadow-md">
                    %{item.discount_percentage} تخفیف
                  </div>
                )}

                <div className="relative w-full h-40 md:w-40 md:h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-md border border-gray-200">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="flex-grow text-center md:text-right p-4 md:p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-900">{item.name}</h2>
                  <p className="text-lg text-gray-600 mb-1">
                    قیمت واحد: <span className="font-semibold">{discountedPrice.toLocaleString('fa-IR')}</span> تومان
                    {item.discount_percentage && (
                      <span className="line-through text-gray-400 ml-2 text-sm">
                        {item.price.toLocaleString('fa-IR')}
                      </span>
                    )}
                  </p>
                  <p className="text-xl font-bold mt-3 text-purple-700">
                    مجموع: {(discountedPrice * item.quantity).toLocaleString('fa-IR')} تومان
                  </p>
                </div>
                <div className="flex flex-row md:flex-col gap-3 mt-4 md:mt-0 items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      console.log(`حذف آیتم: ${item.id}`);
                      removeFromCart(item.id);
                      toast.success('محصول از سبد حذف شد!', { icon: '🗑️' });
                    }}
                    className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                    title="حذف محصول"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => startEditing(String(item.id), item.quantity)}
                    className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
                    title="ویرایش تعداد"
                  >
                    <Pencil className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* مودال ویرایش تعداد */}
                <AnimatePresence>
                  {editingItemId !== null && editingItemId === String(item.id) && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                      onClick={cancelEditing} // با کلیک روی پس‌زمینه مودال بسته می‌شود
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", stiffness: 200, damping: 25 }}
                        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-200 flex flex-col items-center relative"
                        onClick={(e) => e.stopPropagation()} // جلوگیری از انتشار کلیک داخل مودال به پس‌زمینه
                      >
                        <button
                          onClick={cancelEditing}
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">ویرایش تعداد</h3>
                        <div className="flex items-center justify-center gap-5 mb-8 w-full">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleDecrement}
                            className="p-4 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Minus className="w-7 h-7" />
                          </motion.button>
                          <input
                            type="number"
                            min={1}
                            value={newQuantity}
                            onChange={(e) => { 
                              const val = parseInt(e.target.value);
                              setNewQuantity(isNaN(val) ? 1 : val);
                            }}
                            className="w-28 p-4 border-2 border-pink-300 rounded-xl text-center text-3xl font-bold text-gray-900 focus:ring-4 focus:ring-pink-200 transition-all duration-200 shadow-inner"
                          />
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleIncrement}
                            className="p-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                          >
                            <Plus className="w-7 h-7" />
                          </motion.button>
                        </div>
                        <div className="flex justify-center gap-4 w-full">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={cancelEditing}
                            className="flex-1 px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            انصراف
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={saveQuantity}
                            className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            ذخیره تغییرات
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 text-right shadow-xl border border-blue-100"
      >
        <p className="text-2xl font-bold text-gray-800">
          جمع کل خرید:{' '}
          <span className="text-indigo-700 font-extrabold text-3xl">
            {totalPrice.toLocaleString('fa-IR')} تومان
          </span>
        </p>
        <div className="flex justify-center">
          <Link href="/checkout">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(139, 92, 246, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-10 py-4 rounded-full text-xl font-bold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300 shadow-lg"
            >
              پرداخت و نهایی کردن خرید
            </motion.button>
          </Link>
        </div>
        <div className="flex justify-center mt-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              clearCart();
              toast.success('سبد خرید شما خالی شد!', { icon: '🧹' });
            }}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-300 text-sm font-semibold px-4 py-2 rounded-lg"
          >
            خالی کردن سبد خرید
          </motion.button>
        </div>
      </motion.div>
    </motion.main>
  );
}






