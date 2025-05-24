'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
}

interface Props {
  categories: Category[];
}

export default function CategorySection({ categories }: Props) {
  return (
    <section className="mb-20">
      <h2 className="text-4xl font-extrabold mb-10 text-pink-600 border-b-4 border-pink-400 pb-2">دسته‌بندی محصولات </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 px-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={`/category/${cat.slug}`} passHref>
            <a
              className="
                group
                block
                bg-gradient-to-tr from-pink-50 via-white to-yellow-50
                rounded-3xl
                shadow-lg
                overflow-hidden
                border border-transparent
                transition
                duration-300
                hover:shadow-2xl
                hover:border-pink-400
                cursor-pointer
              "
            >
              <div className="relative w-full h-52">
                <Image
                  src={cat.image_url}
                  alt={cat.name || 'category image'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-300">
                  {cat.name}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  محصولات با کیفیت و متنوع در این دسته‌بندی
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </section>
  );
}
