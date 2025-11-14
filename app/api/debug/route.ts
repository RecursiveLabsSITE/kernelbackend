import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
    DATABASE_URL_UNPOOLED: process.env.DATABASE_URL_UNPOOLED ? 'SET' : 'NOT SET',
    POSTGRES_URL: process.env.POSTGRES_URL ? 'SET' : 'NOT SET',
    POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'NOT SET',
    PGHOST: process.env.PGHOST ? 'SET' : 'NOT SET',
    PGPORT: process.env.PGPORT ? 'SET' : 'NOT SET',
    PGDATABASE: process.env.PGDATABASE ? 'SET' : 'NOT SET',
    PGUSER: process.env.PGUSER ? 'SET' : 'NOT SET',
    PGPASSWORD: process.env.PGPASSWORD ? 'SET' : 'NOT SET',
  }

  return NextResponse.json({
    status: 'debug',
    timestamp: new Date().toISOString(),
    environment: envVars,
    nodeEnv: process.env.NODE_ENV,
  })
}
