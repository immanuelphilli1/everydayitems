import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';
import { MdEmail, MdPhone } from 'react-icons/md';
import logo from '@/assets/images/EverydayItems-nogb.png'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <img src={logo} className='w-32 md:w-40' alt='logo' />
            </h3>
            <p className="text-slate-300 mb-4">
              Your one-stop shop for all your shopping needs. Quality products, competitive prices, and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/everydayitemsltd" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#138db3]/80 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com/EverydayItemss_" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#138db3]/80 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://www.instagram.com/everydayitemss_" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#138db3]/80 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://www.tiktok.com/@everydayitemss_" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#138db3]/80 transition-colors">
                <FaTiktok size={20} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => window.location.href = '/products'} className="hover:text-white transition-colors">
                  All Products
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/deals'} className="hover:text-white transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/contact'} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/categories'} className="hover:text-white transition-colors">
                  Categories
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Customer Service</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => window.location.href = '/faq'} className="hover:text-white transition-colors">
                  FAQ
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/terms'} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => window.location.href = '/privacy'} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>
            <div className="space-y-3 text-slate-300">
              <p className="flex items-center">
                <span className="mr-2"><MdEmail size={18} /></span> support@everydayitemsltd.com
              </p>
              <p className="flex items-center">
                <span className="mr-2"><MdPhone size={18} /></span> +233 (59) 452 6426
              </p>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Subscribe to our newsletter</h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-3 py-2 rounded-l-md text-black w-full focus:outline-none focus:ring-2 focus:ring-[#138db3]"
                  />
                  <button
                    type="submit"
                    className="bg-[#138db3] hover:bg-[#138db3]/90 text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-slate-300 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {currentYear} EverydayItems Ltd. All rights reserved.</p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <button onClick={() => window.location.href = '/privacy'} className="hover:text-white transition-colors">
                    Privacy
                  </button>
                </li>
                <li>
                 <button onClick={() => window.location.href = '/terms'} className="hover:text-white transition-colors">
                    Terms
                  </button>
                </li>
                <li>
                  <button onClick={() => window.location.href = '/sitemap'} className="hover:text-white transition-colors">
                    Sitemap
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
