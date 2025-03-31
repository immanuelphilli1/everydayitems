import { Link, useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

interface SitemapSection {
  title: string;
  description: string;
  links: {
    title: string;
    path: string;
    description: string;
    requiresAuth?: boolean;
  }[];
}

const sitemapData: SitemapSection[] = [
  {
    title: 'Main Pages',
    description: 'Core pages of the website',
    links: [
      {
        title: 'Home',
        path: '/',
        description: 'Welcome to EverydayItems Ltd - Your one-stop shop for all your shopping needs'
      },
      {
        title: 'Shop',
        path: '/products',
        description: 'Browse our extensive collection of products across various categories'
      },
      {
        title: 'About Us',
        path: '/about-us',
        description: 'Learn about our company, mission, and values'
      },
      {
        title: 'Contact Us',
        path: '/contact',
        description: 'Get in touch with our customer service team'
      }
    ]
  },
  {
    title: 'User Account',
    description: 'Pages related to user account management',
    links: [
      {
        title: 'Login',
        path: '/login',
        description: 'Sign in to your account'
      },
      {
        title: 'Register',
        path: '/register',
        description: 'Create a new account'
      },
      {
        title: 'Forgot Password',
        path: '/forgot-password',
        description: 'Reset your password'
      },
      {
        title: 'Profile',
        path: '/profile',
        description: 'Manage your account settings and preferences',
        requiresAuth: true
      },
      {
        title: 'Orders',
        path: '/orders',
        description: 'View and track your orders',
        requiresAuth: true
      }
    ]
  },
  {
    title: 'Legal & Information',
    description: 'Important legal and informational pages',
    links: [
      {
        title: 'Privacy Policy',
        path: '/privacy',
        description: 'Our privacy practices and data protection policies'
      },
      {
        title: 'Terms of Service',
        path: '/terms',
        description: 'Terms and conditions for using our website'
      },
      {
        title: 'FAQ',
        path: '/faq',
        description: 'Frequently asked questions and answers'
      }
    ]
  }
];

export default function Sitemap() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLinkClick = (path: string, requiresAuth?: boolean) => {
    if (requiresAuth && !user) {
      navigate('/login');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Sitemap</h1>
        <p className="text-slate-600 mb-12">
          A complete list of all pages on our website. Use this sitemap to navigate through our content.
        </p>

        <div className="space-y-12">
          {sitemapData.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">{section.title}</h2>
              <p className="text-slate-600 mb-6">{section.description}</p>
              
              <div className="space-y-4">
                {section.links.map((link) => (
                  <button
                    key={link.path}
                    onClick={() => handleLinkClick(link.path, link.requiresAuth)}
                    className="w-full text-left block p-4 rounded-md hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-[#138db3] hover:text-[#138db3]/80">
                          {link.title}
                        </h3>
                        <p className="text-sm text-slate-600 mt-1">{link.description}</p>
                      </div>
                      <span className="text-slate-400 mt-1"><FaChevronRight /></span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Can't find what you're looking for?
          </p>
          <button
            onClick={() => handleLinkClick('/contact')}
            className="inline-block bg-[#138db3] text-white px-6 py-3 rounded-md hover:bg-[#138db3]/90 transition-colors"
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
} 