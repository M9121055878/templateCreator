import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: true,
    message: 'Export route is reserved for server-side export phase.',
  });
}
