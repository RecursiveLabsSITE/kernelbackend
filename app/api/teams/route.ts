import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'kernel_studio',
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
})

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query('SELECT * FROM teams LIMIT 10')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }
}
