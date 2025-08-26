import { 
  projectsDb, 
  donationsDb, 
  contactMessagesDb, 
  getStats,
  type Project, 
  type Donation, 
  type ContactMessage 
} from './database.js';

// Type-safe column access helper
type KeyOf<T> = keyof T;
type ValueOf<T, K extends keyof T> = T[K];

// SQLite-based replacement for Supabase client
export class SQLiteClient {
  // Projects API
  projects = {
    select: (columns?: string) => ({
      eq: <K extends KeyOf<Project>>(column: K, value: ValueOf<Project, K>) => ({
        single: async () => {
          if (column === 'id') {
            const data = await projectsDb.getById(value as string);
            return { data, error: null };
          }
          const projects = await projectsDb.getAll();
          const filtered = projects.filter(p => p[column] === value);
          return { data: filtered[0] || null, error: null };
        }
      }),
      limit: (count: number) => ({
        data: projectsDb.getAll().then(projects => projects.slice(0, count)),
        error: null,
        // Add compatibility methods
        single: async () => {
          const projects = await projectsDb.getAll();
          return { data: projects.slice(0, count)[0] || null, error: null };
        }
      }),
      order: (column: KeyOf<Project>, options?: { ascending?: boolean }) => ({
        data: projectsDb.getAll().then(projects => 
          projects.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return options?.ascending ? result : -result;
          })
        ),
        error: null
      }),
      // Default select all
      then: async (callback: (result: { data: Project[], error: null }) => void) => {
        const data = await projectsDb.getAll();
        callback({ data, error: null });
      }
    }),

    insert: async (data: Omit<Project, 'id' | 'created_at' | 'updated_at'> | Omit<Project, 'id' | 'created_at' | 'updated_at'>[]) => {
      try {
        if (Array.isArray(data)) {
          const results = await Promise.all(data.map(item => projectsDb.create(item)));
          return { data: results, error: null };
        } else {
          const result = await projectsDb.create(data);
          return { data: [result], error: null };
        }
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },

    update: (updates: Partial<Project>) => ({
      eq: async (column: KeyOf<Project>, value: ValueOf<Project, KeyOf<Project>>) => {
        try {
          if (column === 'id') {
            await projectsDb.update(value as string, updates);
            const data = await projectsDb.getById(value as string);
            return { data, error: null };
          }
          return { data: null, error: new Error('Update only supported by ID') };
        } catch (error) {
          return { data: null, error: error as Error };
        }
      }
    }),

    delete: () => ({
      eq: (column: KeyOf<Project>, value: ValueOf<Project, KeyOf<Project>>) => {
        // Note: Delete functionality would need to be implemented in database.ts
        return { data: null, error: new Error('Delete not implemented yet') };
      }
    })
  };

  // Donations API
  donations = {
    select: (columns?: string) => ({
      eq: <K extends KeyOf<Donation>>(column: K, value: ValueOf<Donation, K>) => ({
        single: async () => {
          if (column === 'id') {
            const data = await donationsDb.getById(value as string);
            return { data, error: null };
          }
          const donations = await donationsDb.getAll();
          const filtered = donations.filter(d => d[column] === value);
          return { data: filtered[0] || null, error: null };
        }
      }),
      order: (column: KeyOf<Donation>, options?: { ascending?: boolean }) => ({
        data: donationsDb.getAll().then(donations =>
          donations.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return options?.ascending ? result : -result;
          })
        ),
        error: null
      }),
      then: async (callback: (result: { data: Donation[], error: null }) => void) => {
        const data = await donationsDb.getAll();
        callback({ data: data as Donation[], error: null });
      }
    }),

    insert: async (data: Omit<Donation, 'id' | 'created_at'> | Omit<Donation, 'id' | 'created_at'>[]) => {
      try {
        if (Array.isArray(data)) {
          const results = await Promise.all(data.map(item => donationsDb.create(item)));
          return { data: results, error: null };
        } else {
          const result = await donationsDb.create(data);
          return { data: [result], error: null };
        }
      } catch (error) {
        return { data: null, error: error as Error };
      }
    },

    update: (updates: Partial<Donation>) => ({
      eq: async (column: KeyOf<Donation>, value: ValueOf<Donation, KeyOf<Donation>>) => {
        try {
          if (column === 'id' && updates.status) {
            await donationsDb.updateStatus(
              value as string, 
              updates.status, 
              updates.verified_at || undefined
            );
            const data = await donationsDb.getById(value as string);
            return { data, error: null };
          }
          return { data: null, error: new Error('Update only supported for status by ID') };
        } catch (error) {
          return { data: null, error: error as Error };
        }
      }
    })
  };

  // Contact messages API
  contact_messages = {
    select: (columns?: string) => ({
      order: (column: KeyOf<ContactMessage>, options?: { ascending?: boolean }) => ({
        data: contactMessagesDb.getAll().then(messages =>
          messages.sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return options?.ascending ? result : -result;
          })
        ),
        error: null
      }),
      then: async (callback: (result: { data: ContactMessage[], error: null }) => void) => {
        const data = await contactMessagesDb.getAll();
        callback({ data, error: null });
      }
    }),

    insert: async (data: Omit<ContactMessage, 'id' | 'created_at' | 'responded'>) => {
      try {
        const result = await contactMessagesDb.create(data);
        return { data: [result], error: null };
      } catch (error) {
        return { data: null, error: error as Error };
      }
    }
  };

  // RPC functions
  rpc = (functionName: string, params?: Record<string, unknown>) => {
    // Implement any custom functions here
    return { data: null, error: new Error('RPC not implemented') };
  };

  // Channel/subscription functionality (simplified for SQLite)
  channel = (name: string) => ({
    on: (
      event: string, 
      config: Record<string, unknown>, 
      callback: (payload: { new?: Record<string, unknown>, old?: Record<string, unknown> }) => void
    ) => {
      // In a real implementation, you might use a file watcher or polling
      return {
        subscribe: () => {
          console.log(`Subscription to ${name} created (SQLite mode)`);
          return { unsubscribe: () => {} };
        }
      };
    }
  });

  removeChannel = (subscription: { unsubscribe?: () => void }) => {
    // Cleanup subscription
    if (subscription?.unsubscribe) {
      subscription.unsubscribe();
    }
  };

  // From method for table access
  from = (tableName: string) => {
    switch (tableName) {
      case 'projects':
        return this.projects;
      case 'donations':
        return this.donations;
      case 'contact_messages':
        return this.contact_messages;
      default:
        throw new Error(`Table ${tableName} not supported`);
    }
  };
}

// Create and export the SQLite client instance
export const supabase = new SQLiteClient();

// Function to ensure demo projects exist
export const ensureDemoProjects = async () => {
  try {
    const projects = await projectsDb.getAll();
    
    if (projects.length === 0) {
      // Projects will be created by the seed.sql file during database initialization
      console.log('Demo projects already created during database initialization');
    }
    
    return { data: projects, error: null };
  } catch (error) {
    console.error('Error ensuring demo projects:', error);
    return { data: null, error: error as Error };
  }
};

// Function to subscribe to donation updates (simplified for SQLite)
export const subscribeToDonationUpdates = (projectId: string, callback: (raised: number) => void) => {
  // In SQLite mode, we'll just return the current raised amount
  projectsDb.getById(projectId).then(project => {
    if (project) {
      callback(project.raised);
    }
  });

  // Return a cleanup function
  return () => {
    console.log(`Unsubscribed from project ${projectId} updates`);
  };
};

// Export types for compatibility
export type { Project, Donation, ContactMessage };

// Export database functions for direct access if needed
export { projectsDb, donationsDb, contactMessagesDb, getStats };
