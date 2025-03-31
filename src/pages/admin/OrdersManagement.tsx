import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowUpDown, ChevronDown, Calendar, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Order {
  id: string;
  userId: string;
  customer: {
    name: string;
    email: string;
  };
  date: string;
  totalAmount: number;
  items: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
}

export default function OrdersManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortField, setSortField] = useState<'date' | 'id' | 'totalAmount'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-2023-1021',
      userId: '2',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
      },
      date: '2023-12-15T14:30:00Z',
      totalAmount: 129.99,
      items: 1,
      status: 'delivered',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-2023-1020',
      userId: '3',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
      },
      date: '2023-12-14T10:15:00Z',
      totalAmount: 79.95,
      items: 2,
      status: 'shipped',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-2023-1019',
      userId: '4',
      customer: {
        name: 'Robert Johnson',
        email: 'robert@example.com',
      },
      date: '2023-12-14T08:45:00Z',
      totalAmount: 249.50,
      items: 3,
      status: 'processing',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-2023-1018',
      userId: '5',
      customer: {
        name: 'Lisa Brown',
        email: 'lisa@example.com',
      },
      date: '2023-12-13T16:20:00Z',
      totalAmount: 59.99,
      items: 1,
      status: 'pending',
      paymentStatus: 'unpaid',
    },
    {
      id: 'ORD-2023-1017',
      userId: '6',
      customer: {
        name: 'Michael Wilson',
        email: 'michael@example.com',
      },
      date: '2023-12-12T11:10:00Z',
      totalAmount: 199.99,
      items: 1,
      status: 'delivered',
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-2023-1016',
      userId: '7',
      customer: {
        name: 'Emily Davis',
        email: 'emily@example.com',
      },
      date: '2023-12-11T09:30:00Z',
      totalAmount: 149.95,
      items: 2,
      status: 'cancelled',
      paymentStatus: 'refunded',
    },
    {
      id: 'ORD-2023-1015',
      userId: '8',
      customer: {
        name: 'David Clark',
        email: 'david@example.com',
      },
      date: '2023-12-10T14:45:00Z',
      totalAmount: 299.99,
      items: 1,
      status: 'delivered',
      paymentStatus: 'paid',
    },
  ];

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 500);
  }, [user, navigate]);

  // Handle sorting
  const handleSort = (field: 'date' | 'id' | 'totalAmount') => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      // Apply search filter (search by order ID or customer name/email)
      if (
        searchTerm &&
        !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Apply status filter
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortField === 'date') {
        return sortDirection === 'asc'
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortField === 'totalAmount') {
        return sortDirection === 'asc'
          ? a.totalAmount - b.totalAmount
          : b.totalAmount - a.totalAmount;
      } else {
        // Sort by ID (string)
        return sortDirection === 'asc'
          ? a.id.localeCompare(b.id)
          : b.id.localeCompare(a.id);
      }
    });

  // Handle order status update
  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    // In a real app, this would call an API to update the order
    setOrders(orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    }));
    setShowStatusDropdown(null);
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Format time
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
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

  // Get payment status badge class
  const getPaymentStatusBadgeClass = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-emerald-100 text-emerald-800';
      case 'unpaid':
        return 'bg-amber-100 text-amber-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="h-12 bg-slate-200 rounded mb-6"></div>
          <div className="h-64 bg-slate-200 rounded mb-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manage Orders</h1>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by order ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                  <div className="flex items-center">
                    Order ID
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('date')}>
                  <div className="flex items-center">
                    Date
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('totalAmount')}>
                  <div className="flex items-center">
                    Total
                    <ArrowUpDown size={14} className="ml-2" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredOrders.map((order) => (
                <tr
                  key={order.id}
                  className={`hover:bg-slate-50 ${selectedOrder === order.id ? 'bg-blue-50' : ''}`}
                  onClick={() => setSelectedOrder(order.id === selectedOrder ? null : order.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-900">{order.customer.name}</p>
                    <p className="text-xs text-slate-500">{order.customer.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={14} className="text-slate-400 mr-1" />
                      <span className="text-sm text-slate-700">{formatDate(order.date)}</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <Clock size={14} className="text-slate-400 mr-1" />
                      <span className="text-xs text-slate-500">{formatTime(order.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {order.items} {order.items === 1 ? 'item' : 'items'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <button
                        type="button"
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(order.status)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowStatusDropdown(showStatusDropdown === order.id ? null : order.id);
                        }}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        <ChevronDown size={14} className="ml-1" />
                      </button>

                      {showStatusDropdown === order.id && (
                        <div className="absolute left-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-slate-200 z-10">
                          <ul className="py-1 text-sm">
                            <li>
                              <button
                                className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, 'pending');
                                }}
                              >
                                Pending
                              </button>
                            </li>
                            <li>
                              <button
                                className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, 'processing');
                                }}
                              >
                                Processing
                              </button>
                            </li>
                            <li>
                              <button
                                className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, 'shipped');
                                }}
                              >
                                Shipped
                              </button>
                            </li>
                            <li>
                              <button
                                className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, 'delivered');
                                }}
                              >
                                Delivered
                              </button>
                            </li>
                            <li>
                              <button
                                className="block w-full text-left px-4 py-2 hover:bg-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateOrderStatus(order.id, 'cancelled');
                                }}
                              >
                                Cancelled
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                      {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link to={`/admin/orders/${order.id}`}>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => navigate(`/admin/orders/${order.id}`)}
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">No orders found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
}
