import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BarChart3, Package, Users, DollarSign, Activity, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

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

interface Activity {
  id: string;
  type: 'order' | 'user' | 'product';
  description: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStat[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [statsResponse, ordersResponse, activitiesResponse] = await Promise.all([
          fetch('http://localhost:3001/api/admin/dashboard/stats', {
            credentials: 'include',
          }),
          fetch('http://localhost:3001/api/admin/dashboard/orders/recent', {
            credentials: 'include',
          }),
          fetch('http://localhost:3001/api/admin/dashboard/activities', {
            credentials: 'include',
          })
        ]);

        if (!statsResponse.ok || !ordersResponse.ok || !activitiesResponse.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const [statsData, ordersData, activitiesData] = await Promise.all([
          statsResponse.json(),
          ordersResponse.json(),
          activitiesResponse.json()
        ]);

        console.log('Stats Response:', statsData);
        console.log('Orders Response:', ordersData);

        // Transform stats data
        const transformedStats: DashboardStat[] = [
          {
            title: 'Total Revenue',
            value: `$${statsData.data.totalRevenue}`,
            change: statsData.data.revenueChange,
            icon: <DollarSign />,
            color: 'bg-blue-500'
          },
          {
            title: 'Orders',
            value: statsData.data.totalOrders,
            change: statsData.data.ordersChange,
            icon: <ShoppingBag />,
            color: 'bg-amber-500'
          },
          {
            title: 'Customers',
            value: statsData.data.totalCustomers,
            change: statsData.data.customersChange,
            icon: <Users />,
            color: 'bg-emerald-500'
          },
          {
            title: 'Products',
            value: statsData.data.totalProducts,
            change: statsData.data.productsChange,
            icon: <Package />,
            color: 'bg-purple-500'
          }
        ];

        setStats(transformedStats);
        setRecentOrders(ordersData.orders);
        setRecentActivities(activitiesData.activities);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack
        });
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
                      ${order.amount}
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

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-lg font-medium text-slate-900">Recent Activity</h2>
          <Activity size={18} className="text-slate-400" />
        </div>
        <div className="p-6">
          <ul className="space-y-4">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="flex items-start">
                <div className={`p-2 rounded-full mr-4 mt-1 ${
                  activity.type === 'order' ? 'bg-emerald-100 text-emerald-600' :
                  activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                  'bg-amber-100 text-amber-600'
                }`}>
                  {activity.type === 'order' ? <ShoppingBag size={14} /> :
                   activity.type === 'user' ? <Users size={14} /> :
                   <Package size={14} />}
                </div>
                <div>
                  <p className="text-slate-900">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
