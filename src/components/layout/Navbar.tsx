import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import logo from '@/assets/images/EverydayItems-nogb.png'

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items: cartItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const renderUserDropdown = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <Link to="/admin" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
            Admin Dashboard
          </Link>
          <Link to="/admin/products" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
            View Orders
          </Link>
          <Link to="/admin/customers" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
            Customer List
          </Link>
          <Link to="/admin/analytics" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
            Analytics
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#dee68d]"
          >
            Logout
          </button>
        </div>
      );
    }

    return (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
          Your Profile
        </Link>
        <Link to="/orders" className="block px-4 py-2 text-sm text-slate-700 hover:bg-[#dee68d]">
          Orders
        </Link>
        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#dee68d]"
        >
          Logout
        </button>
      </div>
    );
  };

  const renderMobileUserMenu = () => {
    if (!user) return null;

    if (user.role === 'admin') {
      return (
        <>
          <button onClick={() => window.location.href = '/admin'} className="py-2 w-full text-left hover:text-[#138db3]">
            Admin Dashboard
          </button>
          <button onClick={() => window.location.href = '/admin/products'} className="py-2 w-full text-left hover:text-[#138db3]">
            Manage Products
          </button>
          <button onClick={() => window.location.href = '/admin/orders'} className="py-2 w-full text-left hover:text-[#138db3]">
            View Orders
          </button>
          <button onClick={() => window.location.href = '/admin/customers'} className="py-2 w-full text-left hover:text-[#138db3]">
            Customer List
          </button>
          <button onClick={() => window.location.href = '/admin/analytics'} className="py-2 w-full text-left hover:text-[#138db3]">
            Analytics
          </button>
          <button
            onClick={handleLogout}
            className="py-2 text-left text-red-600"
          >
            Logout
          </button>
        </>
      );
    }

    return (
      <>
        <button onClick={() => window.location.href = '/profile'} className="py-2 w-full text-left hover:text-[#138db3]">
          Your Profile
        </button>
        <button onClick={() => window.location.href = '/orders'} className="py-2 w-full text-left hover:text-[#138db3]">
          Orders
        </button>
        <button
          onClick={handleLogout}
          className="py-2 text-left text-red-600"
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-white/80 backdrop-blur-sm py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[#138db3] outline-none">
            <img src={logo} className='w-32 md:w-40' alt='logo' />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="space-x-6 text-slate-700">
              <Link to="/products" className="hover:text-[#138db3] transition-colors">
                All Products
              </Link>
              <Link to="/categories" className="hover:text-[#138db3] transition-colors">
                Categories
              </Link>
              <Link to="/about" className="hover:text-[#138db3] transition-colors">
                About Us
              </Link>
              <Link to="/contact" className="hover:text-[#138db3] transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-slate-700 hover:text-[#138db3] transition-colors" />
                <span className="absolute -top-2 -right-2 bg-[#138db3] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              </Link>

              {user ? (
                <div className="relative group">
                  <Button variant="ghost" className="p-0">
                    <User className="h-6 w-6 text-slate-700" />
                  </Button>
                  {renderUserDropdown()}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="primary" size="sm" className="bg-[#138db3] hover:bg-[#138db3]/90">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className='flex items-center gap-4 md:hidden'>
            <Link to="/products" className="relative">
              <Search className="h-6 w-6 text-slate-700" />
            </Link>
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-slate-700 hover:text-[#138db3] transition-colors" />
              <span className="absolute -top-2 -right-2 bg-[#138db3] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.length}
              </span>
            </Link>
            <button
              className="text-slate-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="flex flex-col items-start w-full space-y-3 text-slate-700">
              <button onClick={() => window.location.href = '/products'} className="py-2 w-full text-left hover:text-[#138db3]">
                All Products
              </button>
              <button onClick={() => window.location.href = '/categories'} className="py-2 w-full text-left hover:text-[#138db3]">
                Categories
              </button>
              <button onClick={() => window.location.href = '/about'} className="py-2 w-full text-left hover:text-[#138db3]">
                About Us
              </button>
              <button onClick={() => window.location.href = '/contact'} className="py-2 w-full text-left hover:text-[#138db3]">
                Contact Us
              </button>
              <button onClick={() => window.location.href = '/cart'} className="py-2 w-full text-left hover:text-[#138db3] flex items-center">
                <ShoppingCart className="h-5 w-5 mr-2" /> Cart ({cartItems.length})
              </button>
              {renderMobileUserMenu()}
              {!user && (
                <div className="flex flex-col w-full pt-2">
                  <button onClick={() => window.location.href = '/login'} className="py-2 w-full text-left hover:text-[#138db3]">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </button>
                  <button onClick={() => window.location.href = '/register'} className="py-2 w-full hover:text-[#138db3]">
                    <Button variant="primary" className="w-full bg-[#138db3] hover:bg-[#138db3]/90">
                      Register
                    </Button>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
