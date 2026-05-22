import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { links } from '@/lib/schema'
import { eq, sql } from 'drizzle-orm'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db
    .update(links)
    .set({ clickCount: sql`${links.clickCount} + 1` })
    .where(eq(links.id, id))
  return NextResponse.json({ ok: true })
}
