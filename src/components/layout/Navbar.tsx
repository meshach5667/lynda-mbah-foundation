
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import DonateButton from '@/components/ui/DonateButton';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Programs', path: '/#programs' },
    { name: 'Impact', path: '/#impact' },
    { name: 'Team', path: '/#team' },
    { name: 'News', path: '/#news' },
    { name: 'Contact', path: '/#contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={cn(
      "fixed w-full z-50 transition-all duration-300",
      scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
    )}>
      <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-foundation-primary">Lynda Mbah</span>
          <span className="text-xl font-medium text-foundation-secondary">Foundation</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.path}
                  className="text-gray-700 hover:text-foundation-primary font-medium transition-colors duration-200"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          <DonateButton />
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-gray-700" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden ${isOpen ? 'block' : 'hidden'} bg-white shadow-lg absolute w-full`}>
        <div className="container mx-auto px-4 py-4">
          <ul className="space-y-4">
            {navItems.map((item) => (
              <li key={item.name} className="border-b border-gray-100 pb-2">
                <a 
                  href={item.path}
                  className="text-gray-700 hover:text-foundation-primary font-medium transition-colors duration-200 block"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <DonateButton className="w-full" />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
