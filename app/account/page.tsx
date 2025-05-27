'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { FaSignOutAlt, FaBoxOpen, FaCheckCircle, FaClock } from 'react-icons/fa';
import Image from 'next/image';

interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
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
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push('/auth');
        return;
      }
      setUser(user);

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
            product_name,
            quantity,
            price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('خطا در دریافت سفارشات:', ordersError.message);
      } else {
        const formattedOrders = (data || []).map((order: any) => ({
          ...order,
          items: order.order_items || [],
        }));
        setOrders(formattedOrders);
      }
      setLoading(false);
    }

    fetchUserAndOrders();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  function OrderItemComponent({ order }: { order: Order }) {
    const [expanded, setExpanded] = useState(false);

    const statusColor =
      order.status === 'تحویل‌شده'
        ? 'text-green-600'
        : order.status === 'لغو شده'
        ? 'text-red-500'
        : 'text-yellow-500';

    const totalItems = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
      <li className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow hover:shadow-lg transition-all border">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div>
            <p className="font-semibold text-gray-800">سفارش #{order.id}</p>
            <p className="text-sm text-gray-600 mt-1">
              <FaClock className="inline ml-1" />
              تاریخ: {new Date(order.created_at).toLocaleDateString('fa-IR')}
            </p>
            <p className={`text-sm mt-1 font-medium ${statusColor}`}>
              <FaCheckCircle className="inline ml-1" />
              وضعیت: {order.status || 'در حال پردازش'}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-pink-600">
              {order.total_price.toLocaleString('fa-IR')} تومان
            </p>
            <p className="text-xs text-gray-500">{totalItems} مورد</p>
            <button
              className="text-sm mt-2 text-pink-600 hover:text-pink-800 transition"
              aria-label={expanded ? 'بستن جزئیات سفارش' : 'نمایش جزئیات سفارش'}
            >
              {expanded ? '▲ بستن' : '▼ نمایش'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t text-sm text-gray-700 space-y-2 animate-fade-in-down">
            <p><strong>آدرس ارسال:</strong> {order.address || '-'}</p>
            <ul className="divide-y">
             {order.items?.length && order.items.length > 0 ? (
  order.items.map(item => (
    <li key={item.id} className="py-2 flex justify-between">
      <span>{item.product_name} × {item.quantity}</span>
    </li>
  ))
) : (
  <li className="py-2">سفارشی ثبت نشده است.</li>
)}
            </ul>
          </div>
        )}
      </li>
    );
  }

  if (loading) {
    return <p className="p-6 text-center text-gray-600">در حال بارگذاری...</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-10">
      {/* اطلاعات کاربر */}
      <section className="p-6 bg-white rounded-xl shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-pink-600 mb-2">حساب کاربری شما</h1>
          <p><strong>ایمیل:</strong> {user.email}</p>
          <p><strong>تاریخ عضویت:</strong> {new Date(user.created_at).toLocaleDateString('fa-IR')}</p>
        </div>
        <div className="text-right">
          <Image
            src="/default-avatar.png"
            alt="User Avatar"
            className="w-16 h-16 rounded-full object-cover shadow"
          />
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-800 transition text-sm"
          >
            <FaSignOutAlt />
            خروج
          </button>
        </div>
      </section>

      {/* سفارش‌ها */}
      <section className="p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaBoxOpen className="text-pink-500" />
          سفارش‌های من
        </h2>

        {orders.length === 0 ? (
          <p className="text-gray-600">شما هنوز سفارشی ثبت نکرده‌اید.</p>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <OrderItemComponent key={order.id} order={order} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}


