import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/kernels - Starting request')
    console.log('Environment:', {
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ? 'SET' : 'NOT SET',
      PGHOST: process.env.PGHOST,
      PGPORT: process.env.PGPORT,
      PGDATABASE: process.env.PGDATABASE,
    })
    
    const result = await query('SELECT * FROM kernels ORDER BY created_at DESC LIMIT 50')
    console.log('Query successful, returning', result.rows.length, 'rows')
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching kernels:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      error: 'Failed to fetch kernels',
      details: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/kernels - Starting request')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { team_id, name, description, status } = body

    if (!team_id || !name) {
      console.error('Missing required fields:', { team_id, name })
      return NextResponse.json({ error: 'Missing required fields: team_id and name' }, { status: 400 })
    }

    console.log('Creating kernel with:', { team_id, name, description, status })
    
    const result = await query(
      'INSERT INTO kernels (team_id, name, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [team_id, name, description || null, status || 'idle']
    )
    
    console.log('Kernel created successfully:', result.rows[0])
    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error creating kernel:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ 
      error: 'Failed to create kernel',
      details: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
