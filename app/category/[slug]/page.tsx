import { supabase } from '@/lib/supabase';
import ProductSwiper from '@/components/ProductSwiper';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 0;

async function getProductsByCategory(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', slug);
  if (error) {
    console.error('Supabase error:', error);
    return [];
  }
  return data || [];
}

async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', slug)  // اگر شناسه دسته هست
    .single();
  if (error) {
    console.error('Supabase error:', error);
    return null;
  }
  return data;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;

  const category = await getCategoryBySlug(slug);
  const products = await getProductsByCategory(slug);

  if (!category) {
    return <p className="text-center mt-20">دسته‌بندی یافت نشد.</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-pink-600">{category.name}</h1>
      {products.length > 0 ? (
        <ProductSwiper products={products} />
      ) : (
        <p className="text-center text-gray-500">هیچ محصولی در این دسته موجود نیست.</p>
      )}
    </main>
  );
}
