import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface PrivacySection {
  title: string;
  content: string[];
}

const privacyData: PrivacySection[] = [
  {
    title: 'Introduction',
    content: [
      'At EverydayItems Ltd, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.',
      'Please read this privacy policy carefully. By using our website, you consent to the practices described in this policy.',
      'We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last updated" date and the updated version will be effective as soon as it is accessible.'
    ]
  },
  {
    title: 'Information We Collect',
    content: [
      'Personal Information: We collect personal information that you voluntarily provide to us when you register on the website, make a purchase, or communicate with us. This may include:',
      '• Name and contact information (email address, phone number, delivery address)',
      '• Payment information (credit card details, mobile money account)',
      '• Order history and preferences',
      '• Communication preferences',
      '• Account credentials',
      'Automatically Collected Information: When you visit our website, we automatically collect certain information about your device, including:',
      '• IP address',
      '• Browser type and version',
      '• Operating system',
      '• Time zone setting',
      '• Pages visited and interaction patterns'
    ]
  },
  {
    title: 'How We Use Your Information',
    content: [
      'We use the information we collect to:',
      '• Process your orders and payments',
      '• Send you order confirmations and delivery updates',
      '• Provide customer support and respond to your inquiries',
      '• Send you marketing communications (with your consent)',
      '• Improve our website and services',
      '• Comply with legal obligations',
      '• Prevent fraud and enhance security',
      '• Analyze trends and user behavior'
    ]
  },
  {
    title: 'Information Sharing',
    content: [
      'We do not sell your personal information to third parties. We may share your information with:',
      '• Service providers who assist in our operations (payment processors, shipping companies)',
      '• Business partners who help us improve our services',
      '• Law enforcement when required by law',
      '• Other users (only information you choose to share publicly)',
      'We ensure that any third parties with whom we share your information maintain appropriate security measures to protect your data.'
    ]
  },
  {
    title: 'Data Security',
    content: [
      'We implement appropriate technical and organizational security measures to protect your personal information, including:',
      '• Encryption of sensitive data',
      '• Regular security assessments',
      '• Access controls and authentication',
      '• Secure data storage and transmission',
      '• Employee training on data protection',
      'However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.'
    ]
  },
  {
    title: 'Your Rights',
    content: [
      'You have the right to:',
      '• Access your personal information',
      '• Correct inaccurate information',
      '• Request deletion of your information',
      '• Opt-out of marketing communications',
      '• Lodge a complaint with supervisory authorities',
      'To exercise these rights, please contact us using the information provided in the Contact Us section.'
    ]
  },
  {
    title: 'Cookies and Tracking',
    content: [
      'We use cookies and similar tracking technologies to:',
      '• Remember your preferences',
      '• Analyze website traffic',
      '• Improve user experience',
      '• Provide personalized content',
      'You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect website functionality.'
    ]
  },
  {
    title: 'Children\'s Privacy',
    content: [
      'Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.',
      'If we learn that we have collected personal information from a child under 13, we will take steps to delete that information.'
    ]
  },
  {
    title: 'Contact Us',
    content: [
      'If you have any questions about this Privacy Policy or our data practices, please contact us at:',
      'Email: support@everydayitems.com',
      'Phone: +233 (59) 452 6426',
      'Address: 123 Shopping Street, Retail District, Accra, Ghana',
      'We will respond to your inquiry within 30 days.'
    ]
  }
];

export default function PrivacyPage() {
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
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        <p className="text-slate-600 mb-12">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="space-y-6">
          {privacyData.map((section) => (
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
            Have questions about our privacy policy?
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