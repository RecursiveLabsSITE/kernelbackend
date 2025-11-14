import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432'),
  database: process.env.PGDATABASE || 'kernel_studio',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
})

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const result = await pool.query(
      'SELECT * FROM contradictions WHERE kernel_id = $1 ORDER BY created_at DESC',
      [id]
    )
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching contradictions:', error)
    return NextResponse.json({ error: 'Failed to fetch contradictions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { statement_a, statement_b, resolution } = body

    if (!statement_a || !statement_b) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const result = await pool.query(
      'INSERT INTO contradictions (kernel_id, statement_a, statement_b, resolution) VALUES ($1, $2, $3, $4) RETURNING *',
      [id, statement_a, statement_b, resolution || null]
    )
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating contradiction:', error)
    return NextResponse.json({ error: 'Failed to create contradiction' }, { status: 500 })
  }
}
