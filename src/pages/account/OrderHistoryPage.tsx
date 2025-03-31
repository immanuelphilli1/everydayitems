import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ChevronRight, Search, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { formatPrice } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
}

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // Mock order data
  const mockOrders: Order[] = [
    {
      id: 'ORD-2023-1021',
      date: '2023-12-15T14:30:00Z',
      status: 'delivered',
      total: 349.98,
      items: [
        {
          id: '1',
          name: 'Wireless Noise Cancelling Headphones',
          quantity: 1,
          price: 299.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
          id: '5',
          name: 'Professional Chef Knife Set',
          quantity: 1,
          price: 129.99,
          image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGtuaWZlJTIwc2V0fGVufDB8fDB8fHww'
        }
      ]
    },
    {
      id: 'ORD-2023-1020',
      date: '2023-11-28T10:15:00Z',
      status: 'shipped',
      total: 79.98,
      items: [
        {
          id: '3',
          name: 'Smart Home Security Camera',
          quantity: 1,
          price: 89.99,
          image: 'https://images.unsplash.com/photo-1565130838609-c3a86655db61?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y2FtZXJhfGVufDB8fDB8fHww'
        }
      ]
    },
    {
      id: 'ORD-2023-1015',
      date: '2023-10-10T09:30:00Z',
      status: 'delivered',
      total: 159.97,
      items: [
        {
          id: '2',
          name: 'Premium Cotton T-Shirt',
          quantity: 2,
          price: 29.99,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRzaGlydHxlbnwwfHwwfHx8MA%3D%3D'
        },
        {
          id: '4',
          name: 'Organic Skincare Gift Set',
          quantity: 1,
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1527947030665-8b6c8a586350?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHNraW5jYXJlfGVufDB8fDB8fHww'
        }
      ]
    }
  ];

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      navigate('/login');
      return;
    }

    // Simulate API call to fetch orders
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, [user, navigate]);

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    return (
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  });

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge class
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-amber-100 text-amber-800';
      case 'pending':
        return 'bg-slate-100 text-slate-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="h-12 bg-slate-200 rounded mb-6"></div>
            <div className="h-64 bg-slate-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
          <Link to="/account/profile">
            <Button variant="outline" size="sm">
              Back to Account
            </Button>
          </Link>
        </div>

        {/* Search input */}
        <div className="mb-6">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Search orders by ID or product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="space-y-4 mb-6">
            {/* Order cards */}
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
              >
                {/* Order header */}
                <div
                  className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between cursor-pointer hover:bg-slate-50"
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                >
                  <div>
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                      <p className="font-medium text-slate-900">
                        Order #{order.id}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(order.date)}
                      </p>
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-900 mt-2 md:mt-1">
                      Total: {formatPrice(order.total)}
                    </p>
                  </div>
                  <div className="flex items-center mt-3 md:mt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-auto text-blue-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/account/orders/${order.id}`);
                      }}
                    >
                      View Details
                      <ChevronRight size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>

                {/* Order details (expandable) */}
                {selectedOrder === order.id && (
                  <div className="p-4 bg-slate-50">
                    <h3 className="text-sm font-medium text-slate-900 mb-3">
                      Items in this order:
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="flex-grow">
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <p className="text-sm text-slate-500">
                              {item.quantity} x {formatPrice(item.price)}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-slate-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={24} className="text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No orders found</h3>
            {searchTerm ? (
              <p className="text-slate-500">
                We couldn't find any orders matching "{searchTerm}".
                <br />
                <button
                  className="text-blue-600 mt-2 hover:text-blue-800"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              </p>
            ) : (
              <p className="text-slate-500">
                You haven't placed any orders yet.
                <br />
                <Link to="/products" className="text-blue-600 mt-2 hover:text-blue-800 inline-block">
                  Start shopping
                </Link>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
