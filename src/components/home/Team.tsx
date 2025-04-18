import { Facebook, Twitter, Linkedin } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const TeamMember = ({ name, role, image, bio, socialLinks }: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2">
      <div className="h-64 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <p className="text-foundation-primary font-medium mb-3">{role}</p>
        <p className="text-gray-600 mb-4 line-clamp-3">{bio}</p>
        <div className="flex space-x-3">
          {socialLinks.facebook && (
            <a 
              href={socialLinks.facebook} 
              className="text-gray-400 hover:text-foundation-accent transition-colors"
              aria-label={`${name}'s Facebook`}
            >
              <Facebook size={18} />
            </a>
          )}
          {socialLinks.twitter && (
            <a 
              href={socialLinks.twitter} 
              className="text-gray-400 hover:text-foundation-accent transition-colors"
              aria-label={`${name}'s Twitter`}
            >
              <Twitter size={18} />
            </a>
          )}
          {socialLinks.linkedin && (
            <a 
              href={socialLinks.linkedin} 
              className="text-gray-400 hover:text-foundation-accent transition-colors"
              aria-label={`${name}'s LinkedIn`}
            >
              <Linkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const Team = () => {
  const teamMembers: TeamMemberProps[] = [
    {
      name: "Lynda Mbah",
      role: "Founder & President",
      image: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      bio: "With several years of experience in community development, Lynda founded the organization with a vision to create sustainable change.",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "James Wilson",
      role: "Executive Director",
      image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      bio: "James brings extensive experience in nonprofit management and has been leading our operations for the past 7 years.",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Sarah Johnson",
      role: "Programs Director",
      image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      bio: "Sarah oversees our program implementation and has a background in international development and public health.",
      socialLinks: {
        facebook: "#",
        twitter: "#",
        linkedin: "#"
      }
    },
    {
      name: "Michael Chen",
      role: "Finance Director",
      image: "https://images.unsplash.com/photo-1507152832244-10d45c7eda57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2074&q=80",
      bio: "Michael manages our financial operations, ensuring accountability and transparency in all our financial activities.",
      socialLinks: {
        twitter: "#",
        linkedin: "#"
      }
    },
  ];

  return (
    <section id="team" className="section-container bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h5 className="text-foundation-accent font-semibold mb-2">Our Team</h5>
          <h2 className="section-title mx-auto">Meet Our Leadership</h2>
          <p className="text-gray-700">
            Our dedicated team brings together diverse expertise and a shared passion for 
            community development and social impact.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member) => (
            <TeamMember key={member.name} {...member} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
