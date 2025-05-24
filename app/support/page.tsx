'use client';

import { Phone, Mail, MessageCircle } from 'lucide-react';

export default function SupportPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-5xl font-extrabold mb-10 text-center text-pink-600 tracking-wide">
        پشتیبانی
      </h1>

      <p className="text-gray-700 mb-8 text-center text-lg">
        اگر سوال یا مشکلی دارید، می‌توانید از راه‌های زیر با ما تماس بگیرید:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* کارت تلفن */}
        <div className="flex flex-col items-center bg-pink-50 rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer group">
          <div className="bg-pink-600 text-white rounded-full p-4 mb-4 group-hover:bg-pink-700 transition">
            <Phone size={36} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-pink-700">تلفن</h3>
          <p className="text-gray-600 text-center font-mono">۰۲۱-۱۲۳۴۵۶۷۸</p>
          <p className="mt-2 text-gray-500 text-sm text-center">پاسخگویی ۹ صبح تا ۵ عصر</p>
        </div>

        {/* کارت ایمیل */}
        <div className="flex flex-col items-center bg-pink-50 rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer group">
          <div className="bg-pink-600 text-white rounded-full p-4 mb-4 group-hover:bg-pink-700 transition">
            <Mail size={36} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-pink-700">ایمیل</h3>
          <p className="text-gray-600 text-center font-mono">support@example.com</p>
          <p className="mt-2 text-gray-500 text-sm text-center">پاسخگویی در کمتر از ۲۴ ساعت</p>
        </div>

        {/* کارت چت آنلاین */}
        <div className="flex flex-col items-center bg-pink-50 rounded-xl p-6 shadow-md hover:shadow-xl transition cursor-pointer group">
          <div className="bg-pink-600 text-white rounded-full p-4 mb-4 group-hover:bg-pink-700 transition">
            <MessageCircle size={36} />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-pink-700">چت آنلاین</h3>
          <p className="text-gray-600 text-center font-mono">از طریق وبسایت ما</p>
          <p className="mt-2 text-gray-500 text-sm text-center">پشتیبانی فوری و مستقیم</p>
        </div>
      </div>

      <p className="mt-12 text-gray-700 text-center text-lg max-w-xl mx-auto leading-relaxed">
        تیم پشتیبانی ما همیشه آماده پاسخگویی به شماست. هر سوال یا مشکلی داشتید، با کمال میل کمک خواهیم کرد.
      </p>
    </main>
  );
}
