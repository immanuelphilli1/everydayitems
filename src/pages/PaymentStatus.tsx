import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Receipt from '@/components/Receipt';

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  payment_method: string;
  total_price: number;
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
      setSearchParams({ reference: 'mock-reference' });
      return;
    }

    const verifyPayment = async () => {
      try {
        // Update payment status
        const response = await fetch(`http://localhost:3001/api/orders/reference`, {
          method: 'post',
          credentials: 'include',
          body: JSON.stringify({ "reference": reference }),
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to verify payment');
        }

        const data = await response.json();
        console.log("Payment verification response:", data);

        // Check the structure of the response
        if (data.status === 'success') {
          console.log("Setting order data:", data.order);
          setOrder(data.order);
        } else {
          console.error("Invalid response structure:", data);
          throw new Error('Invalid order data received');
        }
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