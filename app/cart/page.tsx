'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Pencil } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, totalPrice, updateQuantity } = useCart();
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(1);

  const startEditing = (id: string, currentQty: number) => {
    setEditingItemId(id);
    setNewQuantity(currentQty);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  const saveQuantity = () => {
    if (newQuantity < 1) {
      alert('تعداد باید حداقل 1 باشد');
      return;
    }
    if (editingItemId) {
      updateQuantity(editingItemId, newQuantity);
      setEditingItemId(null);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2 className="text-3xl font-bold mb-4">سبد خرید شما خالی است 🛒</h2>
        <Link href="/products" className="text-pink-600 hover:underline font-semibold">
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-10">🛍️ سبد خرید</h1>

      <div className="space-y-6">
        {cartItems.map(item => {
          const discountedPrice = item.discount_percentage
            ? item.price * (1 - item.discount_percentage / 100)
            : item.price;

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-4 bg-white rounded-3xl shadow-md hover:shadow-xl transition p-4 items-center"
            >
              <div className="relative w-32 h-32">
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  className="rounded-xl object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-right">
                <h2 className="text-xl font-semibold mb-1 text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500">
                  قیمت واحد: {discountedPrice.toLocaleString('fa-IR')} تومان
                </p>
                <p className="text-sm text-gray-500">
                  تعداد: <span className="font-bold text-gray-800">{item.quantity}</span>
                </p>
                <p className="text-base font-semibold mt-2 text-pink-600">
                  مجموع: {(discountedPrice * item.quantity).toLocaleString('fa-IR')} تومان
                </p>
              </div>
              <div className="flex gap-4 mt-4 sm:mt-0 sm:flex-col items-center">
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600 transition"
                  title="حذف"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => startEditing(item.id, item.quantity)}
                  className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 transition"
                  title="ویرایش"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>

              {/* مودال ویرایش تعداد */}
              {editingItemId === item.id && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-6 w-80 max-w-full shadow-xl animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">ویرایش تعداد</h3>
                    <input
                      type="number"
                      min={1}
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
                      className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-center text-lg"
                    />
                    <div className="flex justify-between">
                      <button
                        onClick={cancelEditing}
                        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition text-gray-700"
                      >
                        انصراف
                      </button>
                      <button
                        onClick={saveQuantity}
                        className="px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition"
                      >
                        ذخیره
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8 flex flex-col gap-6 text-right shadow-inner">
        <p className="text-xl font-semibold text-gray-700">
          جمع کل خرید:{' '}
          <span className="text-pink-600 font-bold">
            {totalPrice.toLocaleString('fa-IR')} تومان
          </span>
        </p>
        <div className="flex justify-center">
          <Link href="/checkout">
            <button className="bg-pink-600 text-white px-8 py-3 rounded-full text-lg hover:bg-pink-700 transition shadow-md">
              پرداخت کل سبد خرید
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}







