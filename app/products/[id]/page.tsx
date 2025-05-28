'use client'; // This directive makes this component a Client Component

import { useEffect, useState, useCallback } from 'react'; // Added useCallback
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // Using useParams and useRouter for client-side routing
import { useCart } from '@/context/CartContext'; // Assuming this is a client context
import { supabase } from '@/lib/supabase'; // Supabase client
import { toast } from 'react-hot-toast'; // For notifications
import Image from 'next/image'; // Import Next.js Image component
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
  Info, // For product details
  User, // For user icon in reviews
  Send // For review submission button
} from 'lucide-react'; // Importing necessary icons

// Define the Product interface for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string; // This is the "caption" field you mentioned, it's already here
  discount_percentage?: number;
  category?: string; // Made optional
  inventory?: number; // Made optional, assuming it exists for stock check
  brand?: string; // Added for more detail
  features?: string[]; // Added for more detail
}

// Define the Review interface for type safety
interface Review {
  id: string;
  product_id: string;
  user_id: string;
  user_name?: string; // Assuming you might fetch user's name from auth.users or a profiles table
  rating: number;
  comment: string;
  created_at: string;
  is_approved: boolean;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // State for product data, loading, error, and quantity
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewRating, setNewReviewRating] = useState(0); // For star rating input
  const [newReviewComment, setNewReviewComment] = useState(''); // For comment textarea
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // To store authenticated user info

  // Function to fetch product details - extracted for clarity
  const fetchProductDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true); // Set loading for the whole page
    setError(null);
    setProduct(null);
    try {
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id as string)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        setError('محصول مورد نظر یافت نشد یا خطایی رخ داد.');
        toast.error('خطا در بارگذاری محصول.');
      } else if (!productData) {
        setError('محصول مورد نظر یافت نشد.');
        toast.error('محصول مورد نظر یافت نشد.');
      } else {
        setProduct(productData);
        setQuantity(1);
      }
    } catch (e: any) {
      console.error('Unexpected error:', e);
      setError('خطایی غیرمنتظره رخ داد.');
      toast.error('خطایی غیرمنتظره رخ داد.');
    } finally {
      setLoading(false); // End loading for the whole page
    }
  }, [id]); // id is a dependency for this function

  // Function to fetch approved reviews for the current product - extracted and made callable
  const fetchReviewsForProduct = useCallback(async () => {
    if (!id) return;
    setReviewError(null); // Clear review-specific errors
    try {
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('product_reviews')
        .select(`
            *,
            users:user_id (email) // Fetch user email from auth.users table
          `)
        .eq('product_id', id as string)
        .eq('is_approved', true) // Only fetch approved reviews
        .order('created_at', { ascending: false }); // Order by newest first

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
        setReviewError('خطا در بارگذاری نظرات.');
      } else {
        const formattedReviews: Review[] = reviewsData.map((review: any) => ({
          ...review,
          user_name: review.users ? review.users.email.split('@')[0] : 'کاربر ناشناس', // Use part of email as username
        }));
        setReviews(formattedReviews);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching reviews:', e);
      setReviewError('خطایی غیرمنتظره در بارگذاری نظرات رخ داد.');
    }
  }, [id]); // id is a dependency for this function

  // Main useEffect for initial data load and auth listener
  useEffect(() => {
    fetchProductDetails(); // Fetch product details on mount/id change
    fetchReviewsForProduct(); // Fetch reviews on mount/id change

    // Listen for auth state changes to get current user
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [id, fetchProductDetails, fetchReviewsForProduct]); // Dependencies for initial data fetch and functions

  // Calculate final price with discount
  const hasDiscount = product && product.discount_percentage && product.discount_percentage > 0;
  const finalPrice = product
    ? hasDiscount
      ? Math.round(product.price * (1 - product.discount_percentage! / 100))
      : product.price
    : 0;

  // Handler for adding product to cart
  const handleAddToCart = () => {
    if (product) {
      if (product.inventory !== undefined && product.inventory < quantity) {
        toast.error(`تنها ${product.inventory} عدد از این محصول موجود است.`, {
          position: 'bottom-right',
        });
        return;
      }
      addToCart(product as Product, quantity);
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

  // Handler for submitting a new review
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    setIsSubmittingReview(true);

    if (!currentUser) {
      setReviewError('برای ثبت نظر، لطفاً ابتدا وارد شوید.');
      setIsSubmittingReview(false);
      return;
    }
    if (!newReviewComment.trim() || newReviewRating === 0) {
      setReviewError('لطفاً امتیاز و متن نظر خود را وارد کنید.');
      setIsSubmittingReview(false);
      return;
    }

    try {
      const { data, error: insertError } = await supabase
        .from('product_reviews')
        .insert({
          product_id: id as string,
          user_id: currentUser.id,
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          is_approved: false, // Reviews need admin approval
        });

      if (insertError) {
        throw insertError;
      }

      toast.success('نظر شما با موفقیت ثبت شد و پس از تأیید نمایش داده خواهد شد. ✨', {
        position: 'bottom-right',
      });
      setNewReviewRating(0); // Reset form
      setNewReviewComment('');
      
      // After successful submission, re-fetch reviews to update the list
      // This will only show the review if it's approved by an admin quickly.
      fetchReviewsForProduct(); // <--- ADDED: Re-fetch reviews after submission
    } catch (err: any) {
      console.error('Error submitting review:', err);
      setReviewError('خطا در ثبت نظر: ' + err.message);
      toast.error('خطا در ثبت نظر.');
    } finally {
      setIsSubmittingReview(false);
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
          onClick={() => router.back()}
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
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
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
                    if (product.inventory !== undefined && val > product.inventory) {
                      setQuantity(product.inventory);
                      toast.error(`حداکثر تعداد موجود ${product.inventory} عدد است.`, { position: 'bottom-right' });
                    } else {
                      setQuantity(val);
                    }
                  } else if (e.target.value === '') {
                    setQuantity(0);
                  }
                }}
                onBlur={(e) => {
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
            onClick={handleAddToCart}
            disabled={product.inventory === 0 || loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 text-white py-4 rounded-xl text-xl font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.01] animate-fade-in-up delay-400"
          >
            <ShoppingCart className="w-6 h-6" />
            {product.inventory === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
          </button>

          {/* Product Description (Caption) */}
          <div className="pt-6 border-t border-gray-200 animate-fade-in-up delay-500">
            <h2 className="font-bold text-gray-800 text-xl mb-3">توضیحات محصول:</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {product.description || 'توضیحاتی برای این محصول وجود ندارد.'}
            </p>
          </div>

          {/* Key Features (if available) */}
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

          {/* Customer Reviews Section */}
          <div className="pt-6 border-t border-gray-200 animate-fade-in-up delay-700">
            <h2 className="font-bold text-gray-800 text-xl mb-4">نظرات مشتریان:</h2>

            {/* Display Existing Reviews */}
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">هنوز نظری برای این محصول ثبت نشده است.</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex items-center mb-2">
                      <User className="w-5 h-5 text-gray-600 ml-2" />
                      <span className="font-semibold text-gray-800">{review.user_name || 'کاربر ناشناس'}</span>
                      <span className="text-gray-400 text-sm mr-auto">
                        {new Date(review.created_at).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : ''}`} />
                      ))}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Review Submission Form */}
            <div className="mt-8 p-6 bg-pink-50 rounded-lg shadow-inner border border-pink-100">
              <h3 className="text-xl font-bold text-pink-700 mb-4">نظر خود را ثبت کنید:</h3>
              {!currentUser ? (
                // Message if user is not logged in
                <div className="text-center p-4 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-200">
                  <p className="font-semibold mb-2">برای ثبت نظر، لطفاً ابتدا وارد شوید.</p>
                  <Link href="/login" className="text-pink-600 hover:underline font-medium">
                    ورود / ثبت نام
                  </Link>
                </div>
              ) : (
                // Review form for logged-in users
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">امتیاز شما:</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <Star
                          key={starValue}
                          className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                            starValue <= newReviewRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                          onClick={() => setNewReviewRating(starValue)}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reviewComment" className="block text-gray-700 font-semibold mb-2">
                      متن نظر:
                    </label>
                    <textarea
                      id="reviewComment"
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200"
                      placeholder="نظر خود را درباره این محصول بنویسید..."
                      required
                    ></textarea>
                  </div>

                  {reviewError && <p className="text-red-600 text-sm font-medium">{reviewError}</p>}

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  >
                    {isSubmittingReview ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        ثبت نظر
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
