import { motion } from 'framer-motion'
import { Zap, Shield, BarChart3, Bell, Globe, Smartphone } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Real-Time Signals',
    description: 'Get instant trading signals with high accuracy. Our algorithms analyze market data 24/7.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Risk Management',
    description: 'Built-in risk management tools with stop-loss and take-profit recommendations.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Comprehensive charts and analytics to make informed trading decisions.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Bell,
    title: 'Instant Alerts',
    description: 'Receive push notifications and email alerts for every signal.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: 'Multi-Market',
    description: 'Signals for Forex, Crypto, Stocks, and Commodities all in one place.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access signals anywhere with our fully responsive platform.',
    color: 'from-indigo-500 to-purple-500',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Features() {
  return (
    <section id="features" className="py-20 lg:py-28 bg-gray-50 dark:bg-dark-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose{' '}
            <span className="gradient-text">Sidou Signals</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            We provide everything you need to succeed in trading
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group p-6 lg:p-8 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} p-3 mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
