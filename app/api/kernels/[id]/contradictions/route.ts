import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'kernel_studio',
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'postgres',
})

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await pool.query('SELECT * FROM contradictions WHERE kernel_id = $1 ORDER BY created_at DESC', [id])
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch contradictions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { pole_a, pole_b, scar_valence, life_phase, refusal_flag } = body

    const result = await pool.query(
      'INSERT INTO contradictions (kernel_id, pole_a, pole_b, scar_valence, life_phase, refusal_flag) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, pole_a, pole_b, scar_valence, life_phase, refusal_flag || false]
    )

    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create contradiction' }, { status: 500 })
  }
}
