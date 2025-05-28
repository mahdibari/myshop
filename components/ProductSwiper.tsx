'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useCart } from '@/context/CartContext';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { toast } from 'react-hot-toast';
import { ShoppingCart, Percent, Tag, Eye } from 'lucide-react'; // Eye icon added

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string; // Added description
  discount_percentage?: number;
  category?: string;
}

interface ProductSwiperProps {
  products: Product[];
  showDiscount?: boolean;
}

export default function ProductSwiper({ products, showDiscount = false }: ProductSwiperProps) {
  const { addToCart } = useCart();

  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      }}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      className="product-slider py-8"
    >
      {products.map((product) => {
        const hasDiscount = showDiscount && product.discount_percentage && product.discount_percentage > 0;
        const discountedPrice = hasDiscount
          ? Math.round(product.price * (1 - (product.discount_percentage ?? 0) / 100))
          : product.price;

        return (
          <SwiperSlide key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="group block bg-white/70 backdrop-blur-lg border border-gray-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-full hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative z-10"
            >
              <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                  priority
                />
                {hasDiscount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-1.5 rounded-full flex items-center gap-1 shadow-lg text-sm font-bold animate-pulse-slow z-20">
                    <Percent className="w-4 h-4" />
                    {product.discount_percentage}%
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-xl font-extrabold mb-2 line-clamp-2 text-gray-800 leading-snug">
                    {product.name}
                  </h3>

                  {product.category && (
                    <p className="flex items-center gap-2 text-gray-500 mb-2 text-base font-medium">
                      <Tag className="w-5 h-5 text-purple-500" />
                      دسته‌بندی: <span className="text-gray-700">{product.category}</span>
                    </p>
                  )}

                  {product.description && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                      {product.description}
                    </p>
                  )}

                  <div className="flex items-baseline gap-3 mt-auto">
                    {hasDiscount && (
                      <span className="line-through text-gray-400 text-base">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                    )}
                    <span className={`text-2xl font-extrabold ${hasDiscount ? 'text-pink-600' : 'text-indigo-800'}`}>
                      {discountedPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3"> {/* Added flex-col and gap for buttons */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                       addToCart(product, 1);
                      toast.success(`${product.name} به سبد خرید اضافه شد 🛒`, {
                        duration: 2000,
                        position: 'bottom-right',
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 group"
                  >
                    <ShoppingCart className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                    افزودن به سبد خرید
                  </button>
                  <Link href={`/products/${product.id}`} passHref>
                    <button
                      onClick={(e) => e.stopPropagation()} // Prevent Link from being triggered twice
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      <Eye className="w-5 h-5" />
                      مشاهده جزئیات
                    </button>
                  </Link>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}



