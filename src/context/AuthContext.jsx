import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [supabaseError, setSupabaseError] = useState(null)

  useEffect(() => {
    let mounted = true
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) await fetchProfile(session.user.id)
          setLoading(false)
        }
      } catch (err) {
        console.error('Supabase getSession error:', err)
        if (mounted) {
          setSupabaseError(err.message)
          setLoading(false)
        }
      }
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        if (mounted) {
          setUser(session?.user ?? null)
          if (session?.user) {
            await fetchProfile(session.user.id)
          } else {
            setProfile(null)
          }
        }
      } catch (err) {
        console.error('Supabase auth state change error:', err)
        if (mounted) setSupabaseError(err.message)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) throw error
      setProfile(data)
    } catch (err) {
      console.error('Fetch profile error:', err)
      setSupabaseError(err.message)
    }
  }

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id)
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
    } catch (err) {
      console.error('Sign out error:', err)
      setSupabaseError(err.message)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, supabaseError }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
