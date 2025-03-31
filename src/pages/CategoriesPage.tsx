import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaShoppingBag, FaLaptop, FaMobileAlt, FaTshirt, FaHome, FaUtensils, FaGamepad, FaBook, FaShoppingCart, FaSearch, FaTools, FaTv, FaHeadphones } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  image: string;
  productCount: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  category: string;
  description: string;
  stock: number;
}

const categories: Category[] = [
  {
    id: 'Home Appliances',
    name: 'Home Appliances',
    icon: <span className="w-8 h-8"><FaHome /></span>,
    description: 'Quality home appliances for modern living',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D',
    productCount: 150
  },
  {
    id: 'Consumer Electronics',
    name: 'Consumer Electronics',
    icon: <span className="w-8 h-8"><FaLaptop /></span>,
    description: 'Latest gadgets and electronic devices',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    productCount: 120
  },
  {
    id: 'Interior Décor',
    name: 'Interior Décor',
    icon: <span className="w-8 h-8"><FaTshirt /></span>,
    description: 'Stylish home decoration items',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    productCount: 200
  },
  {
    id: 'Tools & Accessories',
    name: 'Tools & Accessories',
    icon: <span className="w-8 h-8"><FaTools /></span>,
    description: 'Professional tools and accessories',
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww',
    productCount: 180
  },
  {
    id: 'Gaming Accessories',
    name: 'Gaming Accessories',
    icon: <span className="w-8 h-8"><FaGamepad /></span>,
    description: 'Premium gaming gear and accessories',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    productCount: 90
  },
  {
    id: 'Audio & Visual Equipment',
    name: 'Audio & Visual Equipment',
    icon: <span className="w-8 h-8"><FaTv /></span>,
    description: 'High-quality audio and visual equipment',
    image: 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtZXJhfGVufDB8fDB8fHww',
    productCount: 75
  }
];

export default function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch products from your API
    const fetchProducts = async () => {
      try {
        // For now, using mock data
        setProducts([
          {
            id: '1',
            name: 'Wireless Headphones Pro',
            price: 199.99,
            rating: 4.9,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            category: 'Consumer Electronics',
            description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
            stock: 15
          },
          // ... rest of the mock products ...
        ]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
      
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#138db3]"
          />
          <span className="absolute left-3 top-3 text-gray-400">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Categories - Horizontal scroll on mobile, grid on desktop */}
      <div className="mb-12">
        {/* Mobile view - Horizontal scroll */}
        <div className="md:hidden overflow-x-auto pb-4 -mx-4 px-4">
          <div className="flex space-x-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`flex-shrink-0 w-32 relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                  selectedCategory === category.id ? 'ring-2 ring-[#138db3]' : ''
                }`}
              >
                <div className="relative h-32">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-white text-sm font-semibold truncate">{category.name}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Desktop view - Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                selectedCategory === category.id ? 'ring-2 ring-[#138db3]' : ''
              }`}
            >
              <div className="relative h-48">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity duration-300" />
              </div>
              <div className="absolute top-4 left-4 text-white">
                <div className="flex items-center space-x-2">
                  {category.icon}
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-white text-sm mb-2">{category.description}</p>
                <p className="text-white/80 text-sm">{category.productCount} products</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Products grid */}
      {selectedCategory && (
        <div>
          <h2 className="text-2xl font-bold mb-6">
            {categories.find(c => c.id === selectedCategory)?.name} Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 