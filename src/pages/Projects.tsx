
import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard, { ProjectProps } from '@/components/projects/ProjectCard';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState<ProjectProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const formattedProjects = data.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            image: project.image_url,
            target: project.target,
            raised: project.raised || 0,
            endDate: new Date(project.end_date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }),
            category: project.status.charAt(0).toUpperCase() + project.status.slice(1)
          }));
          setProjects(formattedProjects);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <>
      <Helmet>
        <title>Projects | Lynda Mbah Foundation</title>
        <meta name="description" content="Current projects of the Lynda Mbah Foundation. Support our initiatives in education, healthcare, and community development." />
      </Helmet>
      
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="bg-foundation-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Projects</h1>
            <p className="text-lg text-white/90 max-w-3xl mx-auto">
              Discover our ongoing initiatives and how your support can make a difference.
              Each project addresses critical needs in our communities.
            </p>
          </div>
        </section>
        
        {/* Projects Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-12 w-12 animate-spin text-foundation-primary" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-foundation-primary text-white rounded-md"
                >
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-gray-600">No projects available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(project => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Projects;
