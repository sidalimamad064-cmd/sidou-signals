import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables:')
  console.error('  VITE_SUPABASE_URL=' + process.env.VITE_SUPABASE_URL)
  console.error('  SUPABASE_SERVICE_KEY=' + (process.env.SUPABASE_SERVICE_KEY ? '***' : 'missing'))
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
  console.log('Running database setup...')

  const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '00001_initial_schema.sql')
  const sql = readFileSync(sqlPath, 'utf8')

  // Split SQL into individual statements
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  for (const stmt of statements) {
    try {
      const { error } = await supabase.rpc('exec_sql', { query: stmt + ';' })
      if (error) {
        console.error('Error executing:', stmt.slice(0, 80) + '...')
        console.error('  ->', error.message)
      } else {
        console.log('OK:', stmt.slice(0, 60) + '...')
      }
    } catch (e) {
      console.error('Exception:', e.message)
    }
  }

  console.log('Database setup complete!')
}

main()
