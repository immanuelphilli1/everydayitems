import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  Clock, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingBag,
  DollarSign,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  created_at: string;
  total_price: number;
  email: string;
  is_paid: boolean;
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'paid' | 'unpaid' | 'refunded';
  shipping_address: ShippingAddress;
  tracking_number?: string;
}

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/admin/${id}`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, navigate, id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#138db3]"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Order not found</h2>
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => navigate('/admin/orders')}
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Order['status']) => {
    if (!status) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatStatus = (status: string | undefined) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/admin/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Order Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-slate-400" />
              <span className="font-medium">Order ID: {order.id}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-slate-400" />
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-slate-400" />
              <span>{new Date(order.created_at).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-slate-400" />
              <span className={`px-2 py-1 rounded-full text-xs ${
                order?.is_paid ? 'bg-green-100 text-green-800' :
                !order?.is_paid ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {order?.is_paid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            {order.tracking_number && (
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-slate-400" />
                <span>Tracking: {order.tracking_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">Customer Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-slate-400" />
              <span className='capitalize'>{order?.shipping_address?.firstName || 'N/A'} {order?.shipping_address?.lastName || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-slate-400" />
              <span>{order?.email || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-slate-400" />
              <span>{order?.shipping_address?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-slate-400" />
              <div className="flex flex-col">
                <span>{order?.shipping_address?.address1 || 'N/A'}</span>
                {order?.shipping_address?.address2 && (
                  <span>{order.shipping_address.address2}</span>
                )}
                <span>
                  {[
                    order?.shipping_address?.city,
                    order?.shipping_address?.state,
                    order?.shipping_address?.postalCode,
                    order?.shipping_address?.country
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-4">
                <img src={`http://localhost:3001${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="font-medium text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-500">Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-800">GHS {item.price.toLocaleString()}</p>
                <p className="text-sm text-slate-500">Total: GHS {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Order Summary</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="h-5 w-5 text-slate-400" />
              <span>Total Items</span>
            </div>
            <span className="font-medium">{order.items.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-slate-400" />
              <span>Total Amount</span>
            </div>
            <span className="font-medium">GHS {order.total_price.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(order?.status)}
              <span>Status</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              order?.status === 'delivered' ? 'bg-green-100 text-green-800' :
              order?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
              order?.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
              order?.status === 'cancelled' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {formatStatus(order?.status)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 