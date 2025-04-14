import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validatePassword = () => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form inputs
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    const passwordError = validatePassword();
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      await register(name, Number(phone), email, address, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestCheckout = () => {
    // Simply navigate to cart or checkout page without registering
    navigate('/cart');
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center pt-24 pb-12 px-4">
      <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Join our community of shoppers for the best deals and experience.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1 outline-none">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1 outline-none">
                Phone number
              </label>
              <Input
                id="phone"
                type="text"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1 outline-none">
                Email 
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-slate-700 mb-1 outline-none">
                Address
              </label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10 focus:ring-[#138db3] focus:border-[#138db3]"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="focus:ring-[#138db3] focus:border-[#138db3]"
              />
            </div>
          </div>
<div>
<small className="mt-1 text-xs text-slate-500">
                Password must be at least 8 characters with uppercase, lowercase and numbers.
              </small>
</div>
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-[#138db3] focus:ring-[#138db3] border-slate-300 rounded"
              required
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-slate-600">
              I agree to the{' '}
              <Link to="/terms" className="text-[#138db3] hover:text-[#138db3]/80">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-[#138db3] hover:text-[#138db3]/80">
                Privacy Policy
              </Link>
            </label>
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#138db3] hover:text-[#138db3]/80 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">or</span>
            </div>
          </div>

          <div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGuestCheckout}
            >
              Continue as Guest
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
