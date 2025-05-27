'use client'; // This directive makes this component a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // Using useParams and useRouter for client-side routing
import { useCart } from '@/context/CartContext'; // Assuming this is a client context
import { supabase } from '@/lib/supabase'; // Supabase client
import { toast } from 'react-hot-toast'; // For notifications
import {
  BadgePercent,
  ShoppingCart,
  Tag,
  MinusCircle,
  PlusCircle,
  ArrowLeft,
  Loader2,
  CheckCircle,
  XCircle,
  Star, // For potential ratings/reviews
  Info // For product details
} from 'lucide-react'; // Importing necessary icons

// Define the Product interface for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string; // Made optional
  discount_percentage?: number;
  category?: string; // Made optional
  inventory?: number; // Made optional, assuming it exists for stock check
  brand?: string; // Added for more detail
  features?: string[]; // Added for more detail
}

// ProductPage component
export default function ProductPage() {
  const { id } = useParams(); // Get product ID from URL parameters (client-side)
  const router = useRouter(); // Initialize Next.js router
  const { addToCart } = useCart(); // Get addToCart function from CartContext

  // State for product data, loading, error, and quantity
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1); // State for quantity selector

  // useEffect to fetch product data when component mounts or ID changes
  useEffect(() => {
    async function fetchProduct() {
      if (!id) return; // Do nothing if ID is not available yet

      setLoading(true); // Start loading
      setError(null); // Clear previous errors
      setProduct(null); // Clear previous product data

      try {
        const { data, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id as string) // Cast id to string
          .single(); // Fetch a single product

        if (fetchError) {
          console.error('Error fetching product:', fetchError);
          setError('محصول مورد نظر یافت نشد یا خطایی رخ داد.');
          toast.error('خطا در بارگذاری محصول.');
        } else if (!data) {
          setError('محصول مورد نظر یافت نشد.');
          toast.error('محصول مورد نظر یافت نشد.');
        } else {
          setProduct(data); // Set product data
          setQuantity(1); // Reset quantity to 1 when a new product is loaded
        }
      } catch (e: any) {
        console.error('Unexpected error:', e);
        setError('خطایی غیرمنتظره رخ داد.');
        toast.error('خطایی غیرمنتظره رخ داد.');
      } finally {
        setLoading(false); // End loading
      }
    }

    fetchProduct(); // Call the fetch function
  }, [id]); // Dependency array: re-run effect if ID changes

  // Calculate final price with discount
  const hasDiscount = product && product.discount_percentage && product.discount_percentage > 0;
  const finalPrice = product
    ? hasDiscount
      ? Math.round(product.price * (1 - product.discount_percentage! / 100))
      : product.price
    : 0; // Default to 0 if product is null

  // Handler for adding product to cart
  const handleAddToCart = () => {
    if (product) {
      // Check if product is in stock
      if (product.inventory !== undefined && product.inventory < quantity) {
        toast.error(`تنها ${product.inventory} عدد از این محصول موجود است.`, {
          position: 'bottom-right',
        });
        return;
      }
      addToCart(product, quantity); // Add product with specified quantity to cart
      toast.success(`${quantity} عدد از ${product.name} به سبد خرید اضافه شد 🛒`, {
        duration: 2000,
        position: 'bottom-right',
        iconTheme: {
          primary: '#DB2777',
          secondary: '#FFFFFF',
        },
      });
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-pink-600 mb-4" />
        <p className="text-xl font-semibold">در حال بارگذاری محصول...</p>
      </div>
    );
  }

  // Render error state (e.g., product not found)
  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <XCircle className="w-12 h-12 mb-4" />
        <h2 className="text-2xl font-bold mb-2">خطا</h2>
        <p className="text-lg">{error || 'محصول مورد نظر یافت نشد.'}</p>
        <button
          onClick={() => router.back()} // Go back to previous page
          className="mt-8 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          بازگشت به محصولات
        </button>
      </div>
    );
  }

  // Main product display
  return (
    <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">
      {/* Back to Products Button */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors duration-200 font-semibold"
      >
        <ArrowLeft className="w-5 h-5" />
        بازگشت به محصولات
      </button>

      <div className="grid md:grid-cols-2 gap-10 items-start bg-white rounded-3xl shadow-xl p-8 border border-gray-100 animate-slide-in-up">
        {/* Product Image Section */}
        <div className="w-full h-[450px] rounded-2xl overflow-hidden shadow-2xl relative group transform hover:scale-[1.01] transition-transform duration-500">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.currentTarget.src = `https://placehold.co/600x450/FCE7F3/BE185D?text=No+Image`; }} // Fallback image
          />
          {hasDiscount && (
            <span className="absolute top-4 right-4 bg-pink-600 text-white text-sm px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-bounce-in">
              <BadgePercent className="w-4 h-4" />
              {product.discount_percentage}% تخفیف
            </span>
          )}
        </div>

        {/* Product Information Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
          <h1 className="text-4xl font-extrabold text-pink-700 mb-4 animate-fade-in-up">
            {product.name}
          </h1>

          {/* Category and Brand (if available) */}
          {(product.category || product.brand) && (
            <div className="flex items-center gap-4 text-gray-600 text-lg animate-fade-in-up delay-100">
              {product.category && (
                <p className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-500" />
                  دسته‌بندی: <span className="font-semibold text-gray-800">{product.category}</span>
                </p>
              )}
              {product.brand && (
                <p className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-gray-500" />
                  برند: <span className="font-semibold text-gray-800">{product.brand}</span>
                </p>
              )}
            </div>
          )}

          {/* Price Display */}
          <div className="text-xl space-y-2 py-3 border-y border-gray-200 animate-fade-in-up delay-200">
            <p className="text-gray-800 flex items-center gap-2">
              <span className="font-bold">قیمت:</span>
              {hasDiscount ? (
                <>
                  <span className="text-gray-500 line-through text-lg ml-2">
                    {product.price.toLocaleString('fa-IR')} تومان
                  </span>
                  <span className="text-pink-600 font-extrabold text-3xl animate-pulse-fade">
                    {finalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </>
              ) : (
                <span className="text-pink-600 font-extrabold text-3xl">
                  {product.price.toLocaleString('fa-IR')} تومان
                </span>
              )}
            </p>

            {/* Inventory Status */}
            {product.inventory !== undefined && (
              <p className={`font-bold text-lg ${product.inventory > 0 ? 'text-green-600' : 'text-red-500'}`}>
                {product.inventory > 0
                  ? <><CheckCircle className="inline-block w-5 h-5 mr-1" /> {product.inventory} عدد موجود است</>
                  : <><XCircle className="inline-block w-5 h-5 mr-1" /> ناموجود</>}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 animate-fade-in-up delay-300">
            <label htmlFor="quantity" className="font-semibold text-gray-700">تعداد:</label>
            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden shadow-sm">
              <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                <MinusCircle className="w-6 h-6" />
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val >= 1) {
                    // Limit quantity to inventory if available
                    if (product.inventory !== undefined && val > product.inventory) {
                      setQuantity(product.inventory);
                      toast.error(`حداکثر تعداد موجود ${product.inventory} عدد است.`, { position: 'bottom-right' });
                    } else {
                      setQuantity(val);
                    }
                  } else if (e.target.value === '') {
                    setQuantity(0); // Allow clearing input
                  }
                }}
                onBlur={(e) => { // Reset to 1 if input is empty on blur
                  if (e.target.value === '' || parseInt(e.target.value) === 0) {
                    setQuantity(1);
                  }
                }}
                min="1"
                max={product.inventory !== undefined ? product.inventory : undefined}
                className="w-16 text-center text-lg font-semibold border-x border-gray-300 focus:outline-none focus:ring-0"
              />
              <button
                onClick={() => setQuantity(prev => (product.inventory !== undefined && prev >= product.inventory) ? prev : prev + 1)}
                disabled={product.inventory !== undefined && quantity >= product.inventory}
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors duration-200 disabled:opacity-50"
              >
                <PlusCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart} // Call the new handler
            disabled={product.inventory === 0 || loading} // Disable if out of stock or loading
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white py-4 rounded-xl text-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] animate-fade-in-up delay-400"
          >
            <ShoppingCart className="w-6 h-6" />
            {product.inventory === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
          </button>

          {/* Product Description */}
          <div className="pt-6 border-t border-gray-200 animate-fade-in-up delay-500">
            <h2 className="font-bold text-gray-800 text-xl mb-3">توضیحات محصول:</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description || 'توضیحاتی برای این محصول وجود ندارد.'}
            </p>
          </div>

          {/* Placeholder for Key Features (if you add this data to Supabase) */}
          {product.features && product.features.length > 0 && (
            <div className="pt-6 border-t border-gray-200 animate-fade-in-up delay-600">
              <h2 className="font-bold text-gray-800 text-xl mb-3">ویژگی‌های کلیدی:</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Placeholder for Customer Reviews (future enhancement) */}
          <div className="pt-6 border-t border-gray-200 animate-fade-in-up delay-700">
            <h2 className="font-bold text-gray-800 text-xl mb-3">نظرات مشتریان:</h2>
            <div className="flex items-center gap-1 text-yellow-500 mb-2">
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5 fill-current" />
              <Star className="w-5 h-5" />
              <Star className="w-5 h-5" />
              <span className="text-gray-600 text-sm mr-2">(3.5 از 5 ستاره بر اساس 25 نظر)</span>
            </div>
            <p className="text-gray-600 italic">
              "این محصول فوق‌العاده است! پوست من را نرم و درخشان کرد." - سارا ا.
            </p>
            <button className="mt-4 text-pink-600 hover:text-pink-800 font-semibold transition-colors duration-200">
              مشاهده همه نظرات
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

