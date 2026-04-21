import path from 'path';
import { promises as fs } from 'fs';

import { getEditorDb } from './db';
import { parseTemplateDocument } from '../../schema/template.schema';

const TEMPLATE_ID_REGEX = /^tpl-\d+$/;

function nowIso() {
  return new Date().toISOString();
}

function parseTemplateIdNumber(templateId) {
  return Number.parseInt(templateId.replace('tpl-', ''), 10);
}

function templatesRootDir() {
  return path.join(process.cwd(), 'src/features/templates/templates/v1');
}

function templateDirPath(templateId) {
  return path.join(templatesRootDir(), templateId);
}

function rowToDocument(row) {
  if (!row) return null;

  return parseTemplateDocument({
    id: row.id,
    version: row.version,
    status: row.status,
    engine: row.engine,
    meta: JSON.parse(row.meta_json),
    inputs: JSON.parse(row.inputs_json),
    layout: JSON.parse(row.layout_json),
    assets: JSON.parse(row.assets_json),
  });
}

function documentToRow(document) {
  return {
    id: document.id,
    version: document.version,
    status: document.status,
    engine: document.engine,
    meta_json: JSON.stringify(document.meta ?? {}),
    inputs_json: JSON.stringify(document.inputs ?? []),
    layout_json: JSON.stringify(document.layout ?? {}),
    assets_json: JSON.stringify(document.assets ?? {}),
  };
}

export function assertTemplateId(templateId) {
  if (!TEMPLATE_ID_REGEX.test(templateId)) {
    throw new Error('Invalid template id. Expected format tpl-<number>.');
  }
}

export async function listTemplateIds() {
  const db = getEditorDb();
  const rows = db.prepare('SELECT id FROM templates').all();

  return rows
    .map((row) => row.id)
    .filter((templateId) => TEMPLATE_ID_REGEX.test(templateId))
    .sort((a, b) => parseTemplateIdNumber(a) - parseTemplateIdNumber(b));
}

export async function getNextTemplateId() {
  const templateIds = await listTemplateIds();
  const nextNumber = templateIds.length
    ? Math.max(...templateIds.map(parseTemplateIdNumber)) + 1
    : 100;

  return `tpl-${nextNumber}`;
}

export async function readTemplateDocument(templateId) {
  assertTemplateId(templateId);

  const db = getEditorDb();
  const row = db.prepare('SELECT * FROM templates WHERE id = ?').get(templateId);

  if (!row) {
    throw new Error('Template not found.');
  }

  return rowToDocument(row);
}

export async function listTemplateDocuments() {
  const db = getEditorDb();
  const rows = db.prepare('SELECT * FROM templates ORDER BY id ASC').all();

  return rows
    .map((row) => rowToDocument(row))
    .sort((a, b) => parseTemplateIdNumber(a.id) - parseTemplateIdNumber(b.id));
}

export async function writeTemplateDocument(document) {
  const parsed = parseTemplateDocument(document);
  const row = documentToRow(parsed);
  const db = getEditorDb();
  const timestamp = nowIso();

  const transaction = db.transaction((payload) => {
    db.prepare(
      `
      INSERT INTO templates (
        id, version, status, engine,
        meta_json, inputs_json, layout_json, assets_json,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        version = excluded.version,
        status = excluded.status,
        engine = excluded.engine,
        meta_json = excluded.meta_json,
        inputs_json = excluded.inputs_json,
        layout_json = excluded.layout_json,
        assets_json = excluded.assets_json,
        updated_at = excluded.updated_at
      `
    ).run(
      payload.id,
      payload.version,
      payload.status,
      payload.engine,
      payload.meta_json,
      payload.inputs_json,
      payload.layout_json,
      payload.assets_json,
      timestamp,
      timestamp
    );
  });

  transaction(row);

  return parsed;
}

export async function deleteTemplateDocument(templateId) {
  assertTemplateId(templateId);

  const db = getEditorDb();
  const result = db.prepare('DELETE FROM templates WHERE id = ?').run(templateId);

  if (!result.changes) {
    throw new Error('Template not found.');
  }
}

async function readTemplateFromFiles(templateId) {
  const templateDir = templateDirPath(templateId);
  const [metaRaw, schemaRaw, layoutRaw, assetsRaw] = await Promise.all([
    fs.readFile(path.join(templateDir, 'meta.json'), 'utf-8'),
    fs.readFile(path.join(templateDir, 'schema.json'), 'utf-8'),
    fs.readFile(path.join(templateDir, 'layout.json'), 'utf-8'),
    fs.readFile(path.join(templateDir, 'assets.json'), 'utf-8'),
  ]);

  const meta = JSON.parse(metaRaw);
  const schema = JSON.parse(schemaRaw);
  const layout = JSON.parse(layoutRaw);
  const assets = JSON.parse(assetsRaw);

  return parseTemplateDocument({
    ...meta,
    inputs: schema.inputs,
    layout,
    assets,
  });
}

export async function bootstrapTemplatesFromFiles() {
  const root = templatesRootDir();
  const entries = await fs.readdir(root, { withFileTypes: true });
  const templateIds = entries
    .filter((entry) => entry.isDirectory() && TEMPLATE_ID_REGEX.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => parseTemplateIdNumber(a) - parseTemplateIdNumber(b));

  let imported = 0;
  let skipped = 0;
  const errors = [];

  for (const templateId of templateIds) {
    try {
      const existing = await readTemplateDocument(templateId).catch(() => null);
      if (existing) {
        skipped += 1;
        continue;
      }

      const document = await readTemplateFromFiles(templateId);
      await writeTemplateDocument(document);
      imported += 1;
    } catch (error) {
      errors.push({ templateId, message: error?.message ?? 'Unknown error' });
    }
  }

  return { imported, skipped, errors };
}

export async function importTemplateDocuments(payload = {}) {
  const rawDocuments = Array.isArray(payload.documents)
    ? payload.documents
    : payload.document
      ? [payload.document]
      : [];

  let imported = 0;
  let skipped = 0;
  const errors = [];

  for (const rawDocument of rawDocuments) {
    try {
      const parsed = parseTemplateDocument(rawDocument);
      await writeTemplateDocument(parsed);
      imported += 1;
    } catch (error) {
      skipped += 1;
      errors.push({
        id: rawDocument?.id ?? null,
        message: error?.message ?? 'Invalid template document.',
      });
    }
  }

  return { imported, skipped, errors };
}

export async function exportTemplateDocuments(templateId) {
  if (templateId) {
    const document = await readTemplateDocument(templateId);
    return { document };
  }

  const documents = await listTemplateDocuments();
  return { documents };
}

export function createDefaultTemplateDocument(templateId) {
  assertTemplateId(templateId);

  return {
    id: templateId,
    version: '1.0.0',
    status: 'draft',
    engine: 'dsl-v1',
    meta: {
      title: `تمپلیت ${templateId}`,
      category: 'custom',
      size: {
        width: 1080,
        height: 1080,
      },
      recommendedFormat: 'png',
      hasTransparency: true,
      tags: [],
    },
    inputs: [
      {
        key: 'title',
        type: 'text',
        label: 'عنوان',
        required: true,
        default: 'عنوان نمونه',
        maxLength: 80,
      },
    ],
    layout: {
      root: {
        type: 'frame',
        id: 'root',
        x: 0,
        y: 0,
        w: 1080,
        h: 1080,
        style: {
          backgroundColor: '#101828',
          overflow: 'hidden',
        },
        children: ['title-node'],
      },
      nodes: {
        'title-node': {
          type: 'text',
          id: 'title-node',
          x: 120,
          y: 140,
          w: 840,
          h: 180,
          text: '{{input.title}}',
          style: {
            color: '#ffffff',
            fontFamily: 'Nian-Black',
            fontSize: 88,
            lineHeight: 1.2,
          },
        },
      },
    },
    assets: {},
  };
}
