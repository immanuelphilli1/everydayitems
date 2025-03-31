import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: 'General Questions',
    items: [
      {
        question: 'What is EverydayItems Ltd?',
        answer: 'EverydayItems Ltd is your one-stop shop for all your shopping needs. We offer a wide range of quality products across various categories including electronics, fashion, home goods, and more. Our mission is to provide exceptional customer service and competitive prices to our valued customers.'
      },
      {
        question: 'How do I create an account?',
        answer: 'Creating an account is easy! Click on the "Register" button in the top right corner of the page. Fill in your name, phone number, delivery address, email address, and create a password. Once you complete the registration process, you\'ll have access to your account where you can track orders, save favorite items, and manage your profile.'
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we take your privacy seriously. We use industry-standard encryption to protect your personal information and payment details. We never share your information with third parties without your consent. You can read more about our privacy practices in our Privacy Policy.'
      }
    ]
  },
  {
    title: 'Ordering & Payment',
    items: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard), and mobile money payments. All payments are processed securely through our payment partners.'
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order is placed, you\'ll receive a confirmation email with your order number and tracking details. You can also log into your account and view your order history to track the status of your orders.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'Yes, you can modify or cancel your order within 24 hours of placing it, as long as it hasn\'t been delivered yet. Simply contact our customer service team to cancel the order.'
      }
    ]
  },
  {
    title: 'Delivery',
    items: [
      {
        question: 'What are your delivery options?',
        answer: 'We offer standard and express delivery options. Standard delivery typically takes 3-5 business days, while express delivery delivers within 1-2 business days. Delivery costs vary based on your location and the delivery method selected.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. During checkout, you\'ll see the available shipping options and estimated delivery times for your specific location.'
      },
      {
        question: 'What happens if my package is lost or damaged?',
        answer: 'If your package is lost or damaged during shipping, please contact our customer service team immediately. We\'ll work with our shipping partners to resolve the issue and ensure you receive your items or a full refund.'
      }
    ]
  },
  {
    title: 'Returns & Refunds',
    items: [
      {
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for most items. Items must be unused, in their original packaging, and accompanied by the original receipt. Some items, such as personal care products and undergarments, are not eligible for return.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, contact our customer service team to request a return label. You will be responsible for the return delivery costs.'
      },
      {
        question: 'How long does it take to receive a refund?',
        answer: 'Contact our customer service team to get a refund.'
      }
    ]
  },
  {
    title: 'Product Information',
    items: [
      {
        question: 'How do I know if an item is in stock?',
        answer: 'Each product page shows the current stock status. If an item is out of stock, you can sign up for email notifications to be alerted when it becomes available again.'
      },
      {
        question: 'Do you offer product warranties?',
        answer: 'Yes, most of our products come with manufacturer warranties. The warranty period and coverage details vary by product and manufacturer. You can find warranty information on individual product pages.'
      },
      {
        question: 'Can I get product recommendations?',
        answer: 'Yes! We offer personalized product recommendations based on your browsing history and purchase patterns. You can also use our "Similar Items" feature on product pages to discover related products.'
      }
    ]
  }
];

export default function FAQPage() {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});
  const [openQuestions, setOpenQuestions] = useState<{ [key: string]: boolean }>({});

  const toggleCategory = (categoryTitle: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle]
    }));
  };

  const toggleQuestion = (questionKey: string) => {
    setOpenQuestions(prev => ({
      ...prev,
      [questionKey]: !prev[questionKey]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h1>
        <p className="text-slate-600 mb-12">
          Find answers to common questions about our products, services, and policies. If you can't find what you're looking for, please contact our customer service team.
        </p>

        <div className="space-y-6">
          {faqData.map((category) => (
            <div key={category.title} className="bg-white rounded-lg shadow-sm border border-slate-200">
              <button
                onClick={() => toggleCategory(category.title)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <h2 className="text-xl font-semibold text-slate-900">{category.title}</h2>
                {openCategories[category.title] ? (
                  <ChevronUp size={24} className="text-slate-500" />
                ) : (
                  <ChevronDown size={24} className="text-slate-500" />
                )}
              </button>

              {openCategories[category.title] && (
                <div className="px-6 pb-4">
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={`${category.title}-${index}`} className="border-t border-slate-100 pt-4">
                        <button
                          onClick={() => toggleQuestion(`${category.title}-${index}`)}
                          className="w-full flex justify-between items-start text-left"
                        >
                          <h3 className="text-lg font-medium text-slate-900">{item.question}</h3>
                          {openQuestions[`${category.title}-${index}`] ? (
                            <ChevronUp size={20} className="text-slate-500 ml-4 flex-shrink-0" />
                          ) : (
                            <ChevronDown size={20} className="text-slate-500 ml-4 flex-shrink-0" />
                          )}
                        </button>
                        {openQuestions[`${category.title}-${index}`] && (
                          <p className="mt-4 text-slate-600">{item.answer}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">
            Still have questions? We're here to help!
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