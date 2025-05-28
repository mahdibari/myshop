'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { Search, Loader2, ShoppingCart as ShoppingCartIcon, Eye } from 'lucide-react'; // Added Search, Loader2, Eye icons

// Define the Product interface for type safety
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  discount_percentage?: number;
}

// Component for a skeleton product card (shown during loading)
const ProductCardSkeleton = () => (
  <div className="bg-gray-200 rounded-2xl shadow-md p-4 flex flex-col h-full animate-pulse border border-gray-100">
    {/* Placeholder for product image */}
    <div className="h-52 w-full mb-4 bg-gray-300 rounded-xl"></div>
    <div className="flex flex-col flex-grow justify-between text-center">
      {/* Placeholder for product name */}
      <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
      {/* Placeholder for product price */}
      <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
      {/* Placeholder for "Add to Cart" button */}
      <div className="h-10 bg-gray-300 rounded-full w-full mb-2"></div>
      {/* Placeholder for "View Details" button */}
      <div className="h-10 bg-gray-300 rounded-full w-full"></div>
    </div>
  </div>
);

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]); // Stores all fetched products
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default'); // State for sorting order
  const [searchTerm, setSearchTerm] = useState(''); // New state for search input
  const { addToCart } = useCart(); // Cart context hook

  // useEffect to fetch products from Supabase
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true); // Set loading to true before fetching
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error('Error fetching products:', error);
        toast.error('خطا در بارگذاری محصولات.');
      } else {
        setProducts(data || []); // Set products if data is available
      }
      setLoading(false); // Set loading to false after fetching
    }
    fetchProducts();
  }, []); // Empty dependency array means this runs once on component mount

  // Filter and sort products based on search term and sort order
  const filteredAndSortedProducts = products
    .filter(product =>
      // Filter by product name (case-insensitive)
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      // Sort logic based on sortOrder state
      if (sortOrder === 'asc') {
        return a.price - b.price; // Ascending order
      } else if (sortOrder === 'desc') {
        return b.price - a.price; // Descending order
      }
      return 0; // Default order (maintains original order from fetch)
    });

  return (
    <main className="max-w-6xl mx-auto p-6 animate-fade-in">
      {/* Page Title and Description */}
      <h1 className="text-4xl font-bold mb-4 text-center text-pink-600">
        <span className="inline-block animate-fade-in-up">محصولات ما</span>
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in-up delay-100">
        زیباترین محصولات مراقبت از پوست و زیبایی را اینجا پیدا کنید.
        کیفیت و اصالت، تضمین ماست.
      </p>

      {/* Search and Sort Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="جستجو محصولات..."
            className="w-full border rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center w-full md:w-auto">
          <label htmlFor="sort" className="ml-2 font-semibold text-gray-700 whitespace-nowrap">مرتب‌سازی:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="border rounded-full px-5 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200 cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'none\' stroke=\'currentColor\'%3e%3cpath d=\'M7 7l3-3 3 3m0 6l-3 3-3-3\'/%3c/svg%3e')] bg-no-repeat bg-[length:1.2em] bg-[right_1.2em_center]"
            // Inline style for custom arrow in select dropdown for better cross-browser consistency
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='currentColor'%3E%3Cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3'/%3E%3C/svg%3E")` }}
          >
            <option value="default">پیش‌فرض</option>
            <option value="asc">قیمت: کم به زیاد</option>
            <option value="desc">قیمت: زیاد به کم</option>
          </select>
        </div>
      </div>

      {/* Conditional rendering based on loading state and filtered products */}
      {loading ? (
        // Show skeleton loaders while products are loading
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => ( // Display 8 skeleton cards
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSortedProducts.length === 0 ? (
        // Show "No products found" message if no products match the search/filters
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl p-8 shadow-inner mt-10 animate-fade-in">
          <h2 className="text-2xl font-semibold mb-4">محصولی یافت نشد 😔</h2>
          <p className="text-gray-600">
            متاسفانه محصولی با مشخصات مورد نظر شما پیدا نکردیم.
            <br />
            لطفاً عبارت جستجو را تغییر دهید یا فیلترها را بازنشانی کنید.
          </p>
          {searchTerm && ( // Show clear search button only if there's a search term
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 bg-pink-500 text-white py-2 px-6 rounded-full hover:bg-pink-600 transition-colors duration-200 shadow-md"
            >
              پاک کردن جستجو
            </button>
          )}
        </div>
      ) : (
        // Display the product grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredAndSortedProducts.map((product) => {
            const discountedPrice = product.discount_percentage
              ? Math.round(product.price * (1 - product.discount_percentage / 100))
              : product.price;

            return (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-4 flex flex-col h-full relative overflow-hidden border border-gray-100 animate-fade-in-up"
              >
                {/* Discount Badge */}
                {product.discount_percentage && product.discount_percentage > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold z-10 animate-fade-in-down">
                    {product.discount_percentage}% تخفیف
                  </span>
                )}
                {/* Product Image Link */}
                <Link href={`/products/${product.id}`} className="relative h-52 w-full mb-4 block rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    width={500} // ابعاد واقعی تصویر رو اینجا وارد کن
                    height={500}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/FCE7F3/BE185D?text=No+Image`; }} // Fallback image on error
                  />
                </Link>

                {/* Product Details */}
                <div className="flex flex-col flex-grow justify-between text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={product.name}>
                    {product.name}
                  </h3>
                  {/* Price Display (Original vs. Discounted) */}
                  {product.discount_percentage && product.discount_percentage > 0 ? (
                    <div className="flex flex-col items-center justify-center mb-4">
                      <span className="text-sm text-gray-400 line-through">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                      <span className="text-2xl font-extrabold text-red-600 animate-pulse-fade">
                        {discountedPrice.toLocaleString('fa-IR')} تومان
                      </span>
                    </div>
                  ) : (
                    <p className="text-2xl font-extrabold text-pink-600 mb-4">
                      {product.price.toLocaleString('fa-IR')} تومان
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 mt-auto">
                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        e.stopPropagation(); // Stop event propagation
                       addToCart(product, 1);// Add product to cart
                        toast.success(`${product.name} به سبد خرید اضافه شد 🛒`, {
                          duration: 2000,
                          position: 'bottom-right',
                          iconTheme: { // Custom icon theme for toast
                            primary: '#DB2777',
                            secondary: '#FFFFFF',
                          },
                        });
                      }}
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-full transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <ShoppingCartIcon className="w-5 h-5" />
                      افزودن به سبد خرید
                    </button>
                    {/* View Details Button */}
                    <Link
                      href={`/products/${product.id}`}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-full transition-all duration-300 font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105"
                    >
                      <Eye className="w-5 h-5" />
                      مشاهده جزئیات
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

