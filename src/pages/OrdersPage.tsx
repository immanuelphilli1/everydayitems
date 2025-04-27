import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaBox, FaTruck, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// interface Order {
//   id: string;
//   date: string;
//   total: number;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   items: OrderItem[];
//   shippingAddress: string;
//   trackingNumber?: string;
// }

interface Order {
  id: string;
  created_at: string;
  total_price: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shipping_address: object;
  trackingNumber?: string;
}


// Mock data - replace with API call


export default function OrdersPage() {
   //******Get orders in the order table */
   const getOrders = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/orders/my-orders', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        // body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();

      console.log("Orders : ",data);
      setOrders(data.orders);
      return data;

    } catch (err: any) {
      console.log(err.message || 'Failed to create order');
    } finally {
      // setProcessing(false);
    } 
  }

  useEffect(() => {
    getOrders();
  }, []);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');

  if (!user) {
    navigate('/login');
    return null;
  }



 
 
  console.log("Orders : ",orders);

  // const mockOrders: Order[] = [
  //   {
  //     id: 'ORD001',
  //     created_at: '2024-03-15',
  //     total_price: 299.99,
  //     status: 'delivered',
  //     items: [
  //       {
  //         id: 'ITEM001',
  //         name: 'Wireless Headphones',
  //         price: 99.99,
  //         quantity: 2,
  //         image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop'
  //       },
  //       {
  //         id: 'ITEM002',
  //         name: 'Smart Watch',
  //         price: 99.99,
  //         quantity: 1,
  //         image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&h=500&fit=crop'
  //       }
  //     ],
  //     shipping_address: '123 Main St, New York, NY 10001',
  //     trackingNumber: '1Z999AA1234567890'
  //   },
  //   {
  //     id: 'ORD002',
  //     created_at: '2024-03-10',
  //     total_price: 149.99,
  //     status: 'processing',
  //     items: [
  //       {
  //         id: 'ITEM003',
  //         name: 'Bluetooth Speaker',
  //         price: 149.99,
  //         quantity: 1,
  //         image: 'https://images.unsplash.com/photo-1545454675-3531b54301b2?w=500&h=500&fit=crop'
  //       }
  //     ],
  //     shipping_address: '123 Main St, New York, NY 10001'
  //   }
  // ];
  

  const mockOrders: Order[] = orders;

  const filteredOrders = filter === 'all'
    ? mockOrders
    : mockOrders.filter(order => order.status === filter);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'processing':
        return <FaBox className="text-yellow-500" />;
      case 'pending':
        return <FaClock className="text-orange-500" />;
      case 'cancelled':
        return <FaExclamationCircle className="text-red-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Orders</h1>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'all'
                ? 'bg-[#138db3] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'pending'
                ? 'bg-[#138db3] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('processing')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'processing'
                ? 'bg-[#138db3] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter('shipped')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'shipped'
                ? 'bg-[#138db3] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'delivered'
                ? 'bg-[#138db3] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              filter === 'cancelled'
                ? 'bg-[#138db3] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <img
                        src={`http://localhost:3001${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{item.name}</h4>
                        <p className="text-sm text-slate-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm text-slate-600">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-slate-600">
                        Shipping to: {(order.shipping_address as any).address1}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-slate-600">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">Total</p>
                      <p className="text-lg font-semibold text-slate-900">
                        ${order.total_price}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600">No orders found.</p>
              <button
                onClick={() => navigate('/shop')}
                className="mt-4 inline-block bg-[#138db3] text-white px-6 py-3 rounded-md hover:bg-[#138db3]/90 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 