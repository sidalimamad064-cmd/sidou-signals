import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, ArrowRight, Shield, BarChart3 } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 dark:bg-primary/10 rounded-full blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 dark:bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium border border-primary/20">
              <TrendingUp className="w-4 h-4" />
              Real-Time Trading Signals
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Trade Smarter with{' '}
              <span className="gradient-text">Sidou Signals</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Professional-grade trading signals powered by advanced algorithms and expert market analysis. Maximize your profits with accurate, real-time signals.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Start Trading <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-200 rounded-xl font-semibold text-lg hover:border-primary dark:hover:border-primary transition-colors"
              >
                View Signals <BarChart3 className="w-5 h-5" />
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-primary" /> Secure
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-primary" /> 95% Accuracy
              </div>
              <div className="flex items-center gap-1">
                <BarChart3 className="w-4 h-4 text-primary" /> 10K+ Users
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-3xl rotate-6 opacity-20 blur-2xl" />
              <div className="relative w-full h-full bg-white dark:bg-dark-card rounded-3xl border border-gray-200 dark:border-dark-border p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Live Dashboard</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-900/50">
                    <div>
                      <p className="text-sm text-gray-500">BTC/USD</p>
                      <p className="text-lg font-bold text-green-600">BUY</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">$67,432</p>
                      <p className="text-sm text-green-600">+2.4%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-900/50">
                    <div>
                      <p className="text-sm text-gray-500">ETH/USD</p>
                      <p className="text-lg font-bold text-blue-600">BUY</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">$3,456</p>
                      <p className="text-sm text-blue-600">+1.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-900/50">
                    <div>
                      <p className="text-sm text-gray-500">SOL/USD</p>
                      <p className="text-lg font-bold text-red-600">SELL</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">$142</p>
                      <p className="text-sm text-red-600">-0.8%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
