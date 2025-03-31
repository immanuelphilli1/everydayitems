import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  DollarSign, 
  ArrowLeft,
  Package,
  Clock,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  orders: Order[];
}

// Mock data - replace with actual API call
const MOCK_CUSTOMER: Customer = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+233 24 123 4567',
  address: 'Accra, Ghana',
  joinDate: '2024-01-15',
  totalOrders: 5,
  totalSpent: 2500,
  status: 'active',
  orders: [
    {
      id: 'ORD001',
      date: '2024-02-15',
      total: 500,
      status: 'delivered',
      items: 2
    },
    {
      id: 'ORD002',
      date: '2024-02-20',
      total: 800,
      status: 'processing',
      items: 3
    },
    {
      id: 'ORD003',
      date: '2024-03-01',
      total: 1200,
      status: 'shipped',
      items: 4
    }
  ]
};

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    // Simulate API call
    const timer = setTimeout(() => {
      setCustomer(MOCK_CUSTOMER);
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

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Customer not found</h2>
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => navigate('/admin/customers')}
          >
            Back to Customers
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/admin/customers')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Customer Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Customer Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#138db3]/10 flex items-center justify-center">
                <span className="text-[#138db3] font-semibold">
                  {customer.name.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{customer.name}</h3>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  customer.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {customer.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-400" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-slate-400" />
              <span>{customer.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <span>Joined {new Date(customer.joinDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Customer Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag className="h-5 w-5 text-[#138db3]" />
                <span className="text-sm text-slate-600">Total Orders</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">{customer.totalOrders}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-[#138db3]" />
                <span className="text-sm text-slate-600">Total Spent</span>
              </div>
              <p className="text-2xl font-semibold text-slate-800">GHS {customer.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Order History</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Items</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Total</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {customer.orders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-slate-400" />
                      <span className="text-sm font-medium text-slate-800">{order.id}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {new Date(order.date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600">{order.items} items</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">GHS {order.total.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 