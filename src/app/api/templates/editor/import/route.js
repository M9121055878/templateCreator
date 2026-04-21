import { NextResponse } from 'next/server';

import { importTemplateDocuments } from 'src/features/templates/editor/server/storage';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    const payload = await request.json();
    const result = await importTemplateDocuments(payload ?? {});

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Failed to import templates.' }, { status: 400 });
  }
}
