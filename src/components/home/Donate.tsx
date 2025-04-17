
import { useState, useEffect } from 'react';
import { ArrowRight, Heart, Loader2 } from 'lucide-react';
import DonateButton from '@/components/ui/DonateButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DonationForm from '@/components/donation/DonationForm';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from 'react-router-dom';
import { supabase, ensureDemoProjects } from '@/lib/supabase';
import { Progress } from '@/components/ui/progress';

interface FeaturedProject {
  id: string;
  title: string;
  description: string;
  image: string;
  target: number;
  raised: number;
}

const Donate = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{id: string, title: string} | null>(null);
  const [featuredProjects, setFeaturedProjects] = useState<FeaturedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        // First ensure we have demo projects
        await ensureDemoProjects();
        
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, image_url, target, raised')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(3);

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
          }));
          setFeaturedProjects(formattedProjects);
        }
      } catch (err) {
        console.error('Error fetching featured projects:', err);
        // Fall back to empty array if there's an error
        setFeaturedProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProjects();
  }, []);

  const handleDonateClick = (project?: {id: string, title: string}) => {
    setSelectedProject(project || null);
    setShowDonateModal(true);
  };

  return (
    <section className="py-20 bg-white" id='donate'>
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-foundation-primary to-foundation-dark rounded-xl overflow-hidden shadow-xl mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Image */}
            <div className="h-64 lg:h-full bg-cover bg-center" style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80')"
            }}></div>
            
            {/* Content */}
            <div className="p-8 lg:p-12 text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Support Our Cause</h2>
              <p className="mb-6 text-gray-100">
                Your donation directly supports our programs and initiatives, making a meaningful 
                impact in the lives of those we serve. Every contribution, regardless of size, 
                helps us further our mission.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start space-x-3">
                  <div className="bg-white rounded-full p-1 text-foundation-primary">
                    <ArrowRight size={16} />
                  </div>
                  <p>Fund educational scholarships for underprivileged students</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white rounded-full p-1 text-foundation-primary">
                    <ArrowRight size={16} />
                  </div>
                  <p>Support healthcare initiatives in underserved communities</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="bg-white rounded-full p-1 text-foundation-primary">
                    <ArrowRight size={16} />
                  </div>
                  <p>Help develop sustainable community infrastructure</p>
                </div>
              </div>
              
              <DonateButton 
                size="lg" 
                variant="outline" 
                className="w-full md:w-auto"
                onClick={() => handleDonateClick()}
              />
            </div>
          </div>
        </div>
        
        {/* Featured Projects Section */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foundation-primary mb-2">Featured Projects</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Explore some of our ongoing initiatives and make a direct impact by supporting specific projects.
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-foundation-primary" />
            </div>
          ) : featuredProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <HoverCard key={project.id}>
                  <HoverCardTrigger asChild>
                    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full">
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={project.image} 
                          alt={project.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <CardContent className="p-6">
                        <h4 className="text-xl font-bold mb-2">{project.title}</h4>
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">Progress</span>
                            <span className="font-bold text-foundation-primary">
                              {Math.round((project.raised / project.target) * 100)}%
                            </span>
                          </div>
                          <Progress 
                            value={Math.min(100, Math.round((project.raised / project.target) * 100))}
                            className="h-2.5" 
                          />
                          <div className="flex justify-between mt-2 text-sm">
                            <span>Raised: <span className="font-bold">
                              {project.raised.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}
                            </span></span>
                            <span>Goal: <span className="font-bold">
                              {project.target.toLocaleString('en-US', { style: 'currency', currency: 'NGN' })}
                            </span></span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-0 bg-white shadow-lg rounded-lg border border-gray-200">
                    <div className="p-4 text-center">
                      <h4 className="text-lg font-bold mb-2">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-4">Help us reach our goal!</p>
                      <button
                        onClick={() => handleDonateClick({id: project.id, title: project.title})}
                        className="px-4 py-2 bg-foundation-accent text-white rounded-full hover:bg-foundation-highlight transition-colors flex items-center justify-center mx-auto"
                      >
                        <Heart size={16} className="mr-2" /> Donate Now
                      </button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          )}
          
          <Link to="/projects" className="mt-8 inline-flex items-center text-foundation-primary hover:text-foundation-dark font-medium">
            View all projects <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>

      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl mb-4">
              {selectedProject ? `Donate to ${selectedProject.title}` : 'Make a General Donation'}
            </DialogTitle>
          </DialogHeader>
          <DonationForm 
            projectId={selectedProject?.id}
            projectName={selectedProject?.title} 
            onSuccess={() => setShowDonateModal(false)} 
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Donate;
