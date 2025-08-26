import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import localforage from 'localforage';

// Configure localforage for database storage
localforage.config({
  name: 'LyndaMbahFoundation',
  storeName: 'database'
});

// Global database instance
let db: Database | null = null;
let SQL: SqlJsStatic | null = null;

// Initialize SQL.js
export const initializeSQL = async (): Promise<SqlJsStatic> => {
  if (!SQL) {
    SQL = await initSqlJs({
      // Use CDN for the wasm file
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    });
  }
  return SQL;
};

// Load database from localStorage or create new one
export const initializeDatabase = async (): Promise<Database> => {
  if (db) return db;

  const sqlJs = await initializeSQL();
  
  try {
    // Try to load existing database from localStorage
    const savedDb = await localforage.getItem<Uint8Array>('database');
    
    if (savedDb) {
      db = new sqlJs.Database(savedDb);
      console.log('Database loaded from localStorage');
    } else {
      // Create new database
      db = new sqlJs.Database();
      await createSchema();
      await seedDatabase();
      await saveDatabase();
      console.log('New database created with initial data');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    // Fallback: create new database
    db = new sqlJs.Database();
    await createSchema();
    await seedDatabase();
    await saveDatabase();
  }

  return db;
};

// Save database to localStorage
export const saveDatabase = async (): Promise<void> => {
  if (!db) return;
  
  try {
    const data = db.export();
    await localforage.setItem('database', data);
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Create database schema
const createSchema = async (): Promise<void> => {
  if (!db) return;

  const schema = `
    -- Enable foreign keys
    PRAGMA foreign_keys = ON;

    -- Contact Messages Table
    CREATE TABLE contact_messages (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        responded INTEGER DEFAULT 0 CHECK (responded IN (0, 1))
    );

    -- Projects Table
    CREATE TABLE projects (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        target REAL NOT NULL,
        raised REAL DEFAULT 0,
        start_date DATETIME NOT NULL,
        end_date DATETIME,
        status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'upcoming')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Donations Table
    CREATE TABLE donations (
        id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        amount REAL NOT NULL,
        message TEXT,
        project_id TEXT,
        project_name TEXT,
        transfer_confirmation TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('pending', 'verified', 'cancelled')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        verified_at DATETIME,
        payment_reference TEXT,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
    );

    -- Create indexes for better performance
    CREATE INDEX idx_donations_project_id ON donations(project_id);
    CREATE INDEX idx_donations_status ON donations(status);
    CREATE INDEX idx_projects_status ON projects(status);
    CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at);
    CREATE INDEX idx_donations_created_at ON donations(created_at);
  `;

  try {
    db.exec(schema);
  } catch (error) {
    console.error('Error creating schema:', error);
    throw error;
  }
};

// Seed database with demo data
const seedDatabase = async (): Promise<void> => {
  if (!db) return;

  const seed = `
    -- Insert demo projects
    INSERT INTO projects (
        id, title, description, image_url, target, raised, 
        start_date, end_date, status, created_at, updated_at
    ) VALUES 
    (
        'clean-water-init-001', 
        'Clean Water Initiative', 
        'Providing clean drinking water to rural communities through well construction and filtration systems.',
        'https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        25000,
        8750,
        datetime('now'),
        datetime('now', '+90 days'),
        'active',
        datetime('now'),
        datetime('now')
    ),
    (
        'education-scholar-002',
        'Educational Scholarships',
        'Providing academic scholarships for talented students from disadvantaged backgrounds to pursue higher education.',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        15000,
        6200,
        datetime('now'),
        datetime('now', '+60 days'),
        'active',
        datetime('now'),
        datetime('now')
    ),
    (
        'healthcare-outreach-003',
        'Healthcare Outreach',
        'Mobile healthcare services bringing medical care to remote villages and providing essential medical supplies.',
        'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
        30000,
        12800,
        datetime('now'),
        datetime('now', '+120 days'),
        'active',
        datetime('now'),
        datetime('now')
    );
  `;

  try {
    db.exec(seed);
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Database interface types
export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  target: number;
  raised: number;
  start_date: string;
  end_date: string | null;
  status: 'active' | 'completed' | 'upcoming';
  created_at: string;
  updated_at: string;
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  message: string | null;
  project_id: string | null;
  project_name: string | null;
  transfer_confirmation: string;
  status: 'pending' | 'verified' | 'cancelled';
  created_at: string;
  verified_at: string | null;
  payment_reference: string | null;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
  responded: boolean;
}

// Helper function to execute SQL and return results
const executeQuery = async (sql: string, params: unknown[] = []): Promise<Record<string, unknown>[]> => {
  const database = await initializeDatabase();
  try {
    const stmt = database.prepare(sql);
    const results: Record<string, unknown>[] = [];
    stmt.bind(params);
    
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row);
    }
    stmt.free();
    
    // Auto-save after queries
    await saveDatabase();
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Helper function to execute SQL without returning results (INSERT, UPDATE, DELETE)
const executeCommand = async (sql: string, params: unknown[] = []): Promise<void> => {
  const database = await initializeDatabase();
  try {
    const stmt = database.prepare(sql);
    stmt.bind(params);
    stmt.step();
    stmt.free();
    
    // Auto-save after commands
    await saveDatabase();
  } catch (error) {
    console.error('Database command error:', error);
    throw error;
  }
};

// Projects operations
export const projectsDb = {
  getAll: async (): Promise<Project[]> => {
    const results = await executeQuery('SELECT * FROM projects ORDER BY created_at DESC');
    return results as unknown as Project[];
  },

  getById: async (id: string): Promise<Project | undefined> => {
    const results = await executeQuery('SELECT * FROM projects WHERE id = ?', [id]);
    const row = results[0];
    return row ? (row as unknown as Project) : undefined;
  },

  getByStatus: async (status: string): Promise<Project[]> => {
    const results = await executeQuery('SELECT * FROM projects WHERE status = ? ORDER BY created_at DESC', [status]);
    return results as unknown as Project[];
  },

  create: async (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> => {
    const id = generateId();
    const now = new Date().toISOString();
    
    await executeCommand(`
      INSERT INTO projects (
        id, title, description, image_url, target, raised,
        start_date, end_date, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, project.title, project.description, project.image_url,
      project.target, project.raised, project.start_date, project.end_date,
      project.status, now, now
    ]);
    
    return { id, ...project, created_at: now, updated_at: now };
  },

  update: async (id: string, updates: Partial<Project>): Promise<void> => {
    const now = new Date().toISOString();
    const fields = Object.keys(updates).filter(key => key !== 'id').map(key => `${key} = ?`);
    const values = Object.entries(updates)
      .filter(([key]) => key !== 'id')
      .map(([, value]) => value);
    
    if (fields.length === 0) return;
    
    await executeCommand(`
      UPDATE projects 
      SET ${fields.join(', ')}, updated_at = ?
      WHERE id = ?
    `, [...values, now, id]);
  }
};

// Donations operations
export const donationsDb = {
  getAll: async (): Promise<(Donation & { project_title?: string })[]> => {
    const results = await executeQuery(`
      SELECT d.*, p.title as project_title 
      FROM donations d
      LEFT JOIN projects p ON d.project_id = p.id
      ORDER BY d.created_at DESC
    `);
    return results as unknown as (Donation & { project_title?: string })[];
  },

  getById: async (id: string): Promise<Donation | undefined> => {
    const results = await executeQuery('SELECT * FROM donations WHERE id = ?', [id]);
    return results[0] as unknown as Donation | undefined;
  },

  getByProject: async (projectId: string): Promise<Donation[]> => {
    const results = await executeQuery(`
      SELECT * FROM donations 
      WHERE project_id = ? 
      ORDER BY created_at DESC
    `, [projectId]);
    return results as unknown as Donation[];
  },

  create: async (donation: Omit<Donation, 'id' | 'created_at'>): Promise<Donation> => {
    const id = generateId();
    const now = new Date().toISOString();
    
    await executeCommand(`
      INSERT INTO donations (
        id, name, email, amount, message, project_id, project_name,
        transfer_confirmation, status, created_at, verified_at, payment_reference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id, donation.name, donation.email, donation.amount, donation.message,
      donation.project_id, donation.project_name, donation.transfer_confirmation,
      donation.status, now, donation.verified_at, donation.payment_reference
    ]);
    
    return { id, ...donation, created_at: now };
  },

  updateStatus: async (id: string, status: Donation['status'], verifiedAt?: string): Promise<void> => {
    await executeCommand(`
      UPDATE donations 
      SET status = ?, verified_at = ?
      WHERE id = ?
    `, [status, verifiedAt || null, id]);
  }
};

// Contact Messages operations
export const contactMessagesDb = {
  getAll: async (): Promise<ContactMessage[]> => {
    const results = await executeQuery(`
      SELECT * FROM contact_messages 
      ORDER BY created_at DESC
    `);
    return results.map(row => ({
      ...(row as unknown as ContactMessage),
      responded: Boolean(row.responded)
    }));
  },

  getById: async (id: string): Promise<ContactMessage | undefined> => {
    const results = await executeQuery('SELECT * FROM contact_messages WHERE id = ?', [id]);
    const row = results[0];
    return row ? {
      ...(row as unknown as ContactMessage),
      responded: Boolean(row.responded)
    } : undefined;
  },

  create: async (message: Omit<ContactMessage, 'id' | 'created_at' | 'responded'>): Promise<ContactMessage> => {
    const id = generateId();
    const now = new Date().toISOString();
    
    await executeCommand(`
      INSERT INTO contact_messages (id, name, email, subject, message, created_at, responded)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `, [id, message.name, message.email, message.subject, message.message, now]);
    
    return { id, ...message, created_at: now, responded: false };
  },

  markAsResponded: async (id: string): Promise<void> => {
    await executeCommand('UPDATE contact_messages SET responded = 1 WHERE id = ?', [id]);
  }
};

// Utility functions
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Statistics and reporting
export const getStats = async () => {
  const totalProjects = await executeQuery('SELECT COUNT(*) as count FROM projects');
  const activeProjects = await executeQuery('SELECT COUNT(*) as count FROM projects WHERE status = ?', ['active']);
  const totalDonations = await executeQuery('SELECT COUNT(*) as count FROM donations WHERE status = ?', ['verified']);
  const totalRaised = await executeQuery('SELECT SUM(amount) as total FROM donations WHERE status = ?', ['verified']);
  const totalMessages = await executeQuery('SELECT COUNT(*) as count FROM contact_messages');

  return {
    totalProjects: totalProjects[0]?.count || 0,
    activeProjects: activeProjects[0]?.count || 0,
    totalDonations: totalDonations[0]?.count || 0,
    totalRaised: totalRaised[0]?.total || 0,
    totalMessages: totalMessages[0]?.count || 0
  };
};

// Export the database instance getter
export const getDatabase = () => db;

export default { initializeDatabase, saveDatabase };
