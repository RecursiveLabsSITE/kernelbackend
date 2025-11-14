import { Pool, PoolClient } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    // For serverless environments, use the unpooled connection
    const connectionString = process.env.DATABASE_URL_UNPOOLED || 
      process.env.DATABASE_URL || 
      `postgresql://${process.env.PGUSER || 'postgres'}:${process.env.PGPASSWORD || 'postgres'}@${process.env.PGHOST || 'localhost'}:${process.env.PGPORT || 5432}/${process.env.PGDATABASE || 'kernel_studio'}`
    
    console.log('Database connection info:', {
      hasUnpooled: !!process.env.DATABASE_URL_UNPOOLED,
      hasPooled: !!process.env.DATABASE_URL,
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
