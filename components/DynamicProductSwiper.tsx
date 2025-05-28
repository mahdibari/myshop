    import dynamic from 'next/dynamic';
    import { Product } from '@/context/CartContext'; // یا مسیری که Product را تعریف کرده‌اید

    interface ProductSwiperProps {
      products: Product[];
      showDiscount?: boolean;
    }

    // Dynamic import of ProductSwiper, ensuring it's only rendered on the client side
    const DynamicProductSwiper = dynamic(() => import('@/components/ProductSwiper'), {
      ssr: false, // This is the key: do not render on the server
      loading: () => <div className="flex justify-center items-center h-48 text-gray-500">در حال بارگذاری اسلایدر محصولات...</div>, // Optional loading state
    });

    export default function ProductSwiperWrapper(props: ProductSwiperProps) {
      return <DynamicProductSwiper {...props} />;
    }
    