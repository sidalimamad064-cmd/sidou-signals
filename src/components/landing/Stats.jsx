import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react'

const stats = [
  { icon: TrendingUp, value: '95%', label: 'Signal Accuracy', color: 'from-green-500 to-emerald-500' },
  { icon: Users, value: '10K+', label: 'Active Users', color: 'from-blue-500 to-cyan-500' },
  { icon: DollarSign, value: '$2M+', label: 'Profits Generated', color: 'from-yellow-500 to-orange-500' },
  { icon: Award, value: '4.9/5', label: 'User Rating', color: 'from-purple-500 to-pink-500' },
]

export default function Stats() {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 dark:from-primary/5 dark:via-secondary/5 dark:to-primary/5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 lg:p-8"
            >
              <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.color} p-4 mb-4`}>
                <stat.icon className="w-full h-full text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
