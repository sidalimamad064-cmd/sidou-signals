import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Clock, Activity, Zap, BarChart3, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const roleColors = {
  admin: 'from-red-500 to-pink-500',
  premium: 'from-primary to-primary-dark',
  lifetime: 'from-purple-500 to-pink-500',
  free: 'from-gray-500 to-gray-600',
}

function isThisMonth(d) {
  const now = new Date()
  const date = new Date(d)
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

export default function Dashboard() {
  const { profile, user } = useAuth()
  const [signals, setSignals] = useState([])
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const [signalsRes, tradesRes] = await Promise.all([
        supabase.from('signals').select('*').order('created_at', { ascending: false }).limit(10),
        supabase.from('trades').select('*').eq('user_id', user.id).order('trade_date', { ascending: false }),
      ])
      if (signalsRes.data) setSignals(signalsRes.data)
      if (tradesRes.data) setTrades(tradesRes.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  const stats = useMemo(() => {
    const monthTrades = trades.filter(t => isThisMonth(t.trade_date))
    const closed = monthTrades.filter(t => t.result !== 'pending')
    const wins = closed.filter(t => t.result === 'win').length
    const losses = closed.filter(t => t.result === 'loss').length
    const winRate = closed.length > 0 ? (wins / closed.length) * 100 : 0
    const totalPl = monthTrades.reduce((sum, t) => sum + parseFloat(t.profit_loss || 0), 0)
    return {
      total: monthTrades.length,
      closed: closed.length,
      wins, losses,
      winRate: Math.round(winRate * 10) / 10,
      totalPl: Math.round(totalPl * 100) / 100,
    }
  }, [trades])

  const planLabel = profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6 lg:p-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome, {profile?.full_name || 'Trader'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Here are your latest trading signals</p>
              </div>
              <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${roleColors[profile?.role] || roleColors.free} text-white text-sm font-semibold`}>
                {planLabel}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : signals.length === 0 ? (
              <div className="text-center py-16">
                <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Signals Yet</h3>
                <p className="text-gray-500 dark:text-gray-400">Signals will appear here once they are published.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {signals.map((signal, i) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${signal.type === 'buy' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {signal.type === 'buy' ? (
                          <TrendingUp className={`w-5 h-5 ${signal.type === 'buy' ? 'text-green-600' : 'text-red-600'}`} />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{signal.pair}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{signal.type?.toUpperCase()} • {signal.entry}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{signal.target}</p>
                      <p className="text-sm text-green-600">{signal.profit}%</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Monthly Stats</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Win Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.winRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Trades</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wins / Losses</p>
                  <p className="text-xl font-bold">
                    <span className="text-green-600">{stats.wins}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-red-600">{stats.losses}</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">P&L</p>
                  <p className={`text-2xl font-bold ${stats.totalPl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stats.totalPl >= 0 ? '+' : ''}{stats.totalPl}%
                  </p>
                </div>
              </div>
            </div>

            {profile?.role !== 'free' && (
              <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  <Link to="/trades" className="flex items-center justify-between w-full py-2 px-4 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                    My Trades <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/profile" className="flex items-center justify-between w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-dark-border text-gray-700 dark:text-gray-200 text-sm font-medium hover:border-primary transition-colors">
                    Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
