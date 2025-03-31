import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TermsSection {
  title: string;
  content: string[];
}

const termsData: TermsSection[] = [
  {
    title: 'Introduction',
    content: [
      'Welcome to EverydayItems Ltd. By accessing and using our website, you agree to be bound by these Terms of Service. Please read these terms carefully before using our services.',
      'These terms govern your use of our website, products, and services. By using our website, you accept these terms in full. If you disagree with any part of these terms, please do not use our website.',
      'We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through our website.'
    ]
  },
  {
    title: 'Definitions',
    content: [
      '"Website" refers to EverydayItems Ltd\'s online platform.',
      '"User," "you," and "your" refer to individuals accessing or using our website.',
      '"We," "us," and "our" refer to EverydayItems Ltd.',
      '"Services" refers to all products, features, and services provided through our website.',
      '"Content" refers to all text, images, videos, and other materials available on our website.'
    ]
  },
  {
    title: 'Account Registration',
    content: [
      'To use certain features of our website, you must register for an account.',
      'You must provide accurate and complete information when creating an account.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must notify us immediately of any unauthorized use of your account.',
      'We reserve the right to terminate or suspend accounts that violate these terms.'
    ]
  },
  {
    title: 'Product Information',
    content: [
      'We strive to provide accurate product descriptions and pricing information.',
      'All prices are subject to change without notice.',
      'Product availability is subject to change without notice.',
      'We reserve the right to modify or discontinue any product without notice.',
      'We are not responsible for typographical errors regarding pricing or product information.'
    ]
  },
  {
    title: 'Ordering and Payment',
    content: [
      'By placing an order, you agree to pay all charges at the prices in effect at the time of purchase.',
      'We accept various payment methods as indicated on our website.',
      'All payments must be made in full before order processing.',
      'We reserve the right to refuse service to anyone for any reason at any time.',
      'Orders are subject to acceptance and availability.'
    ]
  },
  {
    title: ' Delivery',
    content: [
      'We will make reasonable efforts to deliver products within the estimated timeframes.',
      'Delivery costs and delivery times vary based on items and location.',
      'We are not responsible for delays beyond our control.',
      'Risk of loss and title for items purchased pass to you upon delivery.',
      'Customs and import duties may apply to international orders.'
    ]
  },
  {
    title: 'Returns and Refunds',
    content: [
      'Our return policy is subject to the terms outlined in our Returns Policy.',
      'Products must be returned in their original packaging and condition.',
      'Refunds will be processed according to our refund policy.',
      'Delivery costs for returns are the responsibility of the customer unless otherwise stated.',
      'We reserve the right to refuse returns that do not meet our criteria.'
    ]
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on our website is protected by intellectual property rights.',
      'You may not use our content without our express written permission.',
      'Trademarks and logos are the property of their respective owners.',
      'Unauthorized use of our intellectual property is strictly prohibited.',
      'You may not copy, modify, or distribute our content without permission.'
    ]
  },
  {
    title: 'User Conduct',
    content: [
      'You agree not to use our website for any illegal purposes.',
      'You must not transmit any viruses, malware, or other malicious code.',
      'You must not attempt to gain unauthorized access to our systems.',
      'You must not interfere with the proper working of our website.',
      'You must not use our website to harass, abuse, or harm others.'
    ]
  },
  {
    title: 'Limitation of Liability',
    content: [
      'We are not liable for any indirect, incidental, or consequential damages.',
      'Our liability is limited to the amount paid for the product or service.',
      'We are not responsible for third-party actions or content.',
      'We do not guarantee uninterrupted or error-free service.',
      'We are not liable for any loss of data or business interruption.'
    ]
  },
  {
    title: 'Governing Law',
    content: [
      'These terms are governed by the laws of the Ghana.',
      'Any disputes shall be resolved in the courts of Ghana.',
      'The United Nations Convention on Contracts for the International Sale of Goods does not apply.',
      'We reserve the right to bring legal action in any jurisdiction.',
      'You agree to submit to the personal jurisdiction of the courts located in Ghana.'
    ]
  },
  {
    title: 'Contact Information',
    content: [
      'If you have any questions about these Terms of Service, please contact us at:',
      'Email: support@everydayitems.com',
      'Phone: +233 (59) 452 6426',
      'Address: 123 Shopping Street, Retail District, Accra, Ghana',
      'We will respond to your inquiry within 30 days.'
    ]
  }
];

export default function TermsPage() {
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionTitle: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        <p className="text-slate-600 mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6">
          {termsData.map((section) => (
            <div key={section.title} className="bg-white rounded-lg shadow-sm border border-slate-200">
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <h2 className="text-xl font-semibold text-slate-900">{section.title}</h2>
                {openSections[section.title] ? (
                  <ChevronUp size={24} className="text-slate-500" />
                ) : (
                  <ChevronDown size={24} className="text-slate-500" />
                )}
              </button>

              {openSections[section.title] && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {section.content.map((paragraph, index) => (
                      <p key={index} className="text-slate-600">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Have questions about our terms of service?
          </p>
          <a
            href="/contact"
            className="inline-block bg-[#138db3] text-white px-6 py-3 rounded-md hover:bg-[#138db3]/90 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
} 