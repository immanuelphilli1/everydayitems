import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
  shipping_address: {
    first_name: string;
    last_name: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
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

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Order Receipt</h1>
          <p className="text-slate-600">Order #{order.order_number}</p>
        </div>
        <div className="text-right">
          <p className="text-slate-600">Date: {formatDate(order.created_at)}</p>
          <p className="text-slate-600">Status: {order.status}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">Shipping Address</h2>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
          <p>{order.shipping_address.address1}</p>
          {order.shipping_address.address2 && <p>{order.shipping_address.address2}</p>}
          <p>
            {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
          </p>
          <p>{order.shipping_address.country}</p>
          <p>Phone: {order.shipping_address.phone}</p>
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
              {order.items.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-4">{item.product_name}</td>
                  <td className="text-right p-4">{item.quantity}</td>
                  <td className="text-right p-4">GHS {item.price.toLocaleString()}</td>
                  <td className="text-right p-4">GHS {item.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-50">
              <tr>
                <td colSpan={3} className="text-right p-4 font-semibold">Total Amount:</td>
                <td className="text-right p-4 font-semibold">GHS {order.total_amount.toLocaleString()}</td>
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