import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'

const faqs = [
  {
    q: 'What is Sidou Signals?',
    a: 'Sidou Signals is a professional trading signals platform that uses advanced algorithms and expert analysis to provide accurate, real-time trading signals across multiple markets including Forex, Crypto, Stocks, and Commodities.',
  },
  {
    q: 'How accurate are the signals?',
    a: 'Our signals maintain a 95% accuracy rate. We use a combination of technical analysis, machine learning, and expert review to ensure the highest quality signals.',
  },
  {
    q: 'How do I get started?',
    a: 'Simply create a free account to start receiving basic signals immediately. Upgrade to Premium or Lifetime for unlimited access and advanced features.',
  },
  {
    q: 'Which markets do you cover?',
    a: 'We cover Forex (major and minor pairs), Cryptocurrencies (BTC, ETH, SOL, and more), US Stocks, and Commodities (Gold, Silver, Oil).',
  },
  {
    q: 'Is there a money-back guarantee?',
    a: 'Yes! We offer a 14-day money-back guarantee on all paid plans. If you are not satisfied, contact our support for a full refund.',
  },
  {
    q: 'How are signals delivered?',
    a: 'Signals are delivered in real-time through our web platform, push notifications, and email alerts. Premium users also get SMS alerts.',
  },
  {
    q: 'Can I cancel my subscription?',
    a: 'Yes, you can cancel anytime from your dashboard. Your access will continue until the end of the billing period.',
  },
  {
    q: 'Do you provide support?',
    a: 'Free users get email support. Premium users get priority email and chat support. Lifetime users get 24/7 VIP support with a personal account manager.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)
  const [search, setSearch] = useState('')

  const filtered = faqs.filter(
    (f) =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Frequently Asked{' '}
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about Sidou Signals
          </p>
        </motion.div>

        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search questions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-3">
          {filtered.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 lg:p-5 text-left"
              >
                <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 lg:px-5 pb-4 lg:pb-5 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-dark-border pt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
