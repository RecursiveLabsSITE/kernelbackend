import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Try to connect to the database directly
    const { Pool } = require('pg')
    
    const connectionString = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL
    
    if (!connectionString) {
      return NextResponse.json({
        error: 'No database URL found',
        env: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          DATABASE_URL_UNPOOLED: !!process.env.DATABASE_URL_UNPOOLED,
        }
      }, { status: 500 })
    }
    
    const pool = new Pool({ connectionString })
    const result = await pool.query('SELECT NOW()')
    await pool.end()
    
    return NextResponse.json({
      status: 'ok',
      timestamp: result.rows[0].now,
      connectionString: connectionString.substring(0, 50) + '...'
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
