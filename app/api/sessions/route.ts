import { NextResponse } from 'next/server'
import { listSessions } from '@/lib/store'

export async function GET() {
  return NextResponse.json(await listSessions())
}
