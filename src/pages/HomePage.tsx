import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, HeadphonesIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { FaMoneyBill } from 'react-icons/fa';
import ad1 from '@/assets/images/carousel/ad-1.jpg';
import ad2 from '@/assets/images/carousel/ad-2.jpg';
import ad3 from '@/assets/images/carousel/ad-3.jpg';
import ad4 from '@/assets/images/carousel/ad-4.jpg';
import ad5 from '@/assets/images/carousel/ad-5.jpg';
import ad6 from '@/assets/images/carousel/ad-6.jpg';
import ad7 from '@/assets/images/carousel/ad-7.jpg';
import ad8 from '@/assets/images/carousel/ad-8.jpg';
import ad9 from '@/assets/images/carousel/ad-9.jpg';
import ad10 from '@/assets/images/carousel/ad-10.jpg';
import ad0 from '@/assets/images/carousel/april.jpg';
interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  featured: boolean;
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [popularCategories, setPopularCategories] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    {
      src: ad0,
      alt: "Shopping Experience"
    },
    {
      src: ad1,
      alt: "Shopping Experience"
    },
    {
      src: ad2,
      alt: "Shopping Experience"
    },
    {
      src: ad3,
      alt: "Shopping Experience"
    },
    {
      src: ad4,
      alt: "Shopping Experience"
    },
    {
      src: ad5,
      alt: "Shopping Experience"
    },
    {
      src: ad6,
      alt: "Shopping Experience"
    },
    {
      src: ad7,
      alt: "Shopping Experience"
    },
    {
      src: ad8,
      alt: "Shopping Experience"
    },
    {
      src: ad9,
      alt: "Shopping Experience"
    },
    { 
      src: ad10,
      alt: "Shopping Experience"
    }
  ];

  useEffect(() => {
    // Auto-advance carousel every 5 seconds
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/products');
        const data = await response.json();
        
        if (data.status === 'success') {
          // Get featured products
          const featured = data.products.filter((product: Product) => product.featured);
          setFeaturedProducts(featured);

          // Get new arrivals (last 4 products)
          const sortedByNewest = [...data.products].sort((a: Product, b: Product) => 
            parseInt(b.id) - parseInt(a.id)
          );
          setNewArrivals(sortedByNewest.slice(0, 4));

          // Get unique categories from products
          const uniqueCategories = [...new Set(data.products.map((product: Product) => product.category))] as string[];
          setPopularCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#138db3]/10 py-24 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-left mb-6">
              Your Premium <span className="text-[#138db3]">Everyday Store</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-md">
              Discover high-quality products sourced from the UK and abroad. From home appliances to gaming accessories, 
              we've got everything you need for your everyday life.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button variant="primary" size="lg" className="gap-2">
                  Shop Now <ArrowRight size={16} />
                </Button>
              </Link>
              <Link to="/categories">
                <Button variant="outline" size="lg">
                  Explore Categories
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full h-[18em] md:h-[33em] rounded-lg shadow-xl overflow-hidden">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute w-full h-full transition-opacity duration-500 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <button
                onClick={previousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg md:flex items-center gap-3 hidden">
              <div className="bg-[#138db3]/20 p-2 rounded-full">
                <ShoppingBag className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <p className="font-medium">Trusted by</p>
                <p className="text-sm text-slate-500">5K+ customers in Ghana</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4 p-6 border border-slate-200 rounded-lg">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <Truck className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">Free Delivery</h3>
                <p className="text-sm text-slate-500">On most orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 border border-slate-200 rounded-lg">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <FaMoneyBill className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">Competitive Prices</h3>
                <p className="text-sm text-slate-500">Best deals in Ghana</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 border border-slate-200 rounded-lg">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <ShoppingBag className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">UK Sourced</h3>
                <p className="text-sm text-slate-500">Premium quality products</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 border border-slate-200 rounded-lg">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <HeadphonesIcon className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">7 AM - 7 PM</h3>
                <p className="text-sm text-slate-500">Daily support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Featured Products</h2>
            <Link to="/products" className="text-[#138db3] hover:text-[#138db3]/80 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {popularCategories.map((category, index) => (
              <Link
                key={index}
                to={`/categories?category=${encodeURIComponent(category)}`}
                className="bg-white border border-slate-200 rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#138db3]/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-[#138db3] font-bold">{category.charAt(0)}</span>
                  </div>
                  <h3 className="font-medium text-slate-900">{category}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-slate-900">New Arrivals</h2>
            <Link to="/products" className="text-[#138db3] hover:text-[#138db3]/80 flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-[#138db3] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">
            Stay updated with the latest products, exclusive offers, and shopping tips.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md text-black flex-grow focus:outline-none focus:ring-2 focus:ring-[#138db3]"
            />
            <Button variant="default" className="bg-slate-900 hover:bg-slate-800 text-white px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
