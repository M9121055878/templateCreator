import { NextResponse } from 'next/server';

import {
  readTemplateDocument,
  writeTemplateDocument,
  deleteTemplateDocument,
} from 'src/features/templates/editor/server/storage';

export const runtime = 'nodejs';

export async function GET(_request, { params }) {
  try {
    const { templateId } = params;
    const document = await readTemplateDocument(templateId);

    return NextResponse.json({ document });
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Template not found.' }, { status: 404 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { templateId } = params;
    const payload = await request.json();
    const document = payload?.document;

    if (!document) {
      return NextResponse.json({ error: 'document is required.' }, { status: 400 });
    }

    if (document.id !== templateId) {
      return NextResponse.json({ error: 'Template id mismatch.' }, { status: 400 });
    }

    const saved = await writeTemplateDocument(document);

    return NextResponse.json({ document: saved });
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Failed to save template.' }, { status: 400 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { templateId } = params;
    await deleteTemplateDocument(templateId);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Failed to delete template.' }, { status: 400 });
  }
}
