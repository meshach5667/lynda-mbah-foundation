
import { Check } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-container bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1576267423445-3ca38c0b5c3c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" 
                alt="Lynda Mbah Foundation Work" 
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-foundation-primary text-white p-6 rounded shadow-lg hidden md:block">
              <p className="text-4xl font-bold">10+</p>
              <p className="text-lg">Years of Impact</p>
            </div>
          </div>
          
          {/* Content */}
          <div>
            <h5 className="text-foundation-accent font-semibold mb-2">About Us</h5>
            <h2 className="section-title">Our Mission & Vision</h2>
            <p className="text-gray-700 mb-6">
              The Lynda Mbah Foundation is a non-profit organization committed to creating sustainable 
              change in underserved communities. We believe in empowering individuals through education, 
              healthcare, and economic opportunities to build resilient communities.
            </p>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foundation-primary mb-4">Our Core Values</h3>
              <ul className="space-y-3">
                {['Compassion', 'Integrity', 'Sustainability', 'Empowerment', 'Community'].map((value) => (
                  <li key={value} className="flex items-center">
                    <span className="bg-foundation-light rounded-full p-1 mr-3">
                      <Check size={16} className="text-foundation-primary" />
                    </span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-foundation-primary">
                <h4 className="text-lg font-semibold text-foundation-primary mb-2">Our Mission</h4>
                <p className="text-gray-700">
                  To empower communities through sustainable development initiatives that promote 
                  education, healthcare access, and economic opportunities.
                </p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-foundation-accent">
                <h4 className="text-lg font-semibold text-foundation-accent mb-2">Our Vision</h4>
                <p className="text-gray-700">
                  A world where all communities thrive with equal access to education, healthcare, 
                  and economic opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
