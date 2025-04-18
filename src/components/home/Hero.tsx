import { ArrowRight } from 'lucide-react';
import DonateButton from '@/components/ui/DonateButton';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DonationForm from '@/components/donation/DonationForm';

const Hero = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);

  return (
    <section className="relative h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80")',
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl text-white">
          <h5 className="text-foundation-accent font-semibold mb-2 opacity-0 animate-fade-in" style={{animationDelay: '0.2s'}}>
            Making a difference together
          </h5>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 opacity-0 animate-fade-in" style={{animationDelay: '0.4s'}}>
            Empowering Communities for a Better Tomorrow
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-0 animate-fade-in" style={{animationDelay: '0.6s'}}>
            The Lynda Mbah Foundation is dedicated to sustainable development, education, 
            healthcare, and community empowerment across underserved regions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in" style={{animationDelay: '0.8s'}}>
            <DonateButton size="lg" onClick={() => setShowDonateModal(true)} />
            <a 
              href="#about"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300"
            >
              Learn More
              <ArrowRight size={20} className="ml-2" />
            </a>
          </div>
        </div>
      </div>

      <Dialog open={showDonateModal} onOpenChange={setShowDonateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl mb-4">
              Make a Donation
            </DialogTitle>
          </DialogHeader>
          <DonationForm 
            onSuccess={() => setShowDonateModal(false)} 
          />
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default Hero;
