import { Pool, PoolClient } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL || 
      `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'kernel_studio'}`
    
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  return pool.query(text, params)
}

export async function getClient(): Promise<PoolClient> {
  const pool = getPool()
  return pool.connect()
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
