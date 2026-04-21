const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function dataDirPath() {
  return path.join(process.cwd(), '.data');
}

function dbFilePath() {
  return path.join(dataDirPath(), 'templates.db');
}

function migrateGroupSlugConstraint() {
  const db = new Database(dbFilePath());

  console.log('Starting migration of groups table...');

  try {
    // Check if the old unique constraint exists by checking the schema
    const schema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='groups'").get();
    console.log('Current groups table schema:', schema.sql);

    // Check if the old UNIQUE constraint exists
    if (schema.sql.includes('slug TEXT UNIQUE')) {
      console.log('Old UNIQUE constraint found. Starting migration...');

      // Begin transaction
      const migration = db.transaction(() => {
        // 1. Create new table with correct schema
        db.exec(`
          CREATE TABLE groups_new (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            slug TEXT NOT NULL,
            company_id TEXT NOT NULL,
            is_active BOOLEAN DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (company_id) REFERENCES companies(id),
            UNIQUE(company_id, slug)
          );
        `);

        // 2. Copy data from old table to new table
        db.exec(`
          INSERT INTO groups_new (id, name, slug, company_id, is_active, created_at, updated_at)
          SELECT id, name, slug, company_id, is_active, created_at, updated_at FROM groups;
        `);

        // 3. Drop old table
        db.exec('DROP TABLE groups;');

        // 4. Rename new table to old name
        db.exec('ALTER TABLE groups_new RENAME TO groups;');

        // 5. Recreate indexes
        db.exec(`
          CREATE INDEX IF NOT EXISTS idx_groups_company ON groups(company_id);
          CREATE INDEX IF NOT EXISTS idx_groups_slug ON groups(slug);
        `);
      });

      migration();
      console.log('Migration completed successfully!');
    } else if (schema.sql.includes('UNIQUE(company_id, slug)')) {
      console.log('New UNIQUE constraint already exists. No migration needed.');
    } else {
      console.log('Unexpected schema. Please check manually.');
    }

    // Verify the new schema
    const newSchema = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='groups'").get();
    console.log('New groups table schema:', newSchema.sql);

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    db.close();
  }
}

migrateGroupSlugConstraint();
