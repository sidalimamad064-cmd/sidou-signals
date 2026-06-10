import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { Users, BarChart3, Signal, Shield, Settings, LogOut, TrendingUp, DollarSign, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../context/AuthContext'

const sidebarItems = [
  { path: '/admin', icon: BarChart3, label: 'Overview', end: true },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/signals', icon: Signal, label: 'Signals' },
]

function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, signals: 0, premium: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: signals } = await supabase.from('signals').select('*', { count: 'exact', head: true })
      const { count: premium } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['premium', 'lifetime'])
      setStats({ users: users || 0, signals: signals || 0, premium: premium || 0 })
      setLoading(false)
    }
    fetchStats()
  }, [])

  const cards = [
    { icon: Users, label: 'Total Users', value: stats.users, color: 'from-blue-500 to-cyan-500' },
    { icon: Signal, label: 'Total Signals', value: stats.signals, color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, label: 'Premium Users', value: stats.premium, color: 'from-primary to-primary-dark' },
    { icon: DollarSign, label: 'Revenue', value: '$12,450', color: 'from-yellow-500 to-orange-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Overview</h1>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} p-3 mb-4`}>
                <card.icon className="w-full h-full text-white" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
      if (data) setUsers(data)
      setLoading(false)
    }
    fetchUsers()
  }, [])

  const updateRole = async (userId, newRole) => {
    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Users</h1>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Email</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Role</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Joined</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                    <td className="p-4 text-gray-900 dark:text-white font-medium">{u.full_name || 'N/A'}</td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${
                        u.role === 'admin' ? 'from-red-500 to-pink-500' :
                        u.role === 'premium' ? 'from-primary to-primary-dark' :
                        u.role === 'lifetime' ? 'from-purple-500 to-pink-500' :
                        'from-gray-500 to-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600 dark:text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateRole(u.id, e.target.value)}
                        className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                      >
                        <option value="free">Free</option>
                        <option value="premium">Premium</option>
                        <option value="lifetime">Lifetime</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminSignals() {
  const [signals, setSignals] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ pair: '', type: 'buy', entry: '', target: '', profit: '', status: 'active' })

  useEffect(() => {
    fetchSignals()
  }, [])

  const fetchSignals = async () => {
    const { data } = await supabase.from('signals').select('*').order('created_at', { ascending: false }).limit(50)
    if (data) setSignals(data)
    setLoading(false)
  }

  const addSignal = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('signals').insert([{
      pair: form.pair.toUpperCase(),
      type: form.type,
      entry: form.entry,
      target: form.target,
      profit: parseFloat(form.profit),
      status: form.status,
    }])
    if (!error) {
      setForm({ pair: '', type: 'buy', entry: '', target: '', profit: '', status: 'active' })
      fetchSignals()
    }
  }

  const deleteSignal = async (id) => {
    await supabase.from('signals').delete().eq('id', id)
    setSignals(signals.filter(s => s.id !== id))
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Signals</h1>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border overflow-hidden">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : signals.length === 0 ? (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">No signals yet</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Pair</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Entry</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Target</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Profit</th>
                      <th className="text-left p-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {signals.map((s) => (
                      <tr key={s.id} className="border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                        <td className="p-4 font-semibold text-gray-900 dark:text-white">{s.pair}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${s.type === 'buy' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30'}`}>
                            {s.type?.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{s.entry}</td>
                        <td className="p-4 text-gray-600 dark:text-gray-400">{s.target}</td>
                        <td className="p-4 text-green-600 font-semibold">{s.profit}%</td>
                        <td className="p-4">
                          <button onClick={() => deleteSignal(s.id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Add Signal</h2>
            <form onSubmit={addSignal} className="space-y-3">
              <input type="text" placeholder="Pair (e.g. BTC/USD)" value={form.pair} onChange={(e) => setForm({ ...form, pair: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary">
                <option value="buy">BUY</option>
                <option value="sell">SELL</option>
              </select>
              <input type="text" placeholder="Entry Price" value={form.entry} onChange={(e) => setForm({ ...form, entry: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Target Price" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <input type="number" step="0.1" placeholder="Profit %" value={form.profit} onChange={(e) => setForm({ ...form, profit: e.target.value })} required
                className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <button type="submit" className="w-full py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                Add Signal
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const location = useLocation()
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <aside className="hidden lg:flex flex-col w-64 flex-shrink-0">
            <div className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4 space-y-1">
              <div className="flex items-center gap-2 px-3 py-3 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="font-bold text-gray-900 dark:text-white">Admin Panel</span>
              </div>
              {sidebarItems.map((item) => {
                const active = item.end ? location.pathname === item.path : location.pathname.startsWith(item.path)
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? 'bg-gradient-to-r from-primary/10 to-secondary/10 text-primary dark:text-primary'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
              <hr className="border-gray-200 dark:border-dark-border my-2" />
              <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-border transition-colors">
                <Activity className="w-5 h-5" /> Dashboard
              </Link>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="signals" element={<AdminSignals />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}
