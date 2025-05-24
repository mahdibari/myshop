'use client';

import { useEffect, useState } from 'react';

interface Brand {
  id: string;
  name: string;
  image_url: string;
}

export default function PopularBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const res = await fetch('/api/brands/popular');
        const data = await res.json();
        setBrands(data);
      } catch (error) {
        console.error('Failed to load brands:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  if (loading) return <p className="text-center py-10 text-pink-600 font-semibold animate-pulse">در حال بارگذاری برندها...</p>;

  if (brands.length === 0)
    return <p className="text-center py-10 text-gray-500">برندی برای نمایش وجود ندارد.</p>;

  return (
    <section className="max-w-7xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-extrabold mb-10 text-black-600 text-center">محبوب‌ترین برندها</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="flex flex-col items-center bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-shadow cursor-pointer transform hover:-translate-y-1"
            tabIndex={0}
            aria-label={`برند ${brand.name}`}
          >
            <img
              src={brand.image_url}
              alt={brand.name}
              className="w-28 h-28 object-contain mb-4 rounded-lg"
              loading="lazy"
            />
            <span className="text-center text-gray-800 font-semibold text-lg truncate max-w-full">{brand.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
