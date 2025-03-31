import { useState, useEffect } from 'react';
import { ChevronDown, Filter, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';

// Using the same mock data from HomePage
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
}

// Import mock data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Noise Cancelling Headphones',
    price: 299.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.5,
    category: 'Electronics'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt - Sustainable Fashion',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.2,
    category: 'Clothing'
  },
  {
    id: '3',
    name: 'Smart Home Security Camera - 1080p HD',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtZXJhfGVufDB8fDB8fHww',
    rating: 4.0,
    category: 'Smart Home'
  },
  {
    id: '4',
    name: 'Organic Skincare Gift Set - All Natural',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1527947030665-8b6c8a586350?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW5jYXJlfGVufDB8fDB8fHww',
    rating: 4.7,
    category: 'Beauty'
  },
  {
    id: '5',
    name: 'Professional Chef Knife Set - 5 Piece',
    price: 129.99,
    originalPrice: 159.99,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww',
    rating: 4.8,
    category: 'Kitchen'
  },
  {
    id: '6',
    name: 'Fitness Smart Watch with Heart Rate Monitor',
    price: 159.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHdhdGNofGVufDB8fDB8fHww',
    rating: 4.3,
    category: 'Electronics'
  },
  {
    id: '7',
    name: 'Ultra Comfortable Ergonomic Office Chair',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fGNoYWlyfGVufDB8fDB8fHww',
    rating: 4.6,
    category: 'Furniture'
  },
  {
    id: '8',
    name: 'Portable Bluetooth Speaker - Waterproof',
    price: 69.99,
    originalPrice: 89.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D',
    rating: 4.1,
    category: 'Electronics'
  },
  {
    id: '9',
    name: 'Premium Wireless Gaming Mouse',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzF8fG1vdXNlfGVufDB8fDB8fHww',
    rating: 4.4,
    category: 'Electronics'
  },
  {
    id: '10',
    name: 'Designer Leather Wallet for Men',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2FsbGV0fGVufDB8fDB8fHww',
    rating: 4.3,
    category: 'Accessories'
  },
  {
    id: '11',
    name: 'Stainless Steel Water Bottle - 32oz',
    price: 24.99,
    originalPrice: 29.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhdGVyJTIwYm90dGxlfGVufDB8fDB8fHww',
    rating: 4.7,
    category: 'Kitchen'
  },
  {
    id: '12',
    name: 'Handcrafted Ceramic Coffee Mug Set',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29mZmVlJTIwbXVnfGVufDB8fDB8fHww',
    rating: 4.9,
    category: 'Kitchen'
  }
];

const sortOptions = [
  { label: 'Recommended', value: 'recommended' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Customer Rating', value: 'rating' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Extract unique categories from products
  const categories = [...new Set(MOCK_PRODUCTS.map(product => product.category))];

  useEffect(() => {
    // In a real app, we would fetch from API
    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(MOCK_PRODUCTS);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Apply filters and sorting
  const filteredProducts = products.filter(product => {
    // Filter by search term
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by category
    if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
      return false;
    }

    // Filter by price range
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort products
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        // In real app, would use creation date
        return parseInt(b.id) - parseInt(a.id);
      default:
        return 0;
    }
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = parseInt(event.target.value);
    setPriceRange(prev => {
      const newRange = [...prev] as [number, number];
      newRange[index] = value;
      return newRange;
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 500]);
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">All Products</h1>

        <div className="flex items-center gap-4">
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            className="md:hidden flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filters
          </Button>

          {/* Sort dropdown */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-md px-3 py-2 cursor-pointer">
              <SlidersHorizontal size={16} className="text-slate-500" />
              <select
                className="bg-transparent appearance-none px-4 cursor-pointer focus:outline-none text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters sidebar */}
        <div className={`md:w-1/4 md:block ${showFilters ? 'block' : 'hidden'}`}>
          <div className="bg-white border border-slate-200 rounded-lg p-6 sticky top-24">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Filters</h2>
              {(selectedCategories.length > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={clearFilters}
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category filter */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Category</h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price range filter */}
            <div>
              <h3 className="font-medium mb-3">Price Range</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
                <div className="flex gap-4">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceChange(e, 0)}
                    className="w-full"
                  />
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceChange(e, 1)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-lg h-80 animate-pulse"></div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-slate-500">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-slate-500 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
