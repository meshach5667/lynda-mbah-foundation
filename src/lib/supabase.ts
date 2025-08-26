
import { createClient } from '@supabase/supabase-js';
import { 
  supabase as browserDb, 
  ensureDemoProjects as browserEnsureDemoProjects,
  subscribeToDonationUpdates as browserSubscribeToDonationUpdates
} from './browser-db';

// Check if we should use SQLite (default) or Supabase
const useSupabase = import.meta.env.VITE_USE_SUPABASE === 'true';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create clients
const supabaseClient = useSupabase ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Export the appropriate client
export const supabase = useSupabase ? supabaseClient! : browserDb;

// Function to create demo projects if needed
export const ensureDemoProjects = async () => {
  if (useSupabase && supabaseClient) {
    // Original Supabase implementation
    const { data: existingProjects, error } = await supabaseClient
      .from('projects')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking for existing projects:', error);
      return;
    }

    // If no projects exist, create demo projects
    if (!existingProjects || existingProjects.length === 0) {
      const demoProjects = [
        {
          title: 'Clean Water Initiative',
          description: 'Providing clean drinking water to rural communities through well construction and filtration systems.',
          image_url: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          target: 25000,
          raised: 8750,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        },
        {
          title: 'Educational Scholarships',
          description: 'Providing academic scholarships for talented students from disadvantaged backgrounds to pursue higher education.',
          image_url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          target: 15000,
          raised: 6200,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        },
        {
          title: 'Healthcare Outreach',
          description: 'Mobile healthcare services bringing medical care to remote villages and providing essential medical supplies.',
          image_url: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
          target: 30000,
          raised: 12800,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active'
        }
      ];

      // Insert demo projects
      const { error: insertError } = await supabaseClient
        .from('projects')
        .insert(demoProjects);

      if (insertError) {
        console.error('Error creating demo projects:', insertError);
      } else {
        console.log('Demo projects created successfully');
      }
    }
  } else {
    // Use browser database implementation
    return await browserEnsureDemoProjects();
  }
};

// Function to listen for donation updates
export const subscribeToDonationUpdates = (projectId: string, callback: (raised: number) => void) => {
  if (useSupabase && supabaseClient) {
    // Original Supabase implementation
    const subscription = supabaseClient
      .channel(`project-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'projects',
          filter: `id=eq.${projectId}`
        },
        (payload) => {
          if (payload.new && typeof payload.new.raised === 'number') {
            callback(payload.new.raised);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient.removeChannel(subscription);
    };
  } else {
    // Use browser database implementation
    return browserSubscribeToDonationUpdates(projectId, callback);
  }
};
