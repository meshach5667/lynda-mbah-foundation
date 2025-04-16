
import React from 'react';
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProjectCard, { ProjectProps } from '@/components/projects/ProjectCard';

// Sample project data - in a real app this would come from an API or database
const projectsData: ProjectProps[] = [
  {
    id: "project-1",
    title: "Clean Water Initiative",
    description: "Bringing clean drinking water to rural communities through well construction and water purification systems.",
    image: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 25000,
    raised: 16750,
    endDate: "Dec 31, 2025",
    category: "Water & Sanitation"
  },
  {
    id: "project-2",
    title: "Education for All",
    description: "Supporting education through school construction, teacher training, and scholarship programs for underprivileged children.",
    image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 40000,
    raised: 12800,
    endDate: "Nov 15, 2025",
    category: "Education"
  },
  {
    id: "project-3",
    title: "Healthcare Outreach",
    description: "Mobile healthcare clinics bringing essential medical services to remote and underserved areas.",
    image: "https://images.unsplash.com/photo-1504813184591-01572f98c85f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 35000,
    raised: 27500,
    endDate: "Oct 30, 2025",
    category: "Healthcare"
  },
  {
    id: "project-4",
    title: "Sustainable Agriculture",
    description: "Training farmers in sustainable agriculture methods to increase crop yields and ensure food security.",
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 20000,
    raised: 8500,
    endDate: "Jan 15, 2026",
    category: "Agriculture"
  },
  {
    id: "project-5",
    title: "Women's Empowerment",
    description: "Supporting women entrepreneurs through training, microloans, and mentorship programs.",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 30000,
    raised: 21000,
    endDate: "Mar 8, 2026",
    category: "Empowerment"
  },
  {
    id: "project-6",
    title: "Youth Development Center",
    description: "Creating safe spaces for youth to learn, grow, and develop essential life skills.",
    image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    target: 45000,
    raised: 18000,
    endDate: "Apr 20, 2026",
    category: "Youth"
  }
];

const Projects = () => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projectsData.map(project => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

export default Projects;
