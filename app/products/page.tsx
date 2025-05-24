'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  discount_percentage?: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default');
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data } = await supabase.from('products').select('*');
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const sortedProducts = [...products];
  if (sortOrder === 'asc') {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'desc') {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center text-pink-600">محصولات ما</h1>

      {/* مرتب‌سازی */}
      <div className="flex justify-end mb-6">
        <label htmlFor="sort" className="ml-2 font-semibold cursor-pointer">مرتب‌سازی بر اساس قیمت:</label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="border rounded px-3 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-600"
        >
          <option value="default">پیش‌فرض</option>
          <option value="asc">صعودی</option>
          <option value="desc">نزولی</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">در حال بارگذاری محصولات...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {sortedProducts.map((product) => {
            const discountedPrice = product.discount_percentage
              ? Math.round(product.price * (1 - product.discount_percentage / 100))
              : product.price;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-md overflow-hidden transition hover:shadow-xl p-4 flex flex-col h-full"
              >
                <Link href={`/products/${product.id}`} className="relative h-60 w-full mb-4 block rounded-xl overflow-hidden">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.discount_percentage && product.discount_percentage > 0 && (
                    <span className="absolute top-2 right-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full shadow">
                      {product.discount_percentage}% تخفیف
                    </span>
                  )}
                </Link>

                <div className="flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                    {product.discount_percentage && product.discount_percentage > 0 ? (
                      <div className="flex items-center justify-between text-sm">
                        <span className="line-through text-gray-400">
                          {product.price.toLocaleString('fa-IR')} تومان
                        </span>
                        <span className="text-red-600 font-bold">
                          {discountedPrice.toLocaleString('fa-IR')} تومان
                        </span>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm font-medium">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToCart(product);
                      toast.success(`${product.name} به سبد خرید اضافه شد 🛒`, {
                        duration: 2000,
                        position: 'bottom-right',
                      });
                    }}
                    className="mt-4 bg-pink-600 hover:bg-pink-700 text-white text-sm py-2 px-4 rounded-full transition font-semibold"
                  >
                    افزودن به سبد خرید 🛒
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

