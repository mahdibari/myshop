'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMsg('لطفاً همه فیلدها را پر کنید.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('رمز عبور و تکرار آن برابر نیستند.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert('ثبت‌نام موفق! لطفاً ایمیل خود را برای تایید بررسی کنید.');
      setIsRegister(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('لطفاً ایمیل و رمز عبور را وارد کنید.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.push('/account'); // بعد از ورود به صفحه حساب کاربری می‌رود
    }
  };

  return (
    <main className="max-w-md mx-auto p-6 mt-20 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
        {isRegister ? 'ثبت‌نام' : 'ورود'}
      </h1>

      {errorMsg && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">{errorMsg}</div>
      )}

      <label className="block mb-2 font-semibold">ایمیل</label>
      <input
        type="email"
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="example@email.com"
      />

      <label className="block mb-2 font-semibold">رمز عبور</label>
      <input
        type="password"
        className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="حداقل ۶ کاراکتر"
      />

      {isRegister && (
        <>
          <label className="block mb-2 font-semibold">تکرار رمز عبور</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-pink-600"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="رمز عبور را دوباره وارد کنید"
          />
        </>
      )}

      <button
        onClick={isRegister ? handleRegister : handleLogin}
        disabled={loading}
        className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded font-semibold transition"
      >
        {loading ? 'در حال پردازش...' : isRegister ? 'ثبت‌نام' : 'ورود'}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        {isRegister ? 'قبلا ثبت‌نام کرده‌اید؟' : 'کاربر جدید هستید؟'}{' '}
        <button
          onClick={() => {
            setErrorMsg('');
            setIsRegister(!isRegister);
          }}
          className="text-pink-600 font-semibold hover:underline"
        >
          {isRegister ? 'ورود' : 'ثبت‌نام'}
        </button>
      </p>
    </main>
  );
}
