import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, TrendingUp, TrendingDown, Activity, Calendar, DollarSign, Percent, Trash2, BarChart3, Filter } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

function isToday(d) {
  const now = new Date()
  const date = new Date(d)
  return date.toDateString() === now.toDateString()
}

function isThisWeek(d) {
  const now = new Date()
  const date = new Date(d)
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0,0,0,0)
  return date >= startOfWeek
}

function isThisMonth(d) {
  const now = new Date()
  const date = new Date(d)
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

function calcResult(type, entry, exit) {
  if (!exit) return 'pending'
  if (type === 'buy') return exit > entry ? 'win' : 'loss'
  return exit < entry ? 'win' : 'loss'
}

function calcProfitLoss(type, entry, exit) {
  if (!exit || !entry) return 0
  const diff = exit - entry
  const pct = (diff / entry) * 100
  return type === 'buy' ? pct : -pct
}

export default function Trades() {
  const { user } = useAuth()
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [period, setPeriod] = useState('all')
  const [form, setForm] = useState({
    pair: '', type: 'buy', entry_price: '', exit_price: '', quantity: '1', notes: '',
  })

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    const { data } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', user.id)
      .order('trade_date', { ascending: false })
    if (data) setTrades(data)
    setLoading(false)
  }

  const addTrade = async (e) => {
    e.preventDefault()
    const entry = parseFloat(form.entry_price)
    const exit = form.exit_price ? parseFloat(form.exit_price) : null
    const result = calcResult(form.type, entry, exit)
    const profitLoss = exit ? calcProfitLoss(form.type, entry, exit) : 0
    const { error } = await supabase.from('trades').insert([{
      user_id: user.id,
      pair: form.pair.toUpperCase(),
      type: form.type,
      entry_price: entry,
      exit_price: exit,
      quantity: parseFloat(form.quantity) || 1,
      result,
      profit_loss: Math.round(profitLoss * 100) / 100,
      notes: form.notes,
      trade_date: new Date().toISOString(),
    }])
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Trade added')
      setForm({ pair: '', type: 'buy', entry_price: '', exit_price: '', quantity: '1', notes: '' })
      setShowForm(false)
      fetchTrades()
    }
  }

  const deleteTrade = async (id) => {
    await supabase.from('trades').delete().eq('id', id)
    setTrades(trades.filter(t => t.id !== id))
    toast.success('Trade deleted')
  }

  const cleanupOldTrades = async () => {
    if (!confirm('This will delete all trades from previous months (December is kept). Continue?')) return
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('user_id', user.id)
      .lt('trade_date', startOfMonth)
    if (!error) {
      toast.success('Old trades cleaned up')
      fetchTrades()
    }
  }

  const filteredTrades = useMemo(() => {
    return trades.filter(t => {
      if (period === 'day') return isToday(t.trade_date)
      if (period === 'week') return isThisWeek(t.trade_date)
      if (period === 'month') return isThisMonth(t.trade_date)
      return true
    })
  }, [trades, period])

  const stats = useMemo(() => {
    const closed = filteredTrades.filter(t => t.result !== 'pending')
    const wins = closed.filter(t => t.result === 'win').length
    const losses = closed.filter(t => t.result === 'loss').length
    const totalPl = filteredTrades.reduce((sum, t) => sum + parseFloat(t.profit_loss || 0), 0)
    const winRate = closed.length > 0 ? (wins / closed.length) * 100 : 0
    const best = filteredTrades.reduce((best, t) => parseFloat(t.profit_loss || 0) > parseFloat(best?.profit_loss || 0) ? t : best, null)
    return {
      total: filteredTrades.length,
      closed: closed.length,
      wins,
      losses,
      winRate: Math.round(winRate * 10) / 10,
      totalPl: Math.round(totalPl * 100) / 100,
      best,
    }
  }, [filteredTrades])

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">My Trades</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your personal trading performance</p>
          </div>
          <div className="flex gap-2">
            <button onClick={cleanupOldTrades} className="px-4 py-2 rounded-xl border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 text-sm font-medium hover:border-red-400 transition-colors">
              Cleanup Old
            </button>
            <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Trade
            </button>
          </div>
        </div>

        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">New Trade</h2>
            <form onSubmit={addTrade} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input type="text" placeholder="Pair (e.g. BTC/USD)" value={form.pair} onChange={e => setForm({...form, pair: e.target.value})} required
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary">
                <option value="buy">BUY</option>
                <option value="sell">SELL</option>
              </select>
              <input type="number" step="any" placeholder="Entry Price" value={form.entry_price} onChange={e => setForm({...form, entry_price: e.target.value})} required
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <input type="number" step="any" placeholder="Exit Price (leave empty if open)" value={form.exit_price} onChange={e => setForm({...form, exit_price: e.target.value})}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <input type="number" step="any" placeholder="Quantity" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}
                className="px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border text-gray-900 dark:text-white text-sm focus:outline-none focus:border-primary" />
              <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
                Save Trade
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-dark-border text-gray-600 dark:text-gray-300 text-sm hover:border-red-400 transition-colors">
                Cancel
              </button>
            </form>
          </motion.div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Activity, label: 'Total Trades', value: stats.total, color: 'from-blue-500 to-cyan-500' },
            { icon: Percent, label: 'Win Rate', value: `${stats.winRate}%`, color: 'from-green-500 to-emerald-500' },
            { icon: TrendingUp, label: 'Wins', value: stats.wins, sub: `Losses: ${stats.losses}`, color: 'from-primary to-primary-dark' },
            { icon: DollarSign, label: 'Total P&L', value: `${stats.totalPl > 0 ? '+' : ''}${stats.totalPl}%`, color: stats.totalPl >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500' },
          ].map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-border p-4">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} p-2 mb-3`}>
                <card.icon className="w-full h-full text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.label}</p>
              {card.sub && <p className="text-xs text-gray-400">{card.sub}</p>}
            </motion.div>
          ))}
        </div>

        {stats.best && stats.best.profit_loss > 0 && (
          <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 text-center">
            <span className="text-sm text-yellow-700 dark:text-yellow-400 font-medium">
              Best Trade: {stats.best.pair} ({stats.best.type}) +{stats.best.profit_loss}%
            </span>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          {[
            { key: 'all', label: 'All Time' },
            { key: 'day', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
          ].map(p => (
            <button key={p.key} onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                period === p.key ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-border'
              }`}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-200 dark:border-dark-border overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTrades.length === 0 ? (
            <div className="text-center py-16">
              <BarChart3 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Trades Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Start by adding your first trade.</p>
              <button onClick={() => setShowForm(true)} className="px-6 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-opacity">
                Add Your First Trade
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Pair</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Type</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Entry</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Exit</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Result</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">P&L</th>
                    <th className="text-left p-3 text-sm font-semibold text-gray-600 dark:text-gray-300"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTrades.map((t, i) => (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="border-b border-gray-100 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-bg transition-colors">
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{new Date(t.trade_date).toLocaleDateString()}</td>
                      <td className="p-3 font-semibold text-gray-900 dark:text-white">{t.pair}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.type === 'buy' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30'}`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{t.entry_price}</td>
                      <td className="p-3 text-sm text-gray-600 dark:text-gray-400">{t.exit_price || '-'}</td>
                      <td className="p-3">
                        {t.result === 'pending' ? (
                          <span className="text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded text-xs font-semibold">Pending</span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold ${t.result === 'win' ? 'text-green-600 bg-green-100 dark:bg-green-900/30' : 'text-red-600 bg-red-100 dark:bg-red-900/30'}`}>
                            {t.result === 'win' ? 'WIN' : 'LOSS'}
                          </span>
                        )}
                      </td>
                      <td className={`p-3 text-sm font-semibold ${parseFloat(t.profit_loss) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {parseFloat(t.profit_loss) >= 0 ? '+' : ''}{t.profit_loss}%
                      </td>
                      <td className="p-3">
                        <button onClick={() => deleteTrade(t.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
