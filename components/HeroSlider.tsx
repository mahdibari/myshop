'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type Slide = {
  id: string;
  title: string;
  image_url: string;
 
  link: string;
  description?: string; // 👈 اضافه کردن فیلد توضیحات
};

export default function HeroSlider() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [current, setCurrent] = useState(0);
  const router = useRouter();

  useEffect(() => {
    async function fetchSlides() {
      const { data, error } = await supabase.from('slides').select('*');
      if (!error && data) setSlides(data);
    }

    fetchSlides();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides.length) return null;

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-12 shadow-md">
      <Image
        src={slides[current].image_url}
        alt={slides[current].title}
        fill
        className="object-cover transition-opacity duration-500"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center p-4">
        <h2 className="text-xl sm:text-3xl font-bold mb-4">{slides[current].title}</h2>

        <button
          onClick={() => router.push(slides[current].link || '/products')}
          className="bg-white text-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          مشاهده بیشتر
        </button>

        {slides[current].description && (
          <p className="mt-4 max-w-xl text-sm sm:text-base text-gray-200">
            {slides[current].description}
          </p>
        )}
      </div>
    </div>
  );
}

