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
    const result = await pool.query('SELECT * FROM kernels WHERE id = $1', [id])
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Kernel not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching kernel:', error)
    return NextResponse.json({ error: 'Failed to fetch kernel' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, status } = body

    const result = await pool.query(
      'UPDATE kernels SET name = $1, description = $2, status = $3, updated_at = NOW() WHERE id = $4 RETURNING *',
      [name, description, status, id]
    )
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Kernel not found' }, { status: 404 })
    }
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating kernel:', error)
    return NextResponse.json({ error: 'Failed to update kernel' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    await pool.query('DELETE FROM kernels WHERE id = $1', [id])
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting kernel:', error)
    return NextResponse.json({ error: 'Failed to delete kernel' }, { status: 500 })
  }
}
