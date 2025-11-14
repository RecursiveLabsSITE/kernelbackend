import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasPostgresUrlNonPooling: !!process.env.POSTGRES_URL_NON_POOLING,
    hasUnpooled: !!process.env.DATABASE_URL_UNPOOLED,
    hasPooled: !!process.env.DATABASE_URL,
    hasPostgresUrl: !!process.env.POSTGRES_URL,
    hasPGUSER: !!process.env.PGUSER,
    hasPGPASSWORD: !!process.env.PGPASSWORD,
    hasPGHOST: !!process.env.PGHOST,
    hasPGPORT: !!process.env.PGPORT,
    hasPGDATABASE: !!process.env.PGDATABASE,
    postgresUrlNonPoolingStart: process.env.POSTGRES_URL_NON_POOLING?.substring(0, 30) + '...',
    databaseUrlStart: process.env.DATABASE_URL?.substring(0, 30) + '...',
    pghost: process.env.PGHOST,
    pgport: process.env.PGPORT,
    pgdatabase: process.env.PGDATABASE,
  })
}
