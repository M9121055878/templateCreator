import { NextResponse } from 'next/server';

import { bootstrapTemplatesFromFiles } from 'src/features/templates/editor/server/storage';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const result = await bootstrapTemplatesFromFiles();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message ?? 'Failed to bootstrap templates from files.' },
      { status: 400 }
    );
  }
}
