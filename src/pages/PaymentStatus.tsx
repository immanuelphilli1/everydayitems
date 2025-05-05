import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Receipt from '@/components/Receipt';

// Mock data for testing
const mockOrder = {
  id: 1,
  order_number: "ORD-2024-001",
  user_id: 1,
  total_amount: 500.00,
  status: "paid",
  created_at: new Date().toISOString(),
  items: [
    {
      id: 1,
      product_id: 1,
      product_name: "Test Product 1",
      quantity: 2,
      price: 100.00,
      total: 200.00
    },
    {
      id: 2,
      product_id: 2,
      product_name: "Test Product 2",
      quantity: 1,
      price: 300.00,
      total: 300.00
    }
  ],
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address1: "123 Test Street",
    address2: "Apt 4B",
    city: "Accra",
    state: "Greater Accra",
    postal_code: "00233",
    country: "Ghana",
    phone: "0241234567"
  }
};

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: any[];
  shipping_address: any;
}

export default function PaymentStatus() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const reference = searchParams.get('reference');

  useEffect(() => {
    // If no reference is provided, add a mock reference
    if (!reference) {
      setSearchParams({ reference: 'mock_ref_123456' });
      return;
    }

    // Simulate API call with mock data
    const verifyPayment = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Use mock data instead of API call
        setOrder(mockOrder);
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast.error('Failed to verify payment');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, navigate, setSearchParams]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#138db3]"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Payment Verification Failed</h1>
          <p className="text-slate-600 mb-4">We couldn't verify your payment. Please contact support if the issue persists.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-[#138db3] text-white rounded hover:bg-[#0f7a9a]"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h1>
          <p className="text-slate-600">Thank you for your purchase. Your order has been confirmed.</p>
        </div>
        <Receipt order={order} />
      </div>
    </div>
  );
} 