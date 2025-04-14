import { useState } from 'react';
import { FaPhone, FaMapMarkerAlt, FaClock, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactUs() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#138db3]/10 rounded-full">
                <span className="text-[#138db3] text-xl"><FaPhone /></span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Phone</h3>
                <a href="tel:+233594526426" className="text-gray-600">+233 (59) 452 6426</a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#138db3]/10 rounded-full">
                <span className="text-[#138db3] text-xl"><FaMapMarkerAlt /></span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Address</h3>
                <p className="text-gray-600">Ashale Botwe, Peace Be Junction,<br/> Accra, Ghana</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-[#138db3]/10 rounded-full">
                <span className="text-[#138db3] text-xl"><FaClock /></span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Business Hours</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 8:00 PM<br />Saturday: 10:00 AM - 6:00 PM<br />Sunday: Closed</p>
              </div>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a target='_blank' href="https://twitter.com/EverydayItemss_" className="p-3 bg-[#138db3]/10 rounded-full hover:bg-[#138db3]/20 transition-colors">
                <span className="text-[#138db3] text-xl"><FaTwitter /></span>
              </a>
              <a target='_blank' href="https://www.instagram.com/everydayitemss_" className="p-3 bg-[#138db3]/10 rounded-full hover:bg-[#138db3]/20 transition-colors">
                <span className="text-[#138db3] text-xl"><FaInstagram /></span>
              </a>
              <a target='_blank' href="https://www.tiktok.com/@everydayitemss_" className="p-3 bg-[#138db3]/10 rounded-full hover:bg-[#138db3]/20 transition-colors">
                <span className="text-[#138db3] text-xl"><FaTiktok /></span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className='bg-[#138db3]/10 rounded-lg px-12 py-6'>
          <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#138db3]"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#138db3]"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#138db3]"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#138db3]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#138db3] text-white py-3 px-6 rounded-lg hover:bg-[#138db3]/90 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Find Us</h2>
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.1908842954867!2d-0.14388019999999996!3d5.6855313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf8306829ab68d%3A0x824efe500ffa5758!2sEVERYDAY%20ITEMS%20CONSUMER%20ELECTRONICS%20STORE!5e0!3m2!1sen!2sgh!4v1742836416463!5m2!1sen!2sgh"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
} 