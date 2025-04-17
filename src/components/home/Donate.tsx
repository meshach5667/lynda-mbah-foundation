
import { useState } from 'react';
import { ArrowRight, Heart } from 'lucide-react';
import DonateButton from '@/components/ui/DonateButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DonationForm from '@/components/donation/DonationForm';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Link } from 'react-router-dom';

// Sample featured projects
const featuredProjects = [
  {
    id: "project-1",
    title: "Clean Water Initiative",
    description: "Bringing clean drinking water to rural communities",
    image: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 25000,
    raised: 16750,
  },
  {
    id: "project-2",
    title: "Education for All",
    description: "Supporting education through school construction",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 40000,
    raised: 12800,
  },
  {
    id: "project-3",
    title: "Healthcare Outreach",
    description: "Mobile healthcare clinics for remote areas",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 35000,
    raised: 27500,
  },
];

const Donate = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{id: string, title: string} | null>(null);

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
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">Progress</span>
                          <span className="font-bold text-foundation-primary">
                            {Math.round((project.raised / project.target) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-foundation-primary h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, Math.round((project.raised / project.target) * 100))}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between mt-2 text-sm">
                          <span>Raised: <span className="font-bold">
                            ${project.raised.toLocaleString()}
                          </span></span>
                          <span>Goal: <span className="font-bold">
                            ${project.target.toLocaleString()}
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
