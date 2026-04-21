import { NextResponse } from 'next/server';

import { exportTemplateDocuments } from 'src/features/templates/editor/server/storage';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const templateId = url.searchParams.get('templateId');

    const payload = await exportTemplateDocuments(templateId);

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Failed to export templates.' }, { status: 400 });
  }
}
