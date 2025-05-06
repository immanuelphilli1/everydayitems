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
  const [filter, setFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'>('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  if (!user) {
    navigate('/login');
    return null;
  }
  console.log("Orders : ",orders);

  

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
  

  // Handle order deletion
  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      // Update local state
      setOrders(orders.filter(order => order.id !== orderId));
      setShowDeleteModal(false);
      setOrderToDelete(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Handle payment initiation
  const handlePayment = async (orderId: string) => {
    try {
      // Get order details to get total price
      const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Order not found');
      }

      const responseData = await response.json();
      console.log("Full Order Response:", responseData);

      // Check if we have the required data
      if (!responseData || !responseData.order || !responseData.order.total_price) {
        console.error("Invalid order data structure:", responseData);
        throw new Error('Invalid order data received');
      }

      const totalPrice = responseData.order.total_price;
      console.log("Total Price:", totalPrice);
      
      // Generate Paystack URL
      const formData = new FormData();
      formData.append('price', totalPrice.toString());
    
      const paystackResponse = await fetch('https://fasthosttech.com/paystack.php', {
        method: 'POST',
        body: formData,
      });
    
      const paystackData = await paystackResponse.json();
      console.log("Paystack Response:", paystackData);
      
      if (paystackData.status !== true) {
        throw new Error('Failed to generate payment URL');
      }

      // Redirect to Paystack payment page
      window.location.href = paystackData.data.authorization_url;
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to process payment. Please try again.');
    }
  };

  // Handle delete confirmation
  const confirmDelete = (orderId: string) => {
    setOrderToDelete(orderId);
    setShowDeleteModal(true);
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Delete Order</h3>
              <p className="text-slate-600 mb-6">
                Are you sure you want to delete this order? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setOrderToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => orderToDelete && deleteOrder(orderToDelete)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}

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
                      {order.status === 'pending' && (
                        <div className="flex justify-end space-x-2 mt-2">
                          <button
                            onClick={() => handlePayment(order.id)}
                            className="text-sm bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                          >
                            Make Payment
                          </button>
                          <button
                            onClick={() => confirmDelete(order.id)}
                            className="text-sm bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                          >
                            Delete Order
                          </button>
                        </div>
                      )}
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