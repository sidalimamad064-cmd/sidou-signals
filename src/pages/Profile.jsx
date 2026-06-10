import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Shield, Save } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) setFullName(profile.full_name || '')
  }, [profile])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, updated_at: new Date().toISOString() })
      .eq('id', user.id)
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Profile updated successfully')
      await refreshProfile()
    }
    setLoading(false)
  }

  const roleColors = {
    admin: 'from-red-500 to-pink-500',
    premium: 'from-primary to-primary-dark',
    lifetime: 'from-purple-500 to-pink-500',
    free: 'from-gray-500 to-gray-600',
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary to-secondary p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center text-white text-3xl font-bold mb-4">
              {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold text-white">{profile?.full_name || 'User'}</h1>
            <p className="text-white/80">{user?.email}</p>
            <div className={`inline-block mt-3 px-4 py-1 rounded-full bg-gradient-to-r ${roleColors[profile?.role] || roleColors.free} text-white text-sm font-semibold`}>
              {profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1) || 'Free'}
            </div>
          </div>

          <div className="p-6 lg:p-8">
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <Mail className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-dark-bg">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {new Date(user?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Profile</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary dark:focus:border-primary transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
