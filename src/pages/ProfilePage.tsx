import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

interface Order_ {
  id: string;
  create_at: string;
  total_price: number;
  status: string;
  items: [];
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    newsletter: boolean;
  };
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone?.toString() || '',
    address: user?.address || '',
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true
    }
  });

  const [orders_, setOrders] = useState<Order_[]>([]);

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

  // Mock order history data
  const orders: Order[] = [
    {
      id: 'ORD001',
      date: '2024-03-15',
      total: 299.99,
      status: 'Delivered',
      items: 3
    },
    {
      id: 'ORD002',
      date: '2024-03-10',
      total: 149.99,
      status: 'Processing',
      items: 1
    }
  ];



  console.log("Orders : ",orders_);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = () => {
    // TODO: Implement profile update logic
    setIsEditing(false);
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="text-[#138db3] hover:text-[#138db3]/80"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-4">
            <button
              onClick={() => setIsEditing(false)}
              className="text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="bg-[#138db3] text-white px-4 py-2 rounded-md hover:bg-[#138db3]/90"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          {isEditing ? (
            <input
              title='Name'
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#138db3]"
            />
          ) : (
            <p className="text-slate-600">{profileData.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          {isEditing ? (
            <input
              title='Email'
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#138db3]"
            />
          ) : (
            <p className="text-slate-600">{profileData.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
          {isEditing ? (
            <input  
              title='Phone'
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#138db3]"
            />
          ) : (
            <p className="text-slate-600">{profileData.phone}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
          {isEditing ? (
            <textarea 
              title='Address'
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#138db3]"
              rows={3}
            />
          ) : (
            <p className="text-slate-600">{profileData.address}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderOrdersTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Order History</h2>
      <div className="space-y-4">
        {/* {orders.map((order) => (
          <div
            key={order.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-[#138db3] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-900">Order #{order.id}</p>
                <p className="text-sm text-slate-600">{order.date}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">${order.total.toFixed(2)}</p>
                <p className="text-sm text-slate-600">{order.items} items</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))} */}

  {orders_.map((order) => (
          <div
            key={order.id}
            className="border border-slate-200 rounded-lg p-4 hover:border-[#138db3] transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-900">Order #{order.id}</p>
                <p className="text-sm text-slate-600">{order.create_at}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-slate-900">${order.total_price}</p>
                <p className="text-sm text-slate-600">{order.items.length} items</p>
              </div>
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">Preferences</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Email Notifications</p>
            <p className="text-sm text-slate-600">Receive updates about your orders and promotions</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              title='Email Notifications'
              type="checkbox"
              checked={profileData.preferences.emailNotifications}
              onChange={(e) => setProfileData({
                ...profileData,
                preferences: { ...profileData.preferences, emailNotifications: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#138db3]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#138db3]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">SMS Notifications</p>
            <p className="text-sm text-slate-600">Receive text messages about your orders</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              title='SMS Notifications'
              type="checkbox"
              checked={profileData.preferences.smsNotifications}
              onChange={(e) => setProfileData({
                ...profileData,
                preferences: { ...profileData.preferences, smsNotifications: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#138db3]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#138db3]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-slate-900">Newsletter</p>
            <p className="text-sm text-slate-600">Receive updates about new products and special offers</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              title='Newsletter'
              type="checkbox"
              checked={profileData.preferences.newsletter}
              onChange={(e) => setProfileData({
                ...profileData,
                preferences: { ...profileData.preferences, newsletter: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#138db3]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#138db3]"></div>
          </label>
        </div>
      </div>
    </div>
  );

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-[#138db3] rounded-full flex items-center justify-center">
                  <FaUser className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="font-semibold text-slate-900">{user.name}</h2>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-[#138db3] text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FaUser className="text-lg" />
                  <span>Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-[#138db3] text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FaShoppingBag className="text-lg" />
                  <span>Orders</span>
                </button>

                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center space-x-3 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-[#138db3] text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <FaCog className="text-lg" />
                  <span>Preferences</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'profile' && renderProfileTab()}
            {activeTab === 'orders' && renderOrdersTab()}
            {activeTab === 'preferences' && renderPreferencesTab()}
          </div>
        </div>
      </div>
    </div>
  );
} 