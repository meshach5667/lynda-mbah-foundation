import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Function to create demo projects if needed
export const ensureDemoProjects = async () => {
  // Check if any projects exist
  const { data: existingProjects, error } = await supabase
    .from('projects')
    .select('id')
    .limit(1);

  if (error) {
    console.error('Error checking for existing projects:', error);
    return;
  }

  // If no projects exist, create demo projects with updated images
  if (!existingProjects || existingProjects.length === 0) {
    const demoProjects = [
      {
        title: 'Clean Water Initiative',
        description: 'Providing clean drinking water to rural communities through well construction and filtration systems.',
        image_url: 'https://images.unsplash.com/photo-1573964020688-e2c1d8130c9b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        target: 25000,
        raised: 8750,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        title: 'Educational Scholarships',
        description: 'Providing academic scholarships for talented students from disadvantaged backgrounds to pursue higher education.',
        image_url: 'https://images.unsplash.com/photo-1596524430615-2eaed02de92c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        target: 15000,
        raised: 6200,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        title: 'Healthcare Outreach',
        description: 'Mobile healthcare services bringing medical care to remote villages and providing essential medical supplies.',
        image_url: 'https://images.unsplash.com/photo-1587245897008-0c8559e8183b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
        target: 30000,
        raised: 12800,
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      }
    ];

    // Insert demo projects
    const { error: insertError } = await supabase
      .from('projects')
      .insert(demoProjects);

    if (insertError) {
      console.error('Error creating demo projects:', insertError);
    } else {
      console.log('Demo projects created successfully');
    }
  }
};

// Function to listen for donation updates
export const subscribeToDonationUpdates = (projectId: string, callback: (raised: number) => void) => {
  const subscription = supabase
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
    supabase.removeChannel(subscription);
  };
};
