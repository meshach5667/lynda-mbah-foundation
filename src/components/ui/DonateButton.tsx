
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DonateButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
  children?: React.ReactNode;
  onClick?: () => void;
  projectId?: string;
  projectName?: string;
}

const DonateButton = ({
  className,
  size = 'md',
  variant = 'primary',
  children = 'Donate Now',
  onClick,
  projectId,
  projectName,
}: DonateButtonProps) => {
  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-3',
    lg: 'px-8 py-4 text-lg',
  };
  
  const variantClasses = {
    primary: 'bg-foundation-accent hover:bg-foundation-highlight text-white',
    secondary: 'bg-foundation-primary hover:bg-foundation-dark text-white',
    outline: 'bg-transparent border-2 border-foundation-accent text-foundation-accent hover:bg-foundation-accent hover:text-white',
  };
  
  return (
    <Button
      className={cn(
        'font-bold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      <Heart size={size === 'sm' ? 16 : 20} className="animate-pulse" />
      {children}
    </Button>
  );
};

export default DonateButton;
