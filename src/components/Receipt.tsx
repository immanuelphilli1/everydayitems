import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_price: number;
  payment_method: string;
  status: string;
  created_at: string;
  items: OrderItem[];
  shipping_address: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
  };
}

interface ReceiptProps {
  order: Order;
}

export default function Receipt({ order }: ReceiptProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Add null check for order
  if (!order) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <p className="text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Format currency with fallback
  const formatCurrency = (amount: number | undefined) => {
    return `GHS ${(amount || 0).toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Receipt</h1>
          <p className="text-slate-600">Order #{order.id || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-600">Date: {order.created_at ? formatDate(order.created_at) : 'N/A'}</p>
          <p className="text-slate-600">Status: {order.status || 'N/A'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Shipping Address</h2>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p>{order.shipping_address?.firstName || ''} {order.shipping_address?.lastName || ''}</p>
          <p>{order.shipping_address?.address1 || 'N/A'}</p>
          {order.shipping_address?.address2 && <p>{order.shipping_address.address2}</p>}
          <p>
            {order.shipping_address?.city || 'N/A'}, {order.shipping_address?.state || 'N/A'} {order.shipping_address?.postal_code || 'N/A'}
          </p>
          <p>Phone: {order.shipping_address?.phone || 'N/A'}</p>
          <p>Payment Method: {order.payment_method || 'N/A'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Order Items</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4">Item</th>
                <th className="text-right p-4">Quantity</th>
                <th className="text-right p-4">Price</th>
                <th className="text-right p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.name || 'N/A'}</td>
                  <td className="text-right p-4">{item.quantity || 0}</td>
                  <td className="text-right p-4">{formatCurrency(item.price)}</td>
                  <td className="text-right p-4">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50">
              <tr>
                <td colSpan={3} className="text-right p-4 font-semibold">Total Amount:</td>
                <td className="text-right p-4 font-semibold">{formatCurrency(order.total_price)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate('/')}>
          Return to Home
        </Button>
        <Button onClick={() => window.print()}>
          Print Receipt
        </Button>
      </div>
    </div>
  );
} 