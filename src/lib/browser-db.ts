/**
 * Browser-compatible SQLite database using sql.js and localStorage
 * This provides a drop-in replacement for Supabase
 */

import initSqlJs, { Database } from 'sql.js';

// Database state
let db: Database | null = null;
let isInitialized = false;

// Demo data
const DEMO_PROJECTS = [
  {
    id: 'clean-water-init-001',
    title: 'Clean Water Initiative',
    description: 'Providing clean drinking water to rural communities through well construction and filtration systems.',
    image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    target: 25000,
    raised: 8750,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'education-scholar-002',
    title: 'Educational Scholarships',
    description: 'Providing academic scholarships for talented students from disadvantaged backgrounds to pursue higher education.',
    image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    target: 15000,
    raised: 6200,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'healthcare-outreach-003',
    title: 'Healthcare Outreach',
    description: 'Mobile healthcare services bringing medical care to remote villages and providing essential medical supplies.',
    image_url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
    target: 30000,
    raised: 12800,
    start_date: new Date().toISOString(),
    end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Initialize the database
async function initDB() {
  if (isInitialized) return;
  
  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://sql.js.org/dist/${file}`
    });

    // Try to load from localStorage first
    const savedData = localStorage.getItem('lynda_foundation_db');
    if (savedData) {
      const buffer = new Uint8Array(JSON.parse(savedData));
      db = new SQL.Database(buffer);
      console.log('Database loaded from localStorage');
    } else {
      // Create new database
      db = new SQL.Database();
      createSchema();
      seedData();
      saveDB();
      console.log('New database created');
    }
    
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    // Fallback to in-memory storage
    createFallbackStorage();
  }
}

// Create schema
function createSchema() {
  if (!db) return;
  
  db.run(`
    CREATE TABLE projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      target REAL NOT NULL,
      raised REAL DEFAULT 0,
      start_date TEXT NOT NULL,
      end_date TEXT,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE donations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      amount REAL NOT NULL,
      message TEXT,
      project_id TEXT,
      project_name TEXT,
      transfer_confirmation TEXT NOT NULL,
      status TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      verified_at TEXT,
      payment_reference TEXT,
      FOREIGN KEY (project_id) REFERENCES projects(id)
    );

    CREATE TABLE contact_messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      responded INTEGER DEFAULT 0
    );

    CREATE INDEX idx_projects_status ON projects(status);
    CREATE INDEX idx_donations_project_id ON donations(project_id);
    CREATE INDEX idx_donations_status ON donations(status);
  `);
}

// Seed with demo data
function seedData() {
  if (!db) return;

  const stmt = db.prepare(`
    INSERT INTO projects (id, title, description, image_url, target, raised, start_date, end_date, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const project of DEMO_PROJECTS) {
    stmt.run([
      project.id, project.title, project.description, project.image_url,
      project.target, project.raised, project.start_date, project.end_date,
      project.status, project.created_at, project.updated_at
    ]);
  }
}

// Save to localStorage
function saveDB() {
  if (!db) return;
  
  try {
    const data = db.export();
    localStorage.setItem('lynda_foundation_db', JSON.stringify(Array.from(data)));
  } catch (error) {
    console.warn('Failed to save database:', error);
  }
}

// Fallback to simple in-memory storage
let fallbackData: any = {
  projects: [...DEMO_PROJECTS],
  donations: [],
  contact_messages: []
};

function createFallbackStorage() {
  console.log('Using fallback in-memory storage');
  isInitialized = true;
}

// Generate UUID
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Supabase-compatible API
export const supabase = {
  from(table: string) {
    return {
      select(columns = '*') {
        return {
          async then(callback: (result: any) => void) {
            await initDB();
            
            let data;
            if (db) {
              const stmt = db.prepare(`SELECT ${columns} FROM ${table}`);
              data = [];
              while (stmt.step()) {
                data.push(stmt.getAsObject());
              }
              stmt.free();
            } else {
              data = fallbackData[table] || [];
            }
            
            callback({ data, error: null });
          },

          eq(column: string, value: any) {
            return {
              async single() {
                await initDB();
                
                let data;
                if (db) {
                  const stmt = db.prepare(`SELECT ${columns} FROM ${table} WHERE ${column} = ?`);
                  stmt.bind([value]);
                  data = stmt.step() ? stmt.getAsObject() : null;
                  stmt.free();
                } else {
                  data = (fallbackData[table] || []).find((item: any) => item[column] === value) || null;
                }
                
                return { data, error: null };
              }
            };
          },

          limit(count: number) {
            return {
              async then(callback: (result: any) => void) {
                await initDB();
                
                let data;
                if (db) {
                  const stmt = db.prepare(`SELECT ${columns} FROM ${table} LIMIT ?`);
                  stmt.bind([count]);
                  data = [];
                  while (stmt.step()) {
                    data.push(stmt.getAsObject());
                  }
                  stmt.free();
                } else {
                  data = (fallbackData[table] || []).slice(0, count);
                }
                
                callback({ data, error: null });
              }
            };
          },

          order(column: string, options: { ascending?: boolean } = {}) {
            return {
              async then(callback: (result: any) => void) {
                await initDB();
                
                let data;
                if (db) {
                  const direction = options.ascending ? 'ASC' : 'DESC';
                  const stmt = db.prepare(`SELECT ${columns} FROM ${table} ORDER BY ${column} ${direction}`);
                  data = [];
                  while (stmt.step()) {
                    data.push(stmt.getAsObject());
                  }
                  stmt.free();
                } else {
                  data = [...(fallbackData[table] || [])].sort((a, b) => {
                    const result = a[column] < b[column] ? -1 : a[column] > b[column] ? 1 : 0;
                    return options.ascending ? result : -result;
                  });
                }
                
                callback({ data, error: null });
              }
            };
          }
        };
      },

      async insert(records: any) {
        await initDB();
        
        try {
          const recordsArray = Array.isArray(records) ? records : [records];
          
          if (db) {
            const columns = Object.keys(recordsArray[0]);
            const placeholders = columns.map(() => '?').join(', ');
            const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);
            
            for (const record of recordsArray) {
              const id = record.id || generateId();
              const values = columns.map(col => col === 'id' ? id : record[col]);
              stmt.run(values);
            }
            stmt.free();
            saveDB();
          } else {
            for (const record of recordsArray) {
              const id = record.id || generateId();
              fallbackData[table] = fallbackData[table] || [];
              fallbackData[table].push({ ...record, id });
            }
          }
          
          return { data: recordsArray, error: null };
        } catch (error) {
          return { data: null, error };
        }
      },

      update(updates: any) {
        return {
          eq(column: string, value: any) {
            return new Promise(async (resolve) => {
              await initDB();
              
              try {
                if (db) {
                  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
                  const stmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE ${column} = ?`);
                  const values = [...Object.values(updates), value];
                  stmt.run(values);
                  stmt.free();
                  saveDB();
                } else {
                  const items = fallbackData[table] || [];
                  const index = items.findIndex((item: any) => item[column] === value);
                  if (index >= 0) {
                    fallbackData[table][index] = { ...items[index], ...updates };
                  }
                }
                
                resolve({ data: null, error: null });
              } catch (error) {
                resolve({ data: null, error });
              }
            });
          }
        };
      }
    };
  },

  channel(name: string) {
    return {
      on(event: string, config: any, callback: Function) {
        return {
          subscribe() {
            console.log(`Subscribed to ${name} (SQLite mode - no real-time updates)`);
            return { unsubscribe: () => {} };
          }
        };
      }
    };
  },

  removeChannel() {
    // No-op for SQLite
  }
};

// Compatibility functions
export async function ensureDemoProjects() {
  await initDB();
  console.log('Demo projects ensured');
}

export function subscribeToDonationUpdates(projectId: string, callback: (raised: number) => void) {
  // In SQLite mode, just call once with current value
  supabase.from('projects').select('raised').eq('id', projectId).single().then(({ data }) => {
    if (data) callback(data.raised);
  });
  
  return () => console.log(`Unsubscribed from project ${projectId}`);
}
