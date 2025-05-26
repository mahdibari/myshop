import { supabase } from '@/lib/supabase';
import ProductSwiper from '@/components/ProductSwiper';

export const revalidate = 0;

export default async function BrandPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('brand_id', id);

  if (error) {
    return <div className="p-6 text-red-600">خطا در دریافت محصولات برند</div>;
  }

  if (!products || products.length === 0) {
    return <div className="p-6 text-gray-500">محصولی برای این برند یافت نشد.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-6">محصولات این برند</h1>
      <ProductSwiper products={products} />
    </div>
  );
}


