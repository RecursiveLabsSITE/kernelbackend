import { Pool, PoolClient } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    // For serverless environments, use the non-pooling connection
    // Priority: POSTGRES_URL_NON_POOLING (Supabase) > DATABASE_URL_UNPOOLED (Neon) > DATABASE_URL > individual PG* vars
    const connectionString = process.env.POSTGRES_URL_NON_POOLING || 
      process.env.DATABASE_URL_UNPOOLED || 
      process.env.DATABASE_URL || 
      process.env.POSTGRES_URL ||
      `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'kernel_studio'}`
    
    console.log('Database connection info:', {
      hasPostgresUrlNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
      hasUnpooled: !!process.env.DATABASE_URL_UNPOOLED,
      hasPooled: !!process.env.DATABASE_URL,
      hasPostgresUrl: !!process.env.POSTGRES_URL,
      hasPGUSER: !!process.env.PGUSER,
      hasPGPASSWORD: !!process.env.PGPASSWORD,
      hasPGHOST: !!process.env.PGHOST,
      hasPGPORT: !!process.env.PGPORT,
      hasPGDATABASE: !!process.env.PGDATABASE,
      connectionStringStart: connectionString.substring(0, 50) + '...'
    })
    
    pool = new Pool({
      connectionString,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err)
    })
  }
  return pool
}

export async function query(text: string, params?: any[]) {
  const pool = getPool()
  try {
    return await pool.query(text, params)
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
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
