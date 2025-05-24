'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function VerifyEmailPage() {
  const [message, setMessage] = useState('در حال بررسی...');

  useEffect(() => {
    async function checkSession() {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setMessage('خطا در دریافت اطلاعات کاربر');
        return;
      }
      if (data.user?.email_confirmed_at) {
        setMessage('ایمیل شما تایید شد. ممنون که عضویت را تکمیل کردید!');
      } else {
        setMessage('ایمیل شما هنوز تایید نشده است. لطفا لینک تایید را بررسی کنید.');
      }
    }
    checkSession();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 text-center">
      <h1 className="text-xl font-semibold mb-4">تایید ایمیل</h1>
      <p>{message}</p>
    </div>
  );
}
