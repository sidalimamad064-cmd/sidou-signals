import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    })
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
      toast.success('Check your email for the reset link')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reset Password</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {sent ? 'Check your email for instructions' : "Enter your email and we'll send you a reset link"}
            </p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-primary mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">Password reset email sent to <strong>{email}</strong></p>
              <Link to="/login" className="inline-block text-primary font-semibold hover:underline">
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
