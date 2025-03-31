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

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

// Mock data - replace with actual API calls
const MOCK_STATS: StatCard[] = [
  {
    title: 'Total Revenue',
    value: 'GHS 45,000',
    change: 12.5,
    icon: <DollarSign className="h-6 w-6" />,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Total Orders',
    value: 156,
    change: 8.2,
    icon: <ShoppingCart className="h-6 w-6" />,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'New Customers',
    value: 45,
    change: -2.4,
    icon: <Users className="h-6 w-6" />,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Average Order Value',
    value: 'GHS 288',
    change: 5.7,
    icon: <TrendingUp className="h-6 w-6" />,
    color: 'bg-orange-100 text-orange-600',
  },
];

const MOCK_TOP_PRODUCTS = [
  { name: 'Sony PlayStation Pulse Elite Wireless Headset', sales: 45, revenue: 'GHS 112,500' },
  { name: 'Midea 1.5 hp Inverter Air Conditioner', sales: 38, revenue: 'GHS 247,000' },
  { name: 'TCL 55 inch Smart Android TV', sales: 32, revenue: 'GHS 208,000' },
  { name: 'Midea 4L Air Fryer', sales: 28, revenue: 'GHS 28,000' },
  { name: 'EverydayItems 499 pieces Professional Tool Set', sales: 25, revenue: 'GHS 62,500' },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('30days');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
        {MOCK_STATS.map((stat, index) => (
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
                  {Math.abs(stat.change)}%
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
              {MOCK_TOP_PRODUCTS.map((product, index) => (
                <tr key={index} className="border-b last:border-0">
                  <td className="py-3 px-4">
                    <div className="text-sm font-medium text-slate-800">{product.name}</div>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600">{product.sales}</td>
                  <td className="py-3 px-4 text-right text-sm text-slate-600">{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add more sections as needed */}
    </div>
  );
} 