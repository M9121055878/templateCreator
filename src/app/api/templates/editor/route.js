import { NextResponse } from 'next/server';

import {
  getNextTemplateId,
  readTemplateDocument,
  listTemplateDocuments,
  writeTemplateDocument,
  createDefaultTemplateDocument,
} from 'src/features/templates/editor/server/storage';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const documents = await listTemplateDocuments();

    return NextResponse.json({
      templates: documents.map((document) => ({
        id: document.id,
        title: document.meta.title,
        category: document.meta.category,
        status: document.status,
        size: document.meta.size,
      })),
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Failed to load templates.' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      payload = {};
    }
    const templateId = payload?.templateId || (await getNextTemplateId());

    const duplicateFrom = payload?.duplicateFrom;

    if (duplicateFrom) {
      const source = await readTemplateDocument(duplicateFrom);
      const created = await writeTemplateDocument({
        ...source,
        id: templateId,
        meta: {
          ...source.meta,
          title: `${source.meta.title} (کپی)`,
        },
      });

      return NextResponse.json({ document: created }, { status: 201 });
    }

    const created = await writeTemplateDocument(createDefaultTemplateDocument(templateId));

    return NextResponse.json({ document: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Failed to create template.' }, { status: 400 });
  }
}
