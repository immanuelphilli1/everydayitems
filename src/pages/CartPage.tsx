import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, X, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { items, totalItems, totalPrice, updateItemQuantity, removeItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Calculate additional costs
  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const taxRate = 0.07; // 7% tax
  const taxAmount = totalPrice * taxRate;
  const orderTotal = totalPrice + shippingCost + taxAmount;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItemQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError('');

    // Simulate API call to validate coupon
    setTimeout(() => {
      setCouponError('Invalid or expired coupon code');
      setIsApplyingCoupon(false);
    }, 1000);
  };

  const handleCheckout = () => {
    if (user) {
      // If user is logged in, go directly to checkout
      navigate('/checkout');
    } else {
      // If not logged in, go to login page
      navigate('/login');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-2xl font-bold text-slate-900 mb-8">Your Cart</h1>
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <ShoppingBag size={64} className="text-slate-300" />
          </div>
          <h2 className="text-xl font-medium mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/products">
            <Button variant="primary">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Your Cart ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <ul className="divide-y divide-slate-200">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 overflow-hidden rounded-md">
                      <img
                        src={`http://localhost:3001${item.image}`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow sm:ml-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between">
                        <div>
                          <h3 className="text-base font-medium text-slate-900">
                            <Link to={`/products/${item.product_id}`} className="hover:text-[#138db3]">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="mt-1 text-sm text-slate-500">
                            Item #{item.product_id}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex sm:flex-col items-center sm:items-end justify-between">
                          <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                          {item.quantity > 1 && (
                            <p className="text-sm text-slate-500 mt-1">
                              {formatPrice(item.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center border border-slate-200 rounded-md">
                          <button
                            title='Decrease quantity'
                            type="button"
                            className="p-2 text-slate-600 hover:text-slate-900"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 py-2 text-center w-12">{item.quantity}</span>
                          <button
                            title='Increase quantity'
                            type="button"
                            className="p-2 text-slate-600 hover:text-slate-900"
                            onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-800 text-sm flex items-center"
                          onClick={() => handleRemoveItem(item.product_id)}
                        >
                          <X size={16} className="mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-between items-center">
            <Link to="/products" className="text-[#138db3] hover:text-[#138db3]/80 flex items-center">
              <ArrowRight size={16} className="mr-2 rotate-180" /> Continue Shopping
            </Link>

            <Button variant="outline" onClick={() => navigate('/checkout')}>
              Proceed to Checkout
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Subtotal ({totalItems} items)</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Delivery</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span>{formatPrice(shippingCost)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Estimated Tax</span>
                <span>{formatPrice(taxAmount)}</span>
              </div>

              {shippingCost === 0 && (
                <div className="flex items-center py-2 text-green-600 text-xs">
                  <Truck size={16} className="mr-2" />
                  <span>Free Delivery on some orders!</span>
                </div>
              )}
            </div>

            <div className="my-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#138db3]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon}
                  className="absolute right-0 top-0 bottom-0 bg-slate-100 hover:bg-slate-200 px-4 rounded-r-md text-sm font-medium text-slate-700"
                >
                  Apply
                </button>
              </div>
              {couponError && (
                <p className="text-red-600 text-xs mt-1">{couponError}</p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-4 mt-4">
              <div className="flex justify-between mb-4">
                <span className="font-medium">Order Total</span>
                <span className="font-bold text-lg">{formatPrice(orderTotal)}</span>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={handleCheckout}
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </Button>

              {!user && (
                <p className="text-center text-xs text-slate-500 mt-2">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#138db3] hover:underline">
                    Sign in
                  </Link>{' '}
                  or{' '}
                  <button
                    type="button"
                    className="text-[#138db3] hover:underline animate-pulse"
                    onClick={() => navigate('/checkout')}
                  >
                    continue as guest
                  </button>
                </p>
              )}
            </div>

            <div className="mt-6 space-y-2 text-xs text-slate-500">
              <p>We accept:</p>
              <div className="flex space-x-2">
                <div className="bg-slate-100 rounded px-2 py-1">Visa</div>
                <div className="bg-slate-100 rounded px-2 py-1">Mobile Money</div>
                <div className="bg-slate-100 rounded px-2 py-1">Card</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
