import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

let dbInstance;

function dataDirPath() {
  return path.join(process.cwd(), '.data');
}

function dbFilePath() {
  return path.join(dataDirPath(), 'templates.db');
}

function ensureDbDirectory() {
  fs.mkdirSync(dataDirPath(), { recursive: true });
}

function initializeSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      version TEXT NOT NULL,
      status TEXT NOT NULL,
      engine TEXT NOT NULL,
      meta_json TEXT NOT NULL,
      inputs_json TEXT NOT NULL,
      layout_json TEXT NOT NULL,
      assets_json TEXT NOT NULL,
      visibility_type TEXT DEFAULT 'all_companies',
      company_id TEXT,
      group_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_templates_updated_at ON templates(updated_at);
    CREATE INDEX IF NOT EXISTS idx_templates_visibility ON templates(visibility_type, company_id, group_id);

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role_id TEXT,
      company_id TEXT,
      group_id TEXT,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (role_id) REFERENCES roles(id),
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (group_id) REFERENCES groups(id)
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_company ON users(company_id);
    CREATE INDEX IF NOT EXISTS idx_users_group ON users(group_id);

    CREATE TABLE IF NOT EXISTS roles (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      permissions_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS companies (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);

    CREATE TABLE IF NOT EXISTS groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      company_id TEXT NOT NULL,
      is_active BOOLEAN DEFAULT 1,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (company_id) REFERENCES companies(id)
    );

    CREATE INDEX IF NOT EXISTS idx_groups_company ON groups(company_id);
    CREATE INDEX IF NOT EXISTS idx_groups_slug ON groups(slug);
  `);

  // Create default admin role if it doesn't exist
  const adminRole = db.prepare('SELECT * FROM roles WHERE name = ?').get('admin');
  if (!adminRole) {
    const adminRoleId = generateId();
    const now = new Date().toISOString();
    const permissions = JSON.stringify(['templates', 'theme-builder', 'users', 'roles', 'companies', 'groups']);
    db.prepare(`
      INSERT INTO roles (id, name, description, permissions_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminRoleId, 'admin', 'System administrator with full access', permissions, now, now);
  }

  // Create default company admin role if it doesn't exist
  const companyAdminRole = db.prepare('SELECT * FROM roles WHERE name = ?').get('company_admin');
  if (!companyAdminRole) {
    const companyAdminRoleId = generateId();
    const now = new Date().toISOString();
    const permissions = JSON.stringify(['templates', 'theme-builder', 'groups']);
    db.prepare(`
      INSERT INTO roles (id, name, description, permissions_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(companyAdminRoleId, 'company_admin', 'Company administrator', permissions, now, now);
  }

  // Create default user role if it doesn't exist
  const userRole = db.prepare('SELECT * FROM roles WHERE name = ?').get('user');
  if (!userRole) {
    const userRoleId = generateId();
    const now = new Date().toISOString();
    const permissions = JSON.stringify(['templates']);
    db.prepare(`
      INSERT INTO roles (id, name, description, permissions_json, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(userRoleId, 'user', 'Regular user', permissions, now, now);
  }
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function getEditorDb() {
  if (dbInstance) {
    return dbInstance;
  }

  ensureDbDirectory();
  dbInstance = new Database(dbFilePath());
  initializeSchema(dbInstance);

  return dbInstance;
}
