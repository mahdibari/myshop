import Link from 'next/link';

export default function Footer() {
  // Define the Enamad HTML code as a string.
  // This is embedded using dangerouslySetInnerHTML, which should be used with caution
  // as it can expose to XSS attacks if the HTML content is not trusted.
  // However, for official third-party scripts like Enamad, it's often necessary.
  const enamadHtml = `
    <a referrerPolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=616528&Code=zqhSUNIpYtMgZEuz3z8sHCDj8agZukxd'>
      <img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=616528&Code=zqhSUNIpYtMgZEuz3z8sHCDj8agZukxd' alt='نماد اعتماد الکترونیکی' style='cursor:pointer' />
    </a>
  `;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">درباره ما</h3>
            <p className="text-gray-400">
              منبع مطمئن شما برای خرید محصولات آرایشی و بهداشتی با کیفیت
            </p>
          </div>
          
          {/* Quick Access Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-white">
                  محصولات
                </Link>
              </li>
               <li>
                <Link href="/trak-order" className="text-gray-400 hover:text-white">
                  پیگیری سفارش
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
          
          {/* Customer Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">خدمات مشتریان</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white">
                  پشتیبانی
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-2 text-gray-400">
              <li>تلفن: 09224242622-09108416386</li>
              <li>آدرس: تهران خیابان جمهوری بین سه راه جمهوری و شیخ هادی نبش بن بست شهریار پاساژ علا الدین آرایشی طبقه منفی یک پلاک ۷۶</li>
            </ul>
          </div>

          {/* Enamad Symbol Section - Added here */}
          {/* The dangerouslySetInnerHTML prop is used to render raw HTML from the enamadHtml string. */}
          {/* This is necessary for embedding third-party scripts/badges like Enamad. */}
          <div>
            <h3 className="text-lg font-semibold mb-4">مجوزها</h3>
            <div dangerouslySetInnerHTML={{ __html: enamadHtml }} />
          </div>

        </div>
        
        {/* Copyright Section */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} فروشگاه لوازم آرایشی. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}