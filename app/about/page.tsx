'use client';

import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto p-10 bg-white rounded-xl shadow-lg">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-pink-600 tracking-wide">
        درباره ما
      </h1>

      <section className="flex flex-col md:flex-row items-center gap-10">
        {/* تصویر زیبا */}
        <div className="relative w-full max-w-sm h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
          <Image
            src="https://dwevrqyekxjbgiwrvcty.supabase.co/storage/v1/object/public/categories//hydrofacial.jpg"
            alt="تیم فروشگاه آرایشی"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* متن */}
        <div className="text-gray-700 space-y-6 max-w-xl">
          <p className="text-lg leading-relaxed">
            ما یک فروشگاه آنلاین تخصصی محصولات آرایشی و بهداشتی هستیم که هدف‌مان ارائه محصولات با کیفیت بالا و قیمت‌های مناسب به شما عزیزان است.
          </p>

          <p className="text-lg leading-relaxed">
            تیم ما از افراد علاقه‌مند به زیبایی و سلامت پوست تشکیل شده است که هر روز با تلاش و اشتیاق، بهترین‌ها را برای شما گردآوری و عرضه می‌کند.
          </p>

          <p className="text-pink-600 font-semibold text-lg mt-4">
            تعهد ما، رضایت و سلامت شماست.
          </p>
        </div>
      </section>

      <section className="mt-16 bg-pink-50 rounded-xl p-8 shadow-inner text-center">
        <h2 className="text-3xl font-bold mb-4 text-pink-700">چرا ما را انتخاب کنید؟</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
          <li className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition cursor-default">
            <h3 className="font-semibold mb-2 text-pink-600">محصولات اصل و باکیفیت</h3>
            <p>همه محصولات ما از برندهای معتبر و با ضمانت اصالت تهیه می‌شوند.</p>
          </li>
          <li className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition cursor-default">
            <h3 className="font-semibold mb-2 text-pink-600">قیمت مناسب و منصفانه</h3>
            <p>قیمت‌های ما کاملاً رقابتی و منصفانه برای تمامی مشتریان است.</p>
          </li>
          <li className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition cursor-default">
            <h3 className="font-semibold mb-2 text-pink-600">پشتیبانی حرفه‌ای و سریع</h3>
            <p>تیم پشتیبانی ما همیشه آماده پاسخگویی و کمک به سوالات شماست.</p>
          </li>
        </ul>
      </section>
    </main>
  );
}
