
import { GraduationCap, Heart, Home, Users, Leaf, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgramCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const ProgramCard = ({ title, description, icon, color }: ProgramCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 hover:-translate-y-2">
      <div className={cn("w-16 h-16 rounded-lg flex items-center justify-center mb-4", color)}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Programs = () => {
  const programs = [
    {
      title: "Education Access",
      description: "Providing scholarships, building schools, and supporting educational initiatives for underprivileged children and youth.",
      icon: <GraduationCap size={32} className="text-white" />,
      color: "bg-blue-500"
    },
    {
      title: "Healthcare Initiatives",
      description: "Improving access to quality healthcare services, organizing health camps, and promoting health education.",
      icon: <Heart size={32} className="text-white" />,
      color: "bg-red-500"
    },
    {
      title: "Community Development",
      description: "Building infrastructure, supporting clean water projects, and enhancing community facilities.",
      icon: <Home size={32} className="text-white" />,
      color: "bg-foundation-primary"
    },
    {
      title: "Women Empowerment",
      description: "Supporting women with skills training, microfinance opportunities, and advocacy for gender equality.",
      icon: <Users size={32} className="text-white" />,
      color: "bg-purple-500"
    },
    {
      title: "Environmental Sustainability",
      description: "Promoting sustainable practices, tree planting initiatives, and environmental conservation education.",
      icon: <Leaf size={32} className="text-white" />,
      color: "bg-green-500"
    },
    {
      title: "Youth Leadership",
      description: "Developing the next generation of leaders through mentorship, training, and youth-led community initiatives.",
      icon: <BookOpen size={32} className="text-white" />,
      color: "bg-foundation-accent"
    },
  ];

  return (
    <section id="programs" className="section-container bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h5 className="text-foundation-accent font-semibold mb-2">What We Do</h5>
          <h2 className="section-title mx-auto">Our Programs & Initiatives</h2>
          <p className="text-gray-700">
            Through our targeted programs, we address critical needs in education, healthcare, community 
            development, women empowerment, and environmental sustainability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <ProgramCard
              key={index}
              title={program.title}
              description={program.description}
              icon={program.icon}
              color={program.color}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Programs;
