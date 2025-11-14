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
    const result = await pool.query('SELECT * FROM kernels ORDER BY created_at DESC LIMIT 50')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching kernels:', error)
    return NextResponse.json({ error: 'Failed to fetch kernels' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { team_id, name, description, status } = body

    if (!team_id || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await pool.query(
      'INSERT INTO kernels (team_id, name, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [team_id, name, description || null, status || 'idle']
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating kernel:', error)
    return NextResponse.json({ error: 'Failed to create kernel' }, { status: 500 })
  }
}
