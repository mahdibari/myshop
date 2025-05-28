import HeroSlider from '@/components/HeroSlider';
import { supabase } from '@/lib/supabase';
import ProductSwiper from '@/components/ProductSwiper';
import PopularBrands from '@/components/PopularBrands';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 0;

async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if (error) {
    console.error('Supabase error:', error);
    return { featured: [], popular: [], discounted: [] };
  }
  return {
    featured: data?.filter((p) => p.is_featured) || [],
    popular: data?.filter((p) => p.is_popular) || [],
    discounted: data?.filter((p) => p.discount_percentage > 0) || [],
  };
}

async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.error('Supabase categories error:', error);
    return [];
  }
  return data;
}

export default async function Home() {
  const { featured, popular, discounted } = await getProducts();
  const categories = await getCategories();

  const sliderImages = featured
    .filter((p) => p.image_url)
    .slice(0, 3)
    .map((p) => ({
      id: p.id,
      image: p.image_url,
      title: p.name,
      description: p.caption || '',
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <HeroSlider />
      

      {/* دسته بندی‌ها */}
      <section className="mb-10">
       <h2 className="text-2xl font-extrabold mb-10 text-black-600 text-center"> دسته بندی محصولات</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
               
              className="flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
            >
              <Image
                src={cat.image_url}
                alt={cat.name}
                width={100} // ابعاد واقعی تصویر رو اینجا وارد کن
                height={100} // ابعاد واقعی تصویر رو اینجا وارد کن
                className="w-20 h-20 rounded-lg object-cover mb-2 shadow"
                
              />
              <span className="text-sm font-medium text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* محصولات ویژه */}
    
       <section>
        <h2 className="text-4xl font-extrabold mb-10 text-pink-600 border-b-4 border-pink-400 pb-2 text-center"> تخفیف های ویژه</h2>
        <ProductSwiper products={discounted} showDiscount />
      </section>

      <section className="mb-12">
        <h2 className="text-4xl font-extrabold mb-10 text-pink-600 border-b-4 border-pink-400 pb-2 text-center">پر فروش ترین ها </h2>
        <ProductSwiper products={popular} />
      </section>

   

        <section className="mb-12">
        <h2 className="text-4xl font-extrabold mb-10 text-pink-600 border-b-4 border-pink-400 pb-2 text-center"> محصولات ویژه </h2>
        <ProductSwiper products={featured} />
      </section>
    </div>
  );
}




