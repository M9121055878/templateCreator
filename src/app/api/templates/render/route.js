import { NextResponse } from 'next/server';

import { getTemplateById, resolveTemplateRuntime } from 'src/features/templates';

export async function POST(request) {
  try {
    const { templateId, values } = await request.json();
    const template = getTemplateById(templateId, { includeLegacy: true });

    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    const runtime = resolveTemplateRuntime(template.document, values ?? {});

    return NextResponse.json({
      templateId: template.id,
      engine: template.engine,
      validatedInputs: runtime.inputs,
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message ?? 'Invalid request' }, { status: 400 });
  }
}
