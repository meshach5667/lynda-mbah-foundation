
import { Users, Home, GraduationCap, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ImpactStatProps {
  icon: React.ReactNode;
  count: number;
  label: string;
}

const ImpactStat = ({ icon, count, label }: ImpactStatProps) => {
  const [displayCount, setDisplayCount] = useState(0);
  
  useEffect(() => {
    // Simple counter animation
    const duration = 2000; // ms
    const interval = 20; // ms
    const step = Math.max(1, Math.floor(count / (duration / interval)));
    
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current > count) {
        current = count;
        clearInterval(timer);
      }
      setDisplayCount(current);
    }, interval);
    
    return () => clearInterval(timer);
  }, [count]);
  
  return (
    <div className="text-center">
      <div className="bg-white rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4 shadow-lg">
        {icon}
      </div>
      <h3 className="text-3xl md:text-4xl font-bold mb-2 text-white">{displayCount.toLocaleString()}+</h3>
      <p className="text-white text-lg opacity-80">{label}</p>
    </div>
  );
};

const Impact = () => {
  return (
    <section id="impact" className="py-20 relative bg-foundation-primary">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="white" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h5 className="text-foundation-light font-semibold mb-2">Our Impact</h5>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Making a Difference</h2>
          <p className="text-white text-opacity-80">
            For over a decade, we've been working with communities to create lasting change. 
            Here's our impact in numbers.
          </p>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <ImpactStat
            icon={<Users size={32} className="text-foundation-primary" />}
            count={50000}
            label="Lives Impacted"
          />
          <ImpactStat
            icon={<Home size={32} className="text-foundation-primary" />}
            count={120}
            label="Communities Served"
          />
          <ImpactStat
            icon={<GraduationCap size={32} className="text-foundation-primary" />}
            count={5000}
            label="Scholarships Awarded"
          />
          <ImpactStat
            icon={<Heart size={32} className="text-foundation-primary" />}
            count={25}
            label="Active Projects"
          />
        </div>
      </div>
    </section>
  );
};

export default Impact;
