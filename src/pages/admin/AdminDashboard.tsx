import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Package, Users, CreditCard, DollarSign, Activity, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface DashboardStat {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Mock stats data
  const stats: DashboardStat[] = [
    {
      title: 'Total Revenue',
      value: '$12,486.98',
      change: 14.5,
      icon: <DollarSign />,
      color: 'bg-blue-500'
    },
    {
      title: 'Orders',
      value: 156,
      change: 5.2,
      icon: <ShoppingBag />,
      color: 'bg-amber-500'
    },
    {
      title: 'Customers',
      value: 842,
      change: 8.1,
      icon: <Users />,
      color: 'bg-emerald-500'
    },
    {
      title: 'Products',
      value: 235,
      change: -2.4,
      icon: <Package />,
      color: 'bg-purple-500'
    }
  ];

  // Mock recent orders
  const recentOrders: RecentOrder[] = [
    {
      id: 'ORD-2023-1021',
      customer: 'John Doe',
      date: '2023-12-15',
      amount: 129.99,
      status: 'delivered'
    },
    {
      id: 'ORD-2023-1020',
      customer: 'Jane Smith',
      date: '2023-12-14',
      amount: 79.95,
      status: 'shipped'
    },
    {
      id: 'ORD-2023-1019',
      customer: 'Robert Johnson',
      date: '2023-12-14',
      amount: 249.50,
      status: 'processing'
    },
    {
      id: 'ORD-2023-1018',
      customer: 'Lisa Brown',
      date: '2023-12-13',
      amount: 59.99,
      status: 'pending'
    },
    {
      id: 'ORD-2023-1017',
      customer: 'Michael Wilson',
      date: '2023-12-12',
      amount: 199.99,
      status: 'delivered'
    }
  ];

  useEffect(() => {
    console.log("user: ", user);
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user, navigate]);

  // Status badge style based on order status
  const getStatusBadgeClass = (status: RecentOrder['status']) => {
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
        <div className="animate-pulse">
          <div className="h-10 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/5 mb-6"></div>
          <div className="h-64 bg-slate-200 rounded mb-12"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <div className="flex space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin/products/new')}>
            Add New Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center mb-4">
              <div className={`${stat.color} p-3 rounded-full text-white mr-4`}>
                {stat.icon}
              </div>
              <h3 className="font-medium text-slate-500">{stat.title}</h3>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <span className={`text-sm font-medium ${stat.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.change >= 0 ? `+${stat.change}%` : `${stat.change}%`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                      <Link to={`/admin/orders/${order.id}`}>{order.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <Link
              to="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View all orders →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-medium text-slate-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            <Link to="/admin/products">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center">
                  <Package size={18} className="mr-2" /> Manage Products
                </span>
                <span className="text-slate-400">→</span>
              </Button>
            </Link>
            <Link to="/admin/orders">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center">
                  <ShoppingBag size={18} className="mr-2" /> View Orders
                </span>
                <span className="text-slate-400">→</span>
              </Button>
            </Link>
            <Link to="/admin/customers">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center">
                  <Users size={18} className="mr-2" /> Customer List
                </span>
                <span className="text-slate-400">→</span>
              </Button>
            </Link>
            <Link to="/admin/analytics">
              <Button variant="outline" className="w-full flex items-center justify-between">
                <span className="flex items-center">
                  <BarChart3 size={18} className="mr-2" /> Sales Analytics
                </span>
                <span className="text-slate-400">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity / Notifications */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-900">Recent Activity</h2>
          <Activity size={18} className="text-slate-400" />
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full text-blue-600 mr-4 mt-1">
                <Users size={14} />
              </div>
              <div>
                <p className="text-slate-900">New customer registered</p>
                <p className="text-sm text-slate-500">Emma Thompson created an account</p>
                <p className="text-xs text-slate-400 mt-1">15 minutes ago</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mr-4 mt-1">
                <ShoppingBag size={14} />
              </div>
              <div>
                <p className="text-slate-900">New order received</p>
                <p className="text-sm text-slate-500">Order #ORD-2023-1022 from David Clark</p>
                <p className="text-xs text-slate-400 mt-1">34 minutes ago</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-amber-100 p-2 rounded-full text-amber-600 mr-4 mt-1">
                <Package size={14} />
              </div>
              <div>
                <p className="text-slate-900">Product stock low</p>
                <p className="text-sm text-slate-500">Wireless Headphones (SKU: WH-1001) is low in stock (3 remaining)</p>
                <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full text-purple-600 mr-4 mt-1">
                <CreditCard size={14} />
              </div>
              <div>
                <p className="text-slate-900">Payment received</p>
                <p className="text-sm text-slate-500">$349.99 payment for order #ORD-2023-1020</p>
                <p className="text-xs text-slate-400 mt-1">5 hours ago</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
