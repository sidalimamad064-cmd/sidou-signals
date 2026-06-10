import { Link } from 'react-router-dom'
import { BarChart3, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark-card border-t border-gray-200 dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl gradient-text">Sidou Signals</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Professional trading signals platform powered by advanced algorithms and expert analysis.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors">Home</Link></li>
              <li><Link to="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors">Login</Link></li>
              <li><Link to="/register" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-sm transition-colors">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400 text-sm">Real-time Signals</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Market Analysis</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Risk Management</li>
              <li className="text-gray-600 dark:text-gray-400 text-sm">Premium Alerts</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-primary" /> support@sidousignals.com
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-primary" /> +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-primary" /> Dubai, UAE
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 dark:text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Sidou Signals. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 dark:text-gray-500 text-sm">Trading involves risk. Trade responsibly.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
