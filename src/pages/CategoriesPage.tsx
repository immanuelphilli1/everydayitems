import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import ProductCard from '@/components/ProductCard';

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

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

export default function CategoriesPage() {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setLoading(true);
        // Fetch all products first
        const productsResponse = await fetch('http://localhost:3001/api/products');
        const productsData = await productsResponse.json();

        if (productsData.status === 'success') {
          setProducts(productsData.products);
          
          // Create categories from products
          const categoryMap = new Map<string, Category>();
          
          productsData.products.forEach((product: Product) => {
            if (!categoryMap.has(product.category)) {
              categoryMap.set(product.category, {
                id: product.category,
                name: product.category,
                description: `Browse our collection of ${product.category}`,
                image: product.image, // Using first product image as category image
                productCount: 0
              });
            }
            const category = categoryMap.get(product.category)!;
            category.productCount++;
          });

          setCategories(Array.from(categoryMap.values()));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-200 h-48 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
                    src={`http://localhost:3001${category.image}`}
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
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
              className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                selectedCategory === category.id ? 'ring-4 ring-[#138db3] bg-[#138db3]' : ''
              }`}
            >
              <div className="relative h-48">
                <img
                  src={`http://localhost:3001${category.image}`}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-opacity duration-300" />
              </div>
              <div className="absolute top-4 left-4 text-white">
                <div className="flex items-center space-x-2">
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