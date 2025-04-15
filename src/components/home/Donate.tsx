
import DonateButton from '@/components/ui/DonateButton';
import { ArrowRight } from 'lucide-react';

const Donate = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-foundation-primary to-foundation-dark rounded-xl overflow-hidden shadow-xl">
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
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Donate;
