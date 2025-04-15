
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-foundation-dark text-white">
      <div className="container mx-auto py-16 px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Lynda Mbah Foundation</h3>
            <p className="text-gray-300 mb-4">
              Dedicated to improving lives through sustainable development, education, 
              healthcare, and community empowerment.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-foundation-accent transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-foundation-accent transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white hover:text-foundation-accent transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-foundation-accent transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/#about" className="text-gray-300 hover:text-foundation-accent transition-colors">About Us</a>
              </li>
              <li>
                <a href="/#programs" className="text-gray-300 hover:text-foundation-accent transition-colors">Our Programs</a>
              </li>
              <li>
                <a href="/#team" className="text-gray-300 hover:text-foundation-accent transition-colors">Our Team</a>
              </li>
              <li>
                <a href="/#news" className="text-gray-300 hover:text-foundation-accent transition-colors">Latest News</a>
              </li>
              <li>
                <a href="/#contact" className="text-gray-300 hover:text-foundation-accent transition-colors">Contact Us</a>
              </li>
            </ul>
          </div>
          
          {/* Programs */}
          <div>
            <h3 className="text-xl font-bold mb-4">Programs</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-foundation-accent transition-colors">Education Access</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-foundation-accent transition-colors">Healthcare Initiatives</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-foundation-accent transition-colors">Community Development</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-foundation-accent transition-colors">Women Empowerment</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-foundation-accent transition-colors">Youth Leadership</a>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={20} className="text-foundation-accent mt-1" />
                <span className="text-gray-300">123 Foundation Way,<br />City, State 12345</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={20} className="text-foundation-accent" />
                <span className="text-gray-300">+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={20} className="text-foundation-accent" />
                <a href="mailto:info@lyndambah.org" className="text-gray-300 hover:text-foundation-accent transition-colors">info@lyndambah.org</a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} Lynda Mbah Foundation. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex items-center text-gray-400 text-sm">
            <span>Made with</span>
            <Heart size={16} className="mx-1 text-foundation-accent" />
            <span>for a better world</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
