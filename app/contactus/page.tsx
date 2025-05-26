'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = 'نام را وارد کنید.';
    if (!formData.email.trim()) {
      newErrors.email = 'ایمیل را وارد کنید.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست.';
    }
    if (!formData.message.trim()) newErrors.message = 'پیام خود را بنویسید.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // شبیه‌سازی ارسال داده به سرور
      await new Promise((r) => setTimeout(r, 1500));
      setSubmitted(true);
    } catch {
      alert('ارسال پیام با خطا مواجه شد. لطفا دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  return (
    <main className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-pink-600 tracking-wide">تماس با ما</h1>

      <div className="flex flex-col md:flex-row gap-10 mb-12">
        {/* فرم */}
        <section className="flex-1">
          {submitted ? (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-5 rounded-lg text-center text-lg font-semibold">
              پیام شما با موفقیت ارسال شد. ممنون از تماس شما!
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* نام */}
              <div>
                <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">
                  نام شما
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="نام خود را وارد کنید"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 transition
                    ${
                      errors.name
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-pink-500'
                    }`}
                />
                {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name}</p>}
              </div>

              {/* ایمیل */}
              <div>
                <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                  ایمیل شما
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ایمیل خود را وارد کنید"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 transition
                    ${
                      errors.email
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-pink-500'
                    }`}
                />
                {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email}</p>}
              </div>

              {/* پیام */}
              <div>
                <label htmlFor="message" className="block mb-2 font-semibold text-gray-700">
                  پیام شما
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="پیام خود را بنویسید"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 transition
                    ${
                      errors.message
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-pink-500'
                    }`}
                />
                {errors.message && <p className="mt-1 text-red-600 text-sm">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full font-bold text-white bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 transition
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'در حال ارسال...' : 'ارسال پیام'}
              </button>
            </form>
          )}
        </section>

        {/* اطلاعات تماس */}
        <section className="flex-1 bg-pink-50 rounded-lg p-6 flex flex-col justify-center shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-pink-700 border-b border-pink-300 pb-2">
            اطلاعات تماس
          </h2>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>آدرس:</strong>تهران 
خیابان جمهوری 
بین سه راه جمهوری و شیخ هادی 
نبش بن بست شهریار 
پاساژ علا الدین آرایشی 
طبقه منفی یک پلاک ۷۶
            </p>
            <p>
              <strong>تلفن:</strong> 09108416386 - 09224242622
            </p>
           
            <p>
              <strong>ساعات کاری:</strong> شنبه تا چهارشنبه 12 ظهر تا ۵ عصر
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

