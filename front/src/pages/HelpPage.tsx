import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageCircle, Phone, Mail, FileText, Shield, CreditCard, Zap, TrendingUp } from 'lucide-react';

const faqs = [
  {
    question: 'How do I make a PIX transfer?',
    answer: 'Go to Transfer & Payments, select the PIX tab, enter the recipient\'s PIX key (email, CPF, phone or random key), enter the amount and confirm.',
  },
  {
    question: 'How do I add a new card?',
    answer: 'Navigate to My Cards page and click "Add Card". Fill in the card details including type, brand, last four digits and expiry date.',
  },
  {
    question: 'How does the investment simulation work?',
    answer: 'When you invest, the system applies a daily compound interest rate based on the annual rate of the chosen product. You can redeem at any time and the current value will be credited to your account.',
  },
  {
    question: 'Is my money safe?',
    answer: 'Yes! All transactions are encrypted with 256-bit SSL. Your data is protected and all operations are logged in our audit system.',
  },
  {
    question: 'How do I share my PIX QR Code?',
    answer: 'Go to Transfer & Payments, click on the QR Code tab. You will see your personalized QR Code that you can share to receive payments.',
  },
  {
    question: 'How do I view my transaction history?',
    answer: 'Click on "History" in the sidebar. You can filter by type (deposits, withdrawals, transfers) and search by description or amount.',
  },
];

const topics = [
  { icon: CreditCard, label: 'Cards', description: 'Add, manage and block cards' },
  { icon: Zap, label: 'PIX & Transfers', description: 'Keys, QR codes and transfers' },
  { icon: TrendingUp, label: 'Investments', description: 'Products, returns and redemptions' },
  { icon: Shield, label: 'Security', description: 'Password, 2FA and protection' },
  { icon: FileText, label: 'Statements', description: 'History and reports' },
  { icon: MessageCircle, label: 'Other topics', description: 'General questions' },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className='space-y-6 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-bold text-dark-800'>Help & Support</h1>
        <p className='text-gray-400 text-sm mt-1'>How can we help you today?</p>
      </div>

      {/* Search */}
      <div className='relative'>
        <div className='card p-8 bg-primary-500 text-white text-center'>
          <div className='absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-16 translate-x-16' />
          <div className='relative'>
            <h2 className='text-2xl font-bold mb-2'>How can we help?</h2>
            <p className='text-white/70 mb-6'>Search our help center or browse topics below</p>
            <input
              type='text'
              placeholder='Search for help...'
              className='w-full max-w-md bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:bg-white/30 transition-colors'
            />
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className='card p-6'>
        <h3 className='font-semibold text-dark-800 mb-4'>Browse by topic</h3>
        <div className='grid grid-cols-3 gap-3'>
          {topics.map(({ icon: Icon, label, description }) => (
            <button key={label}
              className='flex flex-col items-center gap-2 p-4 rounded-xl bg-cream-100 hover:bg-primary-50 hover:border-primary-200 border border-cream-200 transition-all card-hover text-center'>
              <div className='w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm'>
                <Icon className='w-6 h-6 text-primary-500' />
              </div>
              <p className='text-sm font-medium text-dark-800'>{label}</p>
              <p className='text-xs text-gray-400'>{description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className='card p-6'>
        <h3 className='font-semibold text-dark-800 mb-4'>Frequently Asked Questions</h3>
        <div className='space-y-2'>
          {faqs.map((faq, i) => (
            <div key={i} className='border border-cream-200 rounded-xl overflow-hidden'>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className='w-full flex items-center justify-between p-4 text-left hover:bg-cream-50 transition-colors'>
                <p className='text-sm font-medium text-dark-800 pr-4'>{faq.question}</p>
                {openFaq === i
                  ? <ChevronUp className='w-4 h-4 text-primary-500 shrink-0' />
                  : <ChevronDown className='w-4 h-4 text-gray-400 shrink-0' />}
              </button>
              {openFaq === i && (
                <div className='px-4 pb-4 border-t border-cream-200'>
                  <p className='text-sm text-gray-500 pt-3'>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className='card p-6'>
        <h3 className='font-semibold text-dark-800 mb-4'>Still need help?</h3>
        <div className='grid grid-cols-3 gap-4'>
          <button className='flex flex-col items-center gap-3 p-5 rounded-xl bg-cream-100 hover:bg-primary-50 border border-cream-200 hover:border-primary-200 transition-all card-hover'>
            <div className='w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center'>
              <MessageCircle className='w-6 h-6 text-white' />
            </div>
            <div className='text-center'>
              <p className='text-sm font-medium text-dark-800'>Live Chat</p>
              <p className='text-xs text-gray-400'>Available 24/7</p>
            </div>
          </button>
          <button className='flex flex-col items-center gap-3 p-5 rounded-xl bg-cream-100 hover:bg-primary-50 border border-cream-200 hover:border-primary-200 transition-all card-hover'>
            <div className='w-12 h-12 rounded-full bg-green-500 flex items-center justify-center'>
              <Phone className='w-6 h-6 text-white' />
            </div>
            <div className='text-center'>
              <p className='text-sm font-medium text-dark-800'>Phone</p>
              <p className='text-xs text-gray-400'>0800 123 4567</p>
            </div>
          </button>
          <button className='flex flex-col items-center gap-3 p-5 rounded-xl bg-cream-100 hover:bg-primary-50 border border-cream-200 hover:border-primary-200 transition-all card-hover'>
            <div className='w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center'>
              <Mail className='w-6 h-6 text-white' />
            </div>
            <div className='text-center'>
              <p className='text-sm font-medium text-dark-800'>Email</p>
              <p className='text-xs text-gray-400'>support@finbank.com</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}