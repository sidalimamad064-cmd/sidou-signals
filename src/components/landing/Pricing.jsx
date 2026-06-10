import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Check, X } from 'lucide-react'

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with basic signals',
    color: 'from-gray-500 to-gray-600',
    border: 'border-gray-200 dark:border-dark-border',
    features: [
      { text: '3 signals per day', included: true },
      { text: 'Basic market analysis', included: true },
      { text: 'Email notifications', included: true },
      { text: 'Real-time alerts', included: false },
      { text: 'Premium indicators', included: false },
      { text: 'Priority support', included: false },
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Premium',
    price: '$29',
    period: '/month',
    description: 'For serious traders',
    color: 'from-primary to-primary-dark',
    border: 'border-primary',
    features: [
      { text: 'Unlimited signals', included: true },
      { text: 'Advanced market analysis', included: true },
      { text: 'Real-time push alerts', included: true },
      { text: 'Premium indicators', included: true },
      { text: 'Risk management tools', included: true },
      { text: 'Priority support', included: false },
    ],
    cta: 'Start Premium',
    popular: true,
  },
  {
    name: 'Lifetime',
    price: '$499',
    period: 'one-time',
    description: 'Full lifetime access',
    color: 'from-purple-500 to-pink-500',
    border: 'border-purple-500',
    features: [
      { text: 'Everything in Premium', included: true },
      { text: 'Lifetime updates', included: true },
      { text: 'VIP priority support', included: true },
      { text: 'Exclusive indicators', included: true },
      { text: 'API access', included: true },
      { text: 'Personal advisor', included: true },
    ],
    cta: 'Go Lifetime',
    popular: false,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Simple,{' '}
            <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Choose the plan that fits your trading journey
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative p-6 lg:p-8 rounded-2xl border-2 bg-white dark:bg-dark-card ${plan.border} ${plan.popular ? 'shadow-xl shadow-primary/10 scale-105 md:scale-110' : 'shadow-lg'}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-xs font-semibold mb-4`}>
                  {plan.name}
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block text-center py-3 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg shadow-primary/25'
                    : 'border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-200 hover:border-primary dark:hover:border-primary'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
