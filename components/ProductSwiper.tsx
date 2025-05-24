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
import { ShoppingCart, Percent, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
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
      autoplay={{ delay: 4000 }}
      className="product-slider"
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
              className="group block bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-lg overflow-hidden flex flex-col h-full hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="relative h-64 w-full overflow-hidden rounded-t-3xl">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
                  priority
                />
                {hasDiscount && (
                  <div className="absolute top-3 left-3 bg-pink-600/90 text-white px-3 py-1 rounded-full flex items-center gap-1 shadow-lg text-sm font-semibold">
                    <Percent className="w-4 h-4" />
                    {product.discount_percentage}%
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="text-lg font-bold mb-2 line-clamp-2 text-gray-800">
                    {product.name}
                  </h3>

                  {product.category && (
                    <p className="flex items-center gap-1 text-gray-500 mb-3 text-sm">
                      <Tag className="w-4 h-4" />
                      دسته‌بندی: <span className="font-medium">{product.category}</span>
                    </p>
                  )}

                  <div className="flex items-center gap-3">
                    {hasDiscount && (
                      <span className="line-through text-gray-400 text-sm">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                    )}
                    <span className={`text-xl font-extrabold ${hasDiscount ? 'text-pink-600' : 'text-gray-900'}`}>
                      {discountedPrice.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
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
                  className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white py-3 rounded-full font-semibold transition"
                >
                  <ShoppingCart className="w-5 h-5" />
                  افزودن به سبد خرید
                </button>
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}



