import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

import {
  getNextTemplateId,
  readTemplateDocument,
  listTemplateDocuments,
  writeTemplateDocument,
  createDefaultTemplateDocument,
} from 'src/features/templates/editor/server/storage';

export const runtime = 'nodejs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    let userContext = { isAdmin: false, companyId: null, groupId: null };
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const decoded = verify(token, JWT_SECRET);
        userContext = {
          isAdmin: decoded.role === 'super_admin',
          companyId: decoded.companyId || null,
          groupId: decoded.groupId || null,
        };
      } catch (error) {
        // Invalid token, proceed without context
      }
    }

    const documents = await listTemplateDocuments(userContext);

    return NextResponse.json({
      templates: documents.map((document) => ({
        id: document.id,
        title: document.meta.title,
        category: document.meta.category,
        status: document.status,
        size: document.meta.size,
        visibility_type: document.visibility_type,
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
