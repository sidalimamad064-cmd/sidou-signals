/**
 * Database Setup Script
 * 
 * Usage:
 *   node scripts/setup-db-direct.js "postgresql://postgres:PASSWORD@db.twuimpscnrhyurlrzyvo.supabase.co:5432/postgres"
 * 
 * Or via environment variable:
 *   DATABASE_URL="..." node scripts/setup-db-direct.js
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const connectionString = process.argv[2] || process.env.DATABASE_URL

  if (!connectionString) {
    console.error('Usage: node scripts/setup-db-direct.js "postgresql://postgres:PASSWORD@db.twuimpscnrhyurlrzyvo.supabase.co:5432/postgres"')
    console.error('Or set DATABASE_URL environment variable')
    process.exit(1)
  }

  console.log('Connecting to database...')
  
  const { default: pg } = await import('pg')
  const pool = new pg.Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  })

  const sqlPath = join(__dirname, '..', 'supabase', 'migrations', '00001_initial_schema.sql')
  const sql = readFileSync(sqlPath, 'utf8')

  const client = await pool.connect()
  
  try {
    await client.query(sql)
    console.log('Migration completed successfully!')
  } catch (err) {
    console.error('Migration failed:', err.message)
    process.exit(1)
  } finally {
    client.release()
    await pool.end()
  }
}

main()
