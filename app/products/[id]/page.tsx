import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { BadgePercent, ShoppingCart, Tag } from 'lucide-react';

interface Params {
  params: { id: string };
}

export default async function ProductPage({ params }: Params) {
  const { id } = params;

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (!product) {
    notFound();
  }

  const hasDiscount = !!product.discount_percentage;
  const finalPrice = hasDiscount
    ? product.price * (1 - product.discount_percentage / 100)
    : product.price;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* تصویر محصول */}
        <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-xl relative group">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
          {hasDiscount && (
            <span className="absolute top-4 right-4 bg-pink-600 text-white text-sm px-3 py-1 rounded-full shadow flex items-center gap-1">
              <BadgePercent className="w-4 h-4" />
              {product.discount_percentage}% تخفیف
            </span>
          )}
        </div>

        {/* اطلاعات محصول */}
        <div className="bg-white/60 backdrop-blur-lg border border-gray-200 p-6 rounded-2xl shadow-md space-y-5">
          <h1 className="text-3xl font-bold text-pink-700">{product.name}</h1>

          {product.category && (
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Tag className="w-4 h-4" />
              دسته‌بندی: <span className="font-semibold">{product.category}</span>
            </p>
          )}

          <div className="text-lg space-y-1">
            <p className="text-gray-800">
              قیمت:
              {hasDiscount ? (
                <>
                  <span className="text-gray-500 line-through mx-2">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-pink-600 font-bold">
                    {finalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </>
              ) : (
                <span className="text-pink-600 font-bold mx-2">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>
              )}
            </p>

            {product.inventory !== undefined && (
              <p className={`font-medium ${product.inventory > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.inventory > 0
                  ? `${product.inventory} عدد موجود است`
                  : 'ناموجود'}
              </p>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-700 mb-1">توضیحات:</h2>
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
              {product.description || 'توضیحاتی برای این محصول وجود ندارد.'}
            </p>
          </div>

          <button
            disabled={product.inventory === 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white py-3 rounded-xl text-lg font-semibold transition-all duration-200 disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
            افزودن به سبد خرید
          </button>
        </div>
      </div>
    </main>
  );
}

