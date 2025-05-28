'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase'; // اطمینان حاصل کنید که مسیر صحیح است
import { useRouter } from 'next/navigation';
import { LogOut, Package, CheckCircle, Clock, XCircle, User, Mail, CalendarDays, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product?: { name: string }; 
}

interface Order {
  id: string;
  total_price: number;
  created_at: string;
  status?: string;
  address?: string;
  items?: OrderItem[];
}

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserAndOrders() {
      setLoading(true); // شروع بارگذاری
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error("خطا در دریافت کاربر یا کاربر وارد نشده است:", error?.message);
        toast.error('برای مشاهده حساب کاربری، لطفاً وارد شوید.');
        router.push('/auth');
        setLoading(false);
        return;
      }
      
      setUser(user);
      console.log("کاربر فعلی:", user);
      console.log("User ID فعلی:", user.id); // لاگ User ID

      const { data, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          total_price,
          created_at,
          status,
          address,
          order_items (
            id,
            quantity,
            price,
            product:products (name) 
          )
        `) // <--- کامنت‌های فارسی از اینجا حذف شدند
        .eq('user_id', user.id) // فیلتر بر اساس user_id کاربر فعلی
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('خطا در دریافت سفارشات:', ordersError.message);
        toast.error('خطا در دریافت سفارشات شما.');
      } else {
        console.log("سفارشات دریافت شده از Supabase:", data); // لاگ داده‌های سفارشات
        const formattedOrders = (data || []).map((order: any) => ({
          ...order,
          items: order.order_items || [],
        }));
        setOrders(formattedOrders);
        if (formattedOrders.length === 0) {
          console.log("هیچ سفارشی برای این کاربر یافت نشد.");
        }
      }
      setLoading(false); // پایان بارگذاری
    }

    fetchUserAndOrders();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  // کامپوننت جداگانه برای نمایش هر آیتم سفارش
  function OrderItemComponent({ order }: { order: Order }) {
    const [expanded, setExpanded] = useState(false);

    const statusInfo = {
      'تحویل‌شده': { color: 'text-green-600', bgColor: 'bg-green-100', icon: <CheckCircle className="inline ml-1 w-4 h-4" /> },
      'لغو شده': { color: 'text-red-600', bgColor: 'bg-red-100', icon: <XCircle className="inline ml-1 w-4 h-4" /> },
      'در حال پردازش': { color: 'text-yellow-600', bgColor: 'bg-yellow-100', icon: <Clock className="inline ml-1 w-4 h-4 animate-spin-slow" /> },
      // می‌توانید وضعیت‌های دیگر را اینجا اضافه کنید
    };

    const currentStatus = order.status && statusInfo[order.status as keyof typeof statusInfo] 
                          ? statusInfo[order.status as keyof typeof statusInfo] 
                          : statusInfo['در حال پردازش']; // وضعیت پیش‌فرض

    const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
      <motion.li 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      >
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div>
            <p className="font-bold text-gray-900 text-lg">سفارش #{order.id}</p>
            <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              تاریخ: {new Date(order.created_at).toLocaleDateString('fa-IR')}
            </p>
            <p className={`text-sm mt-1 font-semibold flex items-center gap-1 ${currentStatus.color}`}>
              {currentStatus.icon}
              وضعیت: {order.status || 'در حال پردازش'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-extrabold text-pink-600 text-xl">
              {order.total_price.toLocaleString('fa-IR')} تومان
            </p>
            <p className="text-xs text-gray-500 mt-1">{totalItems} مورد</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm mt-3 text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 justify-end"
              aria-label={expanded ? 'بستن جزئیات سفارش' : 'نمایش جزئیات سفارش'}
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} 
              {expanded ? 'بستن جزئیات' : 'مشاهده جزئیات'}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-5 pt-5 border-t border-gray-200 text-sm text-gray-700 space-y-3 overflow-hidden"
            >
              <p className="font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-500" />
                آدرس ارسال: <span className="font-normal">{order.address || 'آدرس ثبت نشده است.'}</span>
              </p>
              <h4 className="font-bold text-gray-800 mt-4 mb-2">آیتم‌های سفارش:</h4>
              <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                {order.items?.length && order.items.length > 0 ? (
                  order.items.map(item => (
                    <li key={item.id} className="py-2.5 px-3 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span className="font-medium text-gray-800">{item.product?.name || 'نامشخص'} × {item.quantity}</span>
                      <span className="text-purple-700 font-semibold">{item.price.toLocaleString('fa-IR')} تومان</span>
                    </li>
                  ))
                ) : (
                  <li className="py-2.5 px-3 text-gray-500">هیچ آیتمی برای این سفارش ثبت نشده است.</li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.li>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-700">
        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin-slow mb-4" />
        <p className="text-xl font-semibold">در حال بارگذاری اطلاعات حساب کاربری...</p>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-5xl mx-auto p-6 md:p-10 space-y-10 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl mt-8 mb-12 relative border border-gray-100"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-12 text-purple-700 flex items-center justify-center gap-3">
        <User className="w-10 h-10 text-indigo-500" /> حساب کاربری من
      </h1>

      {/* اطلاعات کاربر */}
      <motion.section 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="p-6 bg-indigo-50 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between border border-indigo-100"
      >
        <div className="flex items-center gap-4 text-right sm:text-right w-full sm:w-auto">
          <Image
            src="/default-avatar.png" // مطمئن شوید این مسیر تصویر آواتار معتبر است
            alt="User Avatar"
            width={80} // اندازه مشخص
            height={80} // اندازه مشخص
            className="w-20 h-20 rounded-full object-cover shadow-md border-2 border-indigo-300"
          />
          <div>
            <h2 className="text-2xl font-bold text-indigo-800 mb-1">
              <span className="text-purple-600">سلام،</span> {user.email?.split('@')[0]}
            </h2>
            <p className="text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <strong>ایمیل:</strong> {user.email}
            </p>
            <p className="text-gray-700 flex items-center gap-2 mt-1">
              <CalendarDays className="w-4 h-4 text-gray-500" />
              <strong>تاریخ عضویت:</strong> {new Date(user.created_at).toLocaleDateString('fa-IR')}
            </p>
          </div>
        </div>
        <div className="mt-6 sm:mt-0 w-full sm:w-auto flex justify-center sm:justify-end">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 8px 15px rgba(239, 68, 68, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            خروج از حساب
          </motion.button>
        </div>
      </motion.section>

      {/* سفارش‌ها */}
      <motion.section 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-gray-200 pb-3 flex items-center gap-3">
          <Package className="text-purple-500 w-6 h-6" />
          سفارش‌های من
        </h2>

        {orders.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 text-lg text-center py-8 bg-gray-50 rounded-xl shadow-inner"
          >
            شما هنوز سفارشی ثبت نکرده‌اید.
          </motion.p>
        ) : (
          <ul className="space-y-4">
            <AnimatePresence>
              {orders.map(order => (
                <OrderItemComponent key={order.id} order={order} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </motion.section>
    </motion.main>
  );
}