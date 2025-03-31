import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Home, CreditCard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

interface Address {
  id: string;
  isDefault: boolean;
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentMethod {
  id: string;
  isDefault: boolean;
  cardType: string;
  lastFour: string;
  expiryMonth: string;
  expiryYear: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payment'>('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const [changePassword, setChangePassword] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Mock addresses data
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      isDefault: true,
      name: 'Home Address',
      address1: '123 Main St',
      address2: 'Apt 456',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
      phone: '(212) 555-1234',
    },
    {
      id: '2',
      isDefault: false,
      name: 'Work Address',
      address1: '789 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94107',
      country: 'US',
      phone: '(415) 555-6789',
    },
  ]);

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      isDefault: true,
      cardType: 'Visa',
      lastFour: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
    },
    {
      id: '2',
      isDefault: false,
      cardType: 'Mastercard',
      lastFour: '5678',
      expiryMonth: '09',
      expiryYear: '2024',
    },
  ]);

  // Form for new address
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load user profile data
    // In a real app, this would be fetched from the server
    setProfile({
      name: user.name || '',
      email: user.email || '',
      phone: '(555) 123-4567', // Mock data
    });

    setLoading(false);
  }, [user, navigate]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // In a real app, this would call an API endpoint
      // await api.updateProfile(profile);
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Profile updated successfully' });
        setSaving(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
      setSaving(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    // Basic validation
    if (changePassword.newPassword !== changePassword.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setSaving(false);
      return;
    }

    try {
      // In a real app, this would call an API endpoint
      // await api.changePassword(changePassword);
      setTimeout(() => {
        setMessage({ type: 'success', text: 'Password changed successfully' });
        setChangePassword({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setSaving(false);
      }, 1000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' });
      setSaving(false);
    }
  };

  // Handle adding a new address
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();

    // Create a new address
    const address: Address = {
      id: `new-${Date.now()}`,
      isDefault: addresses.length === 0, // Make it default if it's the first address
      ...newAddress,
    };

    setAddresses([...addresses, address]);

    // Reset form
    setNewAddress({
      name: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'US',
      phone: '',
    });

    setMessage({ type: 'success', text: 'Address added successfully' });
  };

  // Handle setting an address as default
  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map(address => ({
        ...address,
        isDefault: address.id === id,
      }))
    );
    setMessage({ type: 'success', text: 'Default address updated' });
  };

  // Handle removing an address
  const handleRemoveAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
    setMessage({ type: 'success', text: 'Address removed successfully' });
  };

  // Handle setting a payment method as default
  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    setMessage({ type: 'success', text: 'Default payment method updated' });
  };

  // Handle removing a payment method
  const handleRemovePayment = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
    setMessage({ type: 'success', text: 'Payment method removed successfully' });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-slate-200 rounded mb-8"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Account</h1>

        {message && (
          <div className={`p-4 mb-6 rounded-md ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar / Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{profile.name}</p>
                    <p className="text-sm text-slate-500">{profile.email}</p>
                  </div>
                </div>
              </div>
              <nav className="p-2">
                <button
                  onClick={() => {
                    setActiveTab('profile');
                    setMessage(null);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <User size={16} className="mr-3" />
                  Profile
                </button>
                <button
                  onClick={() => {
                    setActiveTab('addresses');
                    setMessage(null);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                    activeTab === 'addresses'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Home size={16} className="mr-3" />
                  Addresses
                </button>
                <button
                  onClick={() => {
                    setActiveTab('payment');
                    setMessage(null);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center text-sm ${
                    activeTab === 'payment'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard size={16} className="mr-3" />
                  Payment Methods
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 rounded-md flex items-center text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut size={16} className="mr-3" />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>

                  <form onSubmit={handleProfileUpdate} className="space-y-6 mb-8">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={16} className="text-slate-400" />
                        </div>
                        <Input
                          id="name"
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail size={16} className="text-slate-400" />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>

                    <Button type="submit" disabled={saving}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-6">Change Password</h3>

                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700 mb-1">
                          Current Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-slate-400" />
                          </div>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={changePassword.currentPassword}
                            onChange={(e) => setChangePassword({ ...changePassword, currentPassword: e.target.value })}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                          New Password
                        </label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={changePassword.newPassword}
                          onChange={(e) => setChangePassword({ ...changePassword, newPassword: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                          Confirm New Password
                        </label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={changePassword.confirmPassword}
                          onChange={(e) => setChangePassword({ ...changePassword, confirmPassword: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit" disabled={saving}>
                        {saving ? 'Changing...' : 'Change Password'}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {/* Addresses Tab */}
              {activeTab === 'addresses' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Saved Addresses</h2>

                  {addresses.length > 0 ? (
                    <div className="space-y-4 mb-8">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-slate-200 rounded-md p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center">
                                <h3 className="font-medium text-slate-900">{address.name}</h3>
                                {address.isDefault && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                {address.address1}
                                {address.address2 && `, ${address.address2}`}<br />
                                {address.city}, {address.state} {address.postalCode}<br />
                                {address.country}<br />
                                {address.phone}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {!address.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefaultAddress(address.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemoveAddress(address.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 mb-6">No addresses saved yet.</p>
                  )}

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="text-lg font-medium text-slate-900 mb-6">Add New Address</h3>

                    <form onSubmit={handleAddAddress} className="space-y-4">
                      <div>
                        <label htmlFor="addressName" className="block text-sm font-medium text-slate-700 mb-1">
                          Address Name
                        </label>
                        <Input
                          id="addressName"
                          type="text"
                          placeholder="e.g., Home, Work, etc."
                          value={newAddress.name}
                          onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="address1" className="block text-sm font-medium text-slate-700 mb-1">
                          Address Line 1
                        </label>
                        <Input
                          id="address1"
                          type="text"
                          value={newAddress.address1}
                          onChange={(e) => setNewAddress({ ...newAddress, address1: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="address2" className="block text-sm font-medium text-slate-700 mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <Input
                          id="address2"
                          type="text"
                          value={newAddress.address2 || ''}
                          onChange={(e) => setNewAddress({ ...newAddress, address2: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-slate-700 mb-1">
                            City
                          </label>
                          <Input
                            id="city"
                            type="text"
                            value={newAddress.city}
                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-slate-700 mb-1">
                            State/Province
                          </label>
                          <Input
                            id="state"
                            type="text"
                            value={newAddress.state}
                            onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="postalCode" className="block text-sm font-medium text-slate-700 mb-1">
                            Postal Code
                          </label>
                          <Input
                            id="postalCode"
                            type="text"
                            value={newAddress.postalCode}
                            onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-slate-700 mb-1">
                            Country
                          </label>
                          <select
                            id="country"
                            value={newAddress.country}
                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                            className="w-full h-10 rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="US">United States</option>
                            <option value="CA">Canada</option>
                            <option value="GB">United Kingdom</option>
                            <option value="AU">Australia</option>
                            {/* Add more countries as needed */}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          required
                        />
                      </div>

                      <Button type="submit">
                        Add Address
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {/* Payment Methods Tab */}
              {activeTab === 'payment' && (
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Payment Methods</h2>

                  {paymentMethods.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="border border-slate-200 rounded-md p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <span className="font-medium text-slate-900">
                                  {method.cardType} ending in {method.lastFour}
                                </span>
                                {method.isDefault && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {!method.isDefault && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSetDefaultPayment(method.id)}
                                >
                                  Set as Default
                                </Button>
                              )}
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRemovePayment(method.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 mb-6">No payment methods saved yet.</p>
                  )}

                  <div className="mb-4">
                    <p className="text-sm text-slate-600">
                      To add a new payment method, please proceed to checkout where you can securely add a new card.
                    </p>
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
