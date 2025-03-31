import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, HeadphonesIcon, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

// Mock data until we connect to backend
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Sony PlayStation Pulse Elite Wireless Headset',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.5,
    category: 'Gaming Accessories'
  },
  {
    id: '2',
    name: 'Midea 1.5 hp Inverter Air Conditioner',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.2,
    category: 'Home Appliances'
  },
  {
    id: '3',
    name: 'TCL 55 inch Smart Android TV',
    price: 6500,
    image: 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtZXJhfGVufDB8fDB8fHww',
    rating: 4.0,
    category: 'Audio & Visual Equipment'
  },
  {
    id: '4',
    name: 'Midea 4L Air Fryer',
    price: 1000,
    image: 'https://images.unsplash.com/photo-1527947030665-8b6c8a586350?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW5jYXJlfGVufDB8fDB8fHww',
    rating: 4.7,
    category: 'Home Appliances'
  },
  {
    id: '5',
    name: 'EverydayItems 499 pieces Professional Tool Set',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww',
    rating: 4.8,
    category: 'Tools & Accessories'
  },
  {
    id: '6',
    name: 'Beats 2023/24 Beats Pill',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHdhdGNofGVufDB8fDB8fHww',
    rating: 4.3,
    category: 'Audio & Visual Equipment'
  },
  {
    id: '7',
    name: 'Samsung 55 inch QLED Smart 4K TV',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGNoYWlyfGVufDB8fDB8fHww',
    rating: 4.6,
    category: 'Audio & Visual Equipment'
  },
  {
    id: '8',
    name: 'EverydayItems Safe Box',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.1,
    category: 'Tools & Accessories'
  }
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [popularCategories] = useState<string[]>([
    'Home Appliances',
    'Consumer Electronics',
    'Interior Décor',
    'Tools & Accessories',
    'Gaming Accessories',
    'Audio & Visual Equipment'
  ]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const carouselImages = [
    {
      src: "https://instagram.facc9-1.fna.fbcdn.net/v/t39.30808-6/420171752_18413574430003722_8966613888332843146_n.jpg?se=-1&stp=dst-jpegr_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5oZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.facc9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QHQPLH7P3q9Aew4PpTUl64cSUZendqdD_vEbSCEWOVxrSMhdT0o0EObK66VJHeV9ZY&_nc_ohc=SHZjc7Gn9KsQ7kNvgHsGFcm&_nc_gid=mDfkO0XRiVo2-6bN83EU2Q&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzMwMzQyMDg3NDk2MDk5MjM2OA%3D%3D.3-ccb7-5&oh=00_AYGFRCpI6vMfflyj3xIAW32ufhnK9femXXbViRxMNspAsw&oe=67EB3CF6&_nc_sid=22de04",
      alt: "Shopping Experience"
    },
    {
      src: "https://instagram.facc9-1.fna.fbcdn.net/v/t39.30808-6/468963755_18471055591003722_5294479725021158901_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5zZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.facc9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFpMZDDmLVmfRAv0vGsPOLWDiacnK-_LkNrotTh1ucGLWpj9iMTsJhQ9WcC3jjW7tI&_nc_ohc=CMXDBWATt2EQ7kNvgFwKutU&_nc_gid=U-BA9fdE7lj4roVbT4lPdA&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzI5NDYxMDMwNDg1NDAyOTAxMQ%3D%3D.3-ccb7-5&oh=00_AYEGEzAYzTAqlwQzgIfbavYaAQ8lhMsPbBes-7U9rNXuaQ&oe=67EB271B&_nc_sid=22de04",
      alt: "Shopping Experience"
    },
    {
      src: "https://instagram.facc9-1.fna.fbcdn.net/v/t39.30808-6/417465829_18413639950003722_884779375456428966_n.jpg?se=-1&stp=dst-jpegr_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5oZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.facc9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QHQPLH7P3q9Aew4PpTUl64cSUZendqdD_vEbSCEWOVxrSMhdT0o0EObK66VJHeV9ZY&_nc_ohc=J3aGpgg0zrsQ7kNvgFrSPji&_nc_gid=mDfkO0XRiVo2-6bN83EU2Q&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzMwMzcxMzQ2MDI1NDc5NDM2NA%3D%3D.3-ccb7-5&oh=00_AYG6DtQFIjzQdjf3sSbv42Nq2XmODxvz40MhliCksskUZA&oe=67EB3901&_nc_sid=22de04",
      alt: "Shopping Experience"
    },
    {
      src: "https://instagram.facc9-1.fna.fbcdn.net/v/t39.30808-6/451549510_18444552820003722_1200580079396413487_n.jpg?se=-1&stp=dst-jpegr_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0uaW1hZ2VfdXJsZ2VuLjE0NDB4MTgwMC5oZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.facc9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QGCJE_6I0txMXpiJqsE3MPGKFYMrij_JIagZwboLz_Tv1m7gXajb3dqzvpc4ENfYzY&_nc_ohc=0dEgniz1bHwQ7kNvgF4SYsg&_nc_gid=IU_ZZvrK6frGv4ZCkWR7Ow&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzQxMjgzNTkxNjM0MDQ1MjQ0NA%3D%3D.3-ccb7-5&oh=00_AYEhV357w8D3utqhG9yMsHapL80yyJfsQntI9WJGvKbGnQ&oe=67EB4C06&_nc_sid=22de04",
      alt: "Shopping Experience"
    },
    {
      src: "https://instagram.facc9-1.fna.fbcdn.net/v/t39.30808-6/472336741_18478018702003722_7139606893946397615_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjEyODB4MTI4MC5zZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.facc9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QFU_AiyvhLwWDyUtMcPL0cJZK708ox9zFv1-kwLPhqlza7bYboo_qlULK32_07ZpE4&_nc_ohc=JyUTufaefNkQ7kNvgHAOzek&_nc_gid=0oIoOTT6vO-OwJu9xicVHw&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzQ0ODgxODYyOTA2NDg0MTY4Mw%3D%3D.3-ccb7-5&oh=00_AYFj3HMbp3A5lQkBDHX2eKII6uNwan4QYmeM_OkTjO5cXQ&oe=67EB3267&_nc_sid=22de04",
      alt: "Shopping Experience"
    },
    {
      src: "https://instagram.facc9-1.fna.fbcdn.net/v/t39.30808-6/468573837_18470711158003722_7493380157624751305_n.jpg?stp=dst-jpg_e35_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQuaW1hZ2VfdXJsZ2VuLjE0NDB4MTc5OS5zZHIuZjMwODA4LmRlZmF1bHRfaW1hZ2UifQ&_nc_ht=instagram.facc9-1.fna.fbcdn.net&_nc_cat=106&_nc_oc=Q6cZ2QHeLNtfpl2NFMI_n21sSgkA5j7NeFfEL68tnnBwR07cFz0XqLYZt4UMp_zo36bbXco&_nc_ohc=4sXtlR4mjWQQ7kNvgG18ZRc&_nc_gid=s8mqWZMcYwLZdSaK7dUURA&edm=APoiHPcAAAAA&ccb=7-5&ig_cache_key=MzIxMTI4Njc3ODUzNzk0ODYzMQ%3D%3D.3-ccb7-5&oh=00_AYF1h9RMox83H0I9V8czht0MSfhGxKkqDk9o-_zR4APUGw&oe=67EB252D&_nc_sid=22de04",
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
    // In a real app, we would fetch from backend
    // For now, using mock data
    setFeaturedProducts(MOCK_PRODUCTS.slice(0, 4));
    setNewArrivals(MOCK_PRODUCTS.slice(4, 8));

    // Example of how we would fetch in a real app:
    // const fetchFeaturedProducts = async () => {
    //   try {
    //     const response = await axios.get('/api/products/featured');
    //     setFeaturedProducts(response.data.products);
    //   } catch (error) {
    //     console.error('Failed to fetch featured products:', error);
    //   }
    // };
    // fetchFeaturedProducts();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#138db3]/10 py-24 md:py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-left mb-6">
              Your Premium <span className="text-[#138db3]">Electronics Store</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-md">
              Discover high-quality products sourced from the UK. From home appliances to gaming accessories, 
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
                <p className="text-sm text-slate-500">On all orders</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-6 border border-slate-200 rounded-lg">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-[#138db3]" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
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
