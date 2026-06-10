import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://twuimpscnrhyurlrzyvo.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dWltcHNjbnJoeXVybHJ6eXZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTE1NDYsImV4cCI6MjA5NjY2NzU0Nn0.kmW5c2exmS_Q5Gv0AT4BjcOu9wrvTg-_sjCxCFagefk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
