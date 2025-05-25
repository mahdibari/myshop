import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// **این خطوط رو حذف کن:**
// const supabase = createClient(
//   process.env.SUPABASE_URL!,
//   process.env.SUPABASE_ANON_KEY!
// );

export async function POST(request: Request) {
  try {
    // مطمئن شو که متغیرهای محیطی تعریف شده‌اند
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      throw new Error('Supabase URL or Anon Key are not defined in environment variables.');
    }

    // ایجاد کلاینت Supabase در ابتدای هر درخواست POST
    const supabase = createClient(
      process.env.SUPABASE_URL, // نیازی به ! نیست چون بالا چک کردی
      process.env.SUPABASE_ANON_KEY // نیازی به ! نیست چون بالا چک کردی
    );

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    console.log('Received Authorization header:', authHeader);
    console.log('Received token:', token);

    if (!token) {
      return NextResponse.json({ message: 'توکن احراز هویت موجود نیست' }, { status: 401 });
    }

    // **این قسمت ایجاد دوباره کلاینت Supabase با هدر Authorisation هم درست هست و باید بمونه**
    // **اما اولین createClient در بالای فایل باید حذف بشه.**
    const supabaseWithAuth = createClient( // نام متغیر رو تغییر دادم تا با بالایی قاطی نشه
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    const body = await request.json();
    const { phone, postalCode, address, items } = body;

    if (!phone || !postalCode || !address || !items || !items.length) {
      return NextResponse.json({ message: 'اطلاعات سفارش ناقص است' }, { status: 400 });
    }

    // دریافت کاربر از توکن
    const { data: { user }, error: userError } = await supabaseWithAuth.auth.getUser(); // از supabaseWithAuth استفاده کن

    if (userError || !user) {
      return NextResponse.json({ message: 'کاربر احراز هویت نشده' }, { status: 401 });
    }

    // ثبت سفارش به همراه شناسه کاربر
    const { data: orderData, error: orderError } = await supabaseWithAuth // از supabaseWithAuth استفاده کن
      .from('orders')
      .insert([{ phone, postal_code: postalCode, address, user_id: user.id }])
      .select('id')
      .maybeSingle();

    if (orderError || !orderData) {
      console.error('Order Insert Error:', orderError);
      return NextResponse.json({ message: 'خطا در ثبت سفارش', detail: orderError?.message }, { status: 500 });
    }

    const orderId = orderData.id;

    // ثبت آیتم‌های سفارش
    const orderItems = items.map((item: any) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabaseWithAuth.from('order_items').insert(orderItems); // از supabaseWithAuth استفاده کن

    if (itemsError) {
      console.error('Order Items Insert Error:', itemsError);
      return NextResponse.json({ message: 'خطا در ثبت آیتم‌های سفارش', detail: itemsError?.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'سفارش با موفقیت ثبت شد' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'خطا در ثبت سفارش' }, { status: 500 });
  }
}

