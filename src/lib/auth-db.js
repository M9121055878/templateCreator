import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

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

export function getAuthDb() {
  if (dbInstance) {
    return dbInstance;
  }

  ensureDbDirectory();
  dbInstance = new Database(dbFilePath());

  return dbInstance;
}

export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function getUserByEmail(email) {
  const db = getAuthDb();
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row) return null;
  return getUserById(row.id);
}

export function getUserByUsername(username) {
  const db = getAuthDb();
  console.log('Querying for username:', username);
  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(username);
  console.log('Query result:', row ? 'found' : 'not found');
  if (!row) return null;
  return getUserById(row.id);
}

export function getUserById(id) {
  const db = getAuthDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  if (!user) return null;

  // Get role details
  const role = user.role_id ? db.prepare('SELECT * FROM roles WHERE id = ?').get(user.role_id) : null;
  
  // Get company details
  const company = user.company_id ? db.prepare('SELECT * FROM companies WHERE id = ?').get(user.company_id) : null;
  
  // Get group details
  const group = user.group_id ? db.prepare('SELECT * FROM groups WHERE id = ?').get(user.group_id) : null;

  return {
    ...user,
    role: role ? { ...role, permissions: JSON.parse(role.permissions_json) } : null,
    company,
    group,
  };
}

export function createUser({ email, password, firstName, lastName, roleId, companyId, groupId }) {
  const db = getAuthDb();
  const id = generateId();
  const now = new Date().toISOString();
  const passwordHash = hashPassword(password);

  const result = db.prepare(`
    INSERT INTO users (id, email, password_hash, first_name, last_name, role_id, company_id, group_id, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
  `).run(id, email, passwordHash, firstName, lastName, roleId, companyId, groupId, now, now);

  return getUserById(id);
}

export function updateUser(id, updates) {
  const db = getAuthDb();
  const now = new Date().toISOString();
  
  const fields = [];
  const values = [];
  
  if (updates.email) {
    fields.push('email = ?');
    values.push(updates.email);
  }
  if (updates.firstName) {
    fields.push('first_name = ?');
    values.push(updates.firstName);
  }
  if (updates.lastName) {
    fields.push('last_name = ?');
    values.push(updates.lastName);
  }
  if (updates.roleId !== undefined) {
    fields.push('role_id = ?');
    values.push(updates.roleId);
  }
  if (updates.companyId !== undefined) {
    fields.push('company_id = ?');
    values.push(updates.companyId);
  }
  if (updates.groupId !== undefined) {
    fields.push('group_id = ?');
    values.push(updates.groupId);
  }
  if (updates.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(updates.isActive ? 1 : 0);
  }
  
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`
    UPDATE users SET ${fields.join(', ')} WHERE id = ?
  `).run(...values);

  return getUserById(id);
}

export function deleteUser(id) {
  const db = getAuthDb();
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

export function listUsers({ companyId, groupId, roleId, isActive } = {}) {
  const db = getAuthDb();
  let query = 'SELECT * FROM users WHERE 1=1';
  const params = [];

  if (companyId) {
    query += ' AND company_id = ?';
    params.push(companyId);
  }
  if (groupId) {
    query += ' AND group_id = ?';
    params.push(groupId);
  }
  if (roleId) {
    query += ' AND role_id = ?';
    params.push(roleId);
  }
  if (isActive !== undefined) {
    query += ' AND is_active = ?';
    params.push(isActive ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params).map(user => getUserById(user.id));
}

export function changePassword(userId, currentPassword, newPassword) {
  const db = getAuthDb();
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = verifyPassword(currentPassword, user.password_hash);
  if (!isValid) {
    throw new Error('Current password is incorrect');
  }

  const passwordHash = hashPassword(newPassword);
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?
  `).run(passwordHash, now, userId);

  return true;
}

export function resetPassword(userId, newPassword) {
  const db = getAuthDb();
  const passwordHash = hashPassword(newPassword);
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE users SET password_hash = ?, updated_at = ? WHERE id = ?
  `).run(passwordHash, now, userId);

  return true;
}

// Role functions
export function getRoleById(id) {
  const db = getAuthDb();
  const role = db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
  if (!role) return null;
  return { ...role, permissions: JSON.parse(role.permissions_json) };
}

export function getRoleByName(name) {
  const db = getAuthDb();
  const role = db.prepare('SELECT * FROM roles WHERE name = ?').get(name);
  if (!role) return null;
  return { ...role, permissions: JSON.parse(role.permissions_json) };
}

export function createRole({ name, description, permissions }) {
  const db = getAuthDb();
  const id = generateId();
  const now = new Date().toISOString();
  const permissionsJson = JSON.stringify(permissions);

  db.prepare(`
    INSERT INTO roles (id, name, description, permissions_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, name, description, permissionsJson, now, now);

  return getRoleById(id);
}

export function updateRole(id, updates) {
  const db = getAuthDb();
  const now = new Date().toISOString();
  
  const fields = [];
  const values = [];
  
  if (updates.name) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    values.push(updates.description);
  }
  if (updates.permissions) {
    fields.push('permissions_json = ?');
    values.push(JSON.stringify(updates.permissions));
  }
  
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`
    UPDATE roles SET ${fields.join(', ')} WHERE id = ?
  `).run(...values);

  return getRoleById(id);
}

export function deleteRole(id) {
  const db = getAuthDb();
  db.prepare('DELETE FROM roles WHERE id = ?').run(id);
}

export function listRoles() {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM roles ORDER BY created_at DESC').all().map(role => ({
    ...role,
    permissions: JSON.parse(role.permissions_json),
  }));
}

// Company functions
export function getCompanyById(id) {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM companies WHERE id = ?').get(id);
}

export function getCompanyBySlug(slug) {
  const db = getAuthDb();
  return db.prepare('SELECT * FROM companies WHERE slug = ?').get(slug);
}

export function createCompany({ name, slug }) {
  const db = getAuthDb();
  const id = generateId();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO companies (id, name, slug, is_active, created_at, updated_at)
    VALUES (?, ?, ?, 1, ?, ?)
  `).run(id, name, slug, now, now);

  return getCompanyById(id);
}

export function updateCompany(id, updates) {
  const db = getAuthDb();
  const now = new Date().toISOString();
  
  const fields = [];
  const values = [];
  
  if (updates.name) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.slug) {
    fields.push('slug = ?');
    values.push(updates.slug);
  }
  if (updates.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(updates.isActive ? 1 : 0);
  }
  
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`
    UPDATE companies SET ${fields.join(', ')} WHERE id = ?
  `).run(...values);

  return getCompanyById(id);
}

export function deleteCompany(id) {
  const db = getAuthDb();
  db.prepare('DELETE FROM companies WHERE id = ?').run(id);
}

export function listCompanies({ isActive } = {}) {
  const db = getAuthDb();
  let query = 'SELECT * FROM companies WHERE 1=1';
  const params = [];

  if (isActive !== undefined) {
    query += ' AND is_active = ?';
    params.push(isActive ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params);
}

// Group functions
export function getGroupById(id) {
  const db = getAuthDb();
  const group = db.prepare('SELECT * FROM groups WHERE id = ?').get(id);
  if (!group) return null;
  
  const company = getCompanyById(group.company_id);
  return { ...group, company };
}

export function getGroupBySlug(slug) {
  const db = getAuthDb();
  const group = db.prepare('SELECT * FROM groups WHERE slug = ?').get(slug);
  if (!group) return null;
  
  const company = getCompanyById(group.company_id);
  return { ...group, company };
}

export function createGroup({ name, slug, companyId }) {
  const db = getAuthDb();
  const id = generateId();
  const now = new Date().toISOString();

  db.prepare(`
    INSERT INTO groups (id, name, slug, company_id, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, 1, ?, ?)
  `).run(id, name, slug, companyId, now, now);

  return getGroupById(id);
}

export function updateGroup(id, updates) {
  const db = getAuthDb();
  const now = new Date().toISOString();
  
  const fields = [];
  const values = [];
  
  if (updates.name) {
    fields.push('name = ?');
    values.push(updates.name);
  }
  if (updates.slug) {
    fields.push('slug = ?');
    values.push(updates.slug);
  }
  if (updates.companyId) {
    fields.push('company_id = ?');
    values.push(updates.companyId);
  }
  if (updates.isActive !== undefined) {
    fields.push('is_active = ?');
    values.push(updates.isActive ? 1 : 0);
  }
  
  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.prepare(`
    UPDATE groups SET ${fields.join(', ')} WHERE id = ?
  `).run(...values);

  return getGroupById(id);
}

export function deleteGroup(id) {
  const db = getAuthDb();
  db.prepare('DELETE FROM groups WHERE id = ?').run(id);
}

export function listGroups({ companyId, isActive } = {}) {
  const db = getAuthDb();
  let query = 'SELECT * FROM groups WHERE 1=1';
  const params = [];

  if (companyId) {
    query += ' AND company_id = ?';
    params.push(companyId);
  }
  if (isActive !== undefined) {
    query += ' AND is_active = ?';
    params.push(isActive ? 1 : 0);
  }

  query += ' ORDER BY created_at DESC';

  return db.prepare(query).all(...params).map(group => getGroupById(group.id));
}
