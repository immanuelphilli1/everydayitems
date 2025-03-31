import { MapPin, Phone, Clock, Globe, } from 'lucide-react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-[#138db3]/10 py-24 md:py-32">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">
            About <span className="text-[#138db3]">Everyday Items Ltd</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto text-center">
            Your trusted source for premium consumer electronics, home appliances, and more in Ghana.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-slate-600 mb-6">
                Everyday Items Ltd is a leading retailer of consumer electronics and home appliances in Ghana. 
                We specialize in providing high-quality products sourced from the UK, catering to both wholesale 
                and retail customers.
              </p>
              <p className="text-slate-600">
                Our commitment to quality, customer satisfaction, and competitive pricing has made us a trusted 
                name in the industry. We pride ourselves on offering a wide range of products that enhance your 
                everyday life.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#138db3]/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#138db3] mb-2">5K+</h3>
                <p className="text-slate-600">Happy Customers</p>
              </div>
              <div className="bg-[#138db3]/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#138db3] mb-2">100+</h3>
                <p className="text-slate-600">Products</p>
              </div>
              <div className="bg-[#138db3]/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#138db3] mb-2">6+</h3>
                <p className="text-slate-600">Categories</p>
              </div>
              <div className="bg-[#138db3]/10 p-6 rounded-lg">
                <h3 className="text-2xl font-bold text-[#138db3] mb-2">24/7</h3>
                <p className="text-slate-600">Support</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Product Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Home Appliances',
                description: 'Household electrical devices including air conditioners, microwaves, and more'
              },
              {
                title: 'Consumer Electronics',
                description: 'Latest gadgets and electronic devices for everyday use'
              },
              {
                title: 'Interior Décor Items',
                description: 'Decorative products to enhance your living spaces'
              },
              {
                title: 'Tools & Accessories',
                description: 'Professional tool sets and household essentials'
              },
              {
                title: 'Gaming Accessories',
                description: 'Consoles, controllers, and gaming peripherals'
              },
              {
                title: 'Audio & Visual Equipment',
                description: 'High-quality TVs, speakers, and sound systems'
              }
            ].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-3">{category.title}</h3>
                <p className="text-slate-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get in Touch</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">Location</h3>
                <p className="text-slate-600">Ashale Botwe, Peace Be Junction, Accra, Ghana</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <Phone className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-slate-600">0594526426</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-slate-600">7 AM - 7 PM daily</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#138db3]/10 p-3 rounded-full">
                <Globe className="h-6 w-6 text-[#138db3]" />
              </div>
              <div>
                <h3 className="font-medium">Website</h3>
                <p className="text-slate-600">everydayitems.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Follow Us</h2>
          <div className="flex justify-center gap-6">
            <a
              href="https://www.instagram.com/everydayitemss_"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#138db3]/10 p-3 rounded-full hover:bg-[#138db3]/20 transition-colors"
            >
              <FaInstagram size={24} color="#138db3" />
            </a>
            <a
              href="https://twitter.com/EverydayItemss_"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#138db3]/10 p-3 rounded-full hover:bg-[#138db3]/20 transition-colors"
            >
              <FaTwitter size={24} color="#138db3" />
            </a>
            <a
              href="https://www.facebook.com/everydayitemsltd"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#138db3]/10 p-3 rounded-full hover:bg-[#138db3]/20 transition-colors"
            >
              <FaFacebook size={24} color="#138db3" />
            </a>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Visit Our Store</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.0!2d-0.1438802!3d5.6855313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf8306829ab68d%3A0x824efe500ffa5758!2sEVERYDAY%20ITEMS%20CONSUMER%20ELECTRONICS%20STORE!5e0!3m2!1sen!2sgh!4v1709654321!5m2!1sen!2sgh"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
} 