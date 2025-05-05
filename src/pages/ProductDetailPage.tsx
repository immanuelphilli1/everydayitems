import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  featured: boolean;
}


export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/products/${id}`);
        const data = await response.json();

        if (data.status === 'success') {
          setProduct(data.product);
          // Fetch related products after getting the current product
          fetchRelatedProducts(data.product.category);
        } else {
          setError('Failed to load product details');
        }
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedProducts = async (category: string) => {
      try {
        setLoadingRelated(true);
        const response = await fetch(`http://localhost:3001/api/products?category=${category}`);
        const data = await response.json();

        if (data.status === 'success') {
          // Filter out the current product and get 4 random products
          const filteredProducts = data.products.filter((p: Product) => p.id !== id);
          let randomProducts = filteredProducts;

          // If we don't have enough products in the same category, fetch more from other categories
          if (filteredProducts.length < 4) {
            const otherResponse = await fetch('http://localhost:3001/api/products');
            const otherData = await otherResponse.json();
            
            if (otherData.status === 'success') {
              const otherProducts = otherData.products
                .filter((p: Product) => p.id !== id && p.category !== category)
                .slice(0, 4 - filteredProducts.length);
              
              randomProducts = [...filteredProducts, ...otherProducts];
            }
          }

          // Shuffle and take first 4
          const shuffled = randomProducts.sort(() => 0.5 - Math.random());
          setRelatedProducts(shuffled.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoadingRelated(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    if (type === 'increase') {
      if (product && quantity < product.stock) {
        setQuantity(prev => prev + 1);
      }
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({
        productId: product.id,
        status: 'active',
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
      toast.success('Added to cart', {position: 'top-center'});
    }
  };


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-slate-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-slate-200 rounded w-3/4"></div>
              <div className="h-6 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-full mt-6"></div>
              <div className="h-4 bg-slate-200 rounded w-full"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-12 bg-slate-200 rounded w-1/3 mt-8"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-slate-600 mb-6">{error || 'Product not found'}</p>
        <Link to="/products">
          <Button variant="primary">Back to Products</Button>
        </Link>
      </div>
    );
  }

  const discountPercentage = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-24">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-[#138db3]">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-[#138db3]">Products</Link>
        <span className="mx-2">/</span>
        <Link to={`/categories/${product.category.toLowerCase()}`} className="hover:text-[#138db3]">
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-900">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="relative">
          {product.original_price && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded z-10">
              -{discountPercentage}%
            </span>
          )}
          <img
            src={`http://localhost:3001${product.image}`}
            alt={product.name}
            className="w-full h-auto rounded-lg object-cover shadow-md"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={18}
                className={`${
                  i < Math.floor(5.0)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                } ${
                  i === Math.floor(5.0) &&
                  product.rating % 1 > 0
                    ? 'text-yellow-400 fill-yellow-400 opacity-50'
                    : ''
                }`}
              />
            ))}
            {/* <span className="ml-2 text-sm text-slate-500">
              {product.rating} ({reviews.length} reviews)
            </span> */}
          </div>

          {/* Price */}
          <div className="flex items-center mt-4 mb-6">
            <span className="text-2xl font-bold text-slate-900 mr-3">
              {formatPrice(product.price)}
            </span>
            {product.original_price && (
              <span className="text-slate-500 line-through text-lg">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 mb-8">{product.description}</p>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center">
              <button
                title='Decrease quantity'
                type="button"
                className="p-2 border border-slate-300 rounded-l-md bg-slate-50 text-slate-600 hover:bg-slate-100"
                onClick={() => handleQuantityChange('decrease')}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <div className="w-16 text-center border-t border-b border-slate-300 py-2">
                {quantity}
              </div>
              <button
                title='Increase quantity'
                type="button"
                className="p-2 border border-slate-300 rounded-r-md bg-slate-50 text-slate-600 hover:bg-slate-100"
                onClick={() => handleQuantityChange('increase')}
                disabled={quantity >= product.stock}
              >
                <Plus size={16} />
              </button>
              <span className="ml-4 text-sm text-slate-500">
                {product.stock} available
              </span>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto mb-6"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 border-t border-slate-200 pt-6">
            <div className="flex items-start">
              <div className="bg-[#138db3]/10 p-2 rounded-full mr-3">
                <Truck size={18} className="text-[#138db3]" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Free Delivery</h4>
                <p className="text-sm text-slate-500">On all orders within Accra</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-[#138db3]/10 p-2 rounded-full mr-3">
                <ShieldCheck size={18} className="text-[#138db3]" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">Full Coverage Warranty</h4>
                <p className="text-sm text-slate-500">On all our products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {/*  */}

      {/* Related Products */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
        {loadingRelated ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-slate-100 h-64 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/products/${relatedProduct.id}`}
                className="group"
              >
                <div className="bg-gray-100 rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <img
                      src={`http://localhost:3001${relatedProduct.image}`}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedProduct.original_price && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                        -{Math.round(((relatedProduct.original_price - relatedProduct.price) / relatedProduct.original_price) * 100)}%
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-slate-900 mb-1 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.original_price && (
                        <span className="text-slate-500 text-sm line-through">
                          {formatPrice(relatedProduct.original_price)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
