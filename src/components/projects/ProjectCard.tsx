
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Heart, Goal, Calendar } from 'lucide-react';
import DonationForm from '@/components/donation/DonationForm';

export interface ProjectProps {
  id: string;
  title: string;
  description: string;
  image: string;
  target: number;
  raised: number;
  endDate: string;
  category: string;
}

const ProjectCard = ({ id, title, description, image, target, raised, endDate, category }: ProjectProps) => {
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  
  const progress = Math.min(100, Math.round((raised / target) * 100));
  const formattedTarget = target.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const formattedRaised = raised.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  
  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <span className="bg-foundation-accent/20 text-foundation-primary text-xs font-medium px-2.5 py-0.5 rounded">
              {category}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              <span>Ends: {endDate}</span>
            </div>
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription className="line-clamp-2">{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Progress</span>
              <span className="font-bold text-foundation-primary">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-foundation-primary h-2.5 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span>Raised: <span className="font-bold">{formattedRaised}</span></span>
              <span>Goal: <span className="font-bold">{formattedTarget}</span></span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            className="w-full bg-foundation-primary hover:bg-foundation-dark flex items-center justify-center"
            onClick={() => setShowDonateDialog(true)}
          >
            <Heart size={18} className="mr-2" />
            Donate Now
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl mb-4">Donate to {title}</DialogTitle>
          </DialogHeader>
          <DonationForm 
            projectId={id} 
            projectName={title}
            onSuccess={() => setShowDonateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
