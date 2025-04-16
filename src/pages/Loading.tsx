
import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-foundation-primary text-white">
      <div className="text-center space-y-6">
        <div className="flex justify-center mb-6">
          <Loader2 
            className="animate-spin text-white" 
            size={64} 
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 animate-pulse">
          Lynda Mbah Foundation
        </h1>
        <p className="text-xl animate-fade-in">
          Empowering Communities, Transforming Lives
        </p>
      </div>
    </div>
  );
};

export default Loading;
