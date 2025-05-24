import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">درباره ما</h3>
            <p className="text-gray-400">
              منبع مطمئن شما برای خرید محصولات آرایشی و بهداشتی با کیفیت
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  محصولات
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="text-gray-400 hover:text-white">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">خدمات مشتریان</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white">
                  پشتیبانی
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-white">
                  اطلاعات ارسال
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-white">
                  مرجوعی
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-2 text-gray-400">
              <li>ایمیل: support@cosmetics.com</li>
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>آدرس: تهران، خیابان ولیعصر</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} فروشگاه لوازم آرایشی. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}