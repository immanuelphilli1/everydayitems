import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Truck, ShieldCheck, ArrowLeft, Plus, Minus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
}

interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();

  // Mock product data for now
  const mockProduct: Product = {
    id: id || '1',
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Premium noise cancelling headphones with 30-hour battery life and superior sound quality. Features include active noise cancellation, ambient sound mode, touch controls, and voice assistant compatibility. Enjoy immersive audio experience with deep bass and crystal-clear highs. The comfortable over-ear design with soft cushions makes these perfect for long listening sessions.',
    price: 299.99,
    originalPrice: 349.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D',
    category: 'Electronics',
    stock: 50,
    rating: 4.5
  };

  // Mock reviews
  const mockReviews: Review[] = [
    {
      id: '1',
      userId: '2',
      userName: 'John Doe',
      rating: 5,
      comment: 'Great product! The sound quality is amazing and the noise cancellation works perfectly.',
      createdAt: '2023-11-15T12:30:00Z'
    },
    {
      id: '2',
      userId: '3',
      userName: 'Jane Smith',
      rating: 4,
      comment: 'Very comfortable to wear for long periods. Battery life is as advertised. The only downside is that they\'re a bit bulky for travel.',
      createdAt: '2023-10-20T15:45:00Z'
    },
    {
      id: '3',
      userId: '4',
      userName: 'Mike Johnson',
      rating: 5,
      comment: 'Best headphones I\'ve ever owned. Worth every penny!',
      createdAt: '2023-12-05T09:15:00Z'
    }
  ];

  useEffect(() => {
    // In a real implementation, we would fetch from the API
    // For now, use mock data
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // const response = await axios.get(`/api/products/${id}`);
        // setProduct(response.data.product);

        // Using mock data for now
        setTimeout(() => {
          setProduct(mockProduct);
          setReviews(mockReviews);
          setLoading(false);
        }, 500);
      } catch (err) {
        setError('Failed to load product details');
        setLoading(false);
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
        name: product.name,
        price: product.price,
        quantity,
        image: product.image
      });
    }
  };

  const handleUserReviewChange = (field: 'rating' | 'comment', value: string | number) => {
    setUserReview(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitReview = async () => {
    if (!user) {
      setReviewError('Please sign in to leave a review');
      return;
    }

    if (!userReview.comment.trim()) {
      setReviewError('Please enter a comment');
      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewError('');

      // In a real implementation, we would post to the API
      // await axios.post(`/api/products/${id}/reviews`, userReview);

      // For now, simulate API call and add to local state
      const newReview: Review = {
        id: `temp-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        rating: userReview.rating,
        comment: userReview.comment,
        createdAt: new Date().toISOString()
      };

      setReviews(prev => [newReview, ...prev]);
      setUserReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (error) {
      setReviewError('Failed to submit review');
    } finally {
      setReviewSubmitting(false);
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

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
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
          {product.originalPrice && (
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded z-10">
              -{discountPercentage}%
            </span>
          )}
          <img
            src={product.image}
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
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-slate-300'
                } ${
                  i === Math.floor(product.rating) &&
                  product.rating % 1 > 0
                    ? 'text-yellow-400 fill-yellow-400 opacity-50'
                    : ''
                }`}
              />
            ))}
            <span className="ml-2 text-sm text-slate-500">
              {product.rating.toFixed(1)} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center mt-4 mb-6">
            <span className="text-2xl font-bold text-slate-900 mr-3">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-slate-500 line-through text-lg">
                {formatPrice(product.originalPrice)}
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
                <h4 className="font-medium text-slate-900">Free Shipping</h4>
                <p className="text-sm text-slate-500">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-[#138db3]/10 p-2 rounded-full mr-3">
                <ShieldCheck size={18} className="text-[#138db3]" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900">2-Year Warranty</h4>
                <p className="text-sm text-slate-500">Full coverage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t border-slate-200 pt-12 mb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Customer Reviews ({reviews.length})
          </h2>
          {user && !showReviewForm && (
            <Button variant="outline" onClick={() => setShowReviewForm(true)}>
              <MessageCircle size={16} className="mr-2" /> Write a Review
            </Button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-slate-50 p-6 rounded-lg mb-8">
            <h3 className="text-lg font-medium mb-4">Write Your Review</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleUserReviewChange('rating', star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`${
                        star <= userReview.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
                Comment
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#138db3]"
                value={userReview.comment}
                onChange={(e) => handleUserReviewChange('comment', e.target.value)}
                placeholder="Share your experience with this product..."
              ></textarea>
            </div>

            {reviewError && (
              <p className="text-red-600 text-sm mb-4">{reviewError}</p>
            )}

            <div className="flex space-x-4">
              <Button
                variant="primary"
                onClick={handleSubmitReview}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 ? (
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-slate-200 pb-8">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{review.userName}</h4>
                  <span className="text-sm text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg">
            <p className="text-slate-600 mb-4">No reviews yet. Be the first to review this product!</p>
            {user ? (
              <Button variant="primary" onClick={() => setShowReviewForm(true)}>
                Write a Review
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="primary">Sign in to Write a Review</Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Related Products Placeholder */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-100 h-64 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
