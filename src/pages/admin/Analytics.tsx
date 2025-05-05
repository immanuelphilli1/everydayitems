import { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatCard[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/api/admin/dashboard/stats', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }

        const data = await response.json();
        
        // Transform the API data into our stats format
        const transformedStats: StatCard[] = [
          {
            title: 'Total Revenue',
            value: `GHS ${data.data.totalRevenue.toLocaleString()}`,
            change: data.data.revenueChange,
            icon: <DollarSign className="h-6 w-6" />,
            color: 'bg-green-100 text-green-600',
          },
          {
            title: 'Total Orders',
            value: data.data.totalOrders,
            change: data.data.ordersChange,
            icon: <ShoppingCart className="h-6 w-6" />,
            color: 'bg-blue-100 text-blue-600',
          },
          {
            title: 'Total Customers',
            value: data.data.totalCustomers,
            change: data.data.customersChange,
            icon: <Users className="h-6 w-6" />,
            color: 'bg-purple-100 text-purple-600',
          },
          {
            title: 'Average Order Value',
            value: `GHS ${(data.data.totalRevenue / data.data.totalOrders).toLocaleString()}`,
            change: data.data.revenueChange - data.data.ordersChange,
            icon: <TrendingUp className="h-6 w-6" />,
            color: 'bg-orange-100 text-orange-600',
          },
        ];

        setStats(transformedStats);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, navigate, timeRange]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#138db3]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-4 md:mb-0">Analytics Dashboard</h1>
        <div className="flex items-center gap-4">
          <Calendar className="h-5 w-5 text-slate-400" />
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex items-center gap-1">
                {stat.change >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
                <span className={`text-sm ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
              </div>
            </div>
            <h3 className="text-sm text-slate-500 mb-1">{stat.title}</h3>
            <p className="text-2xl font-semibold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Top Selling Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Units Sold</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {stats.length > 0 ? (
                <tr className="border-b">
                  <td colSpan={3} className="py-8 text-center text-slate-500">
                    Coming soon...
                  </td>
                </tr>
              ) : (
                <tr className="border-b">
                  <td colSpan={3} className="py-8 text-center text-slate-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 