import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { formatPrice, formatPriceWithoutCurrency } from '@/lib/utils';


// Address form component
const AddressForm = ({ address, setAddress }: {
  address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  setAddress: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAddress((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">
          First Name *
        </label>
        <Input
          id="firstName"
          name="firstName"
          value={address.firstName}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">
          Last Name *
        </label>
        <Input
          id="lastName"
          name="lastName"
          value={address.lastName}
          onChange={handleChange}
          required
        />
      </div>
      <div className="">
        <label htmlFor="address1" className="block text-sm font-medium text-slate-700 mb-1">
          Address Line 1 *
        </label>
        <Input
          id="address1"
          name="address1"
          value={address.address1}
          onChange={handleChange}
          required
        />
      </div>
      <div className="">
        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
          Phone Number *
        </label>
        <Input
          id="phone"
          name="phone"
          value={address.phone}
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

// Payment form component
const PaymentForm = ({ processing, handleSubmit }: {
  processing: boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-slate-200 rounded-md p-4 mb-4">
        <h3 className="text-md font-medium mb-4">Payment Information</h3>
        <div className="text-xs text-slate-500 mt-2">
          Your payment information is encrypted and secure.
        </div>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Pay & Complete Order'}
      </Button>
    </form>
  );
};

// Order summary component
const OrderSummary = ({ items, totalPrice }: {
  items: any[];
  totalPrice: number;
}) => {
  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const taxRate = 0.07; // 7% tax
  const taxAmount = totalPrice * taxRate;
  const orderTotal = totalPrice + shippingCost + taxAmount;

  return (
    <div className="bg-slate-50 p-6 rounded-lg">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Order Summary</h3>

      <div className="mb-4">
        <div className="max-h-64 overflow-y-auto mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center py-2 border-b border-slate-200">
              <div className="h-10 w-10 rounded-md overflow-hidden mr-3">
                <img src={`http://localhost:3001${item.image}`} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
              </div>
              <div className="text-sm font-medium text-slate-900">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2 text-sm border-b border-slate-200 pb-4 mb-4">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Shipping</span>
          {shippingCost === 0 ? (
            <span className="text-green-600">Free</span>
          ) : (
            <span>{formatPrice(shippingCost)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Tax (7%)</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>{formatPrice(orderTotal)}</span>
      </div>
    </div>
  );
};

// Main checkout component
const CheckoutContent = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'address' | 'payment'>('address');
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    console.log("items : ",items);
    // If cart is empty, redirect to cart page
    if (items.length === 0) {
      navigate('/cart');
    }

    // Pre-fill with user data if available
    if (user) {
      // In a real app, we would fetch user's saved addresses
      // For now, just pre-fill some fields if we have user data
      setAddress(prev => ({
        ...prev,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [items, navigate, user]);

  const validateAddress = () => {
    // Simple validation
    const requiredFields = ['firstName', 'lastName', 'address1', 'phone'];
    return requiredFields.every(field => address[field as keyof typeof address].trim() !== '');
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAddress()) {
      setStep('payment');
      window.scrollTo(0, 0);
    }
  };

  //*****generate paystack url */
  const generatePaystackUrl = async (amount: number) => {
    const formData = new FormData();
    formData.append('price', amount.toString());
  
    const response = await fetch('https://fasthosttech.com/paystack.php', {
      method: 'POST',
      body: formData,
    });
  
    const data = await response.json();
    console.log(data);
    return data;
    
  };

  //******create order in the order table */
  const createOrder = async (orderData: any) => {
    console.log("orderData : ",orderData);
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
      console.log(data);

      setProcessing(false);
      return data;

    } catch (err: any) {
      console.log(err.message || 'Failed to create order');
    } finally {
      setProcessing(false);
    } 
  }

  //****handle payment and insert into the orders table */
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    console.log(formatPriceWithoutCurrency(totalPrice));
    e.preventDefault();
    setProcessing(true);

    //*****the order data */
    const orderData = {
      shippingAddress: address,
      paymentMethod: 'paystack',
      items: items,
      totalPrice: totalPrice,
      shippingPrice: 0,
      taxPrice: 0,
    }

    try {
      //******create order in the order table */
      const create_order = createOrder(orderData);
      const orderResult = await create_order;
      console.log("orderResult : ",orderResult.status);
      if(orderResult.status !== "success") {
        throw new Error('Failed to create order');
      }

      //******generate paystack url */
      const pay_stack_url = await generatePaystackUrl(totalPrice);
      if (pay_stack_url.status !== true) {
        throw new Error('Failed to generate paystack url');
      }
      // For now, simulate successful payment
      console.log('Payment successful');
      setTimeout(() => {
        // Generate a mock order ID
        const mockOrderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        // setOrderId(mockOrderId);

        console.log('Order ID:', mockOrderId);

        window.location.href = pay_stack_url.data.authorization_url;
        // setOrderComplete(true);
        // clearCart();
      }, 2000);
      setProcessing(false);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setProcessing(false);
    }
  };

  if (orderComplete && orderId) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Order Confirmed!</h1>
          <p className="text-slate-600 mb-8">
            Your order has been placed and will be processed soon.
            <br />You will receive an email confirmation shortly.
          </p>
          <div className="mb-8 p-4 bg-slate-50 rounded-md inline-block">
            <p className="text-sm text-slate-500 mb-1">Order Reference</p>
            <p className="text-lg font-medium text-slate-900">{orderId}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button variant="outline">
                Continue Shopping
              </Button>
            </Link>
            {user && (
              <Link to="/account/orders">
                <Button variant="primary">
                  View Order Status
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Checkout Progress */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex items-center relative">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step === 'address' || step === 'payment' ? 'bg-[#138db3] text-white' : 'bg-slate-200'
              }`}>
                1
              </div>
              <div className={`ml-2 text-sm font-medium ${
                step === 'address' || step === 'payment' ? 'text-[#138db3]' : 'text-slate-500'
              }`}>
                Shipping
              </div>
            </div>
            <div className={`flex-grow mx-4 h-0.5 ${
              step === 'payment' ? 'bg-[#138db3]' : 'bg-slate-200'
            }`}></div>
            <div className="flex items-center relative">
              <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                step === 'payment' ? 'bg-[#138db3]' : 'bg-slate-200'
              }`}>
                2
              </div>
              <div className={`ml-2 text-sm font-medium ${
                step === 'payment' ? 'text-[#138db3]' : 'text-slate-500'
              }`}>
                Payment
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
              {step === 'address' && (
                <form onSubmit={handleAddressSubmit}>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Delivery Address</h2>
                  <AddressForm address={address} setAddress={setAddress} />
                  <div className="mt-6">
                    <Button type="submit" variant="primary" className="w-full">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}

              {step === 'payment' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                    <button
                      type="button"
                      className="text-sm text-[#138db3] hover:text-[#138db3]/80"
                      onClick={() => setStep('address')}
                    >
                      Edit Shipping Info
                    </button>
                  </div>

                  <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Deliver To:</h3>
                    <p className="text-sm text-slate-600">
                      {address.firstName} {address.lastName}<br />
                      {address.address1}{address.address2 ? `, ${address.address2}` : ''}<br />
                      {address.phone}
                    </p>
                  </div>

                    <PaymentForm
                      processing={processing}
                      handleSubmit={handlePaymentSubmit}
                    />
                </div>
              )}
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} totalPrice={totalPrice} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  return (
      <CheckoutContent />
  );
}
