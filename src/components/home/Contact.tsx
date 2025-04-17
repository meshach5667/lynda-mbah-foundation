import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const Contact = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message
          }
        ]);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond shortly.",
        duration: 5000,
      });
      
      setFormSubmitted(true);
      
      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset the form submitted state after a delay
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="contact" className="section-container bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h5 className="text-foundation-accent font-semibold mb-2">Get in Touch</h5>
          <h2 className="section-title mx-auto">Contact Us</h2>
          <p className="text-gray-700">
            Have questions or want to get involved? Reach out to us through any of the channels below 
            or fill out the contact form.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow-lg p-8 order-2 lg:order-1">
            <h3 className="text-xl font-bold text-foundation-primary mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-foundation-light rounded-full p-3">
                  <MapPin className="text-foundation-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Address</h4>
                  <p className="text-gray-600">123 Foundation Way,<br />City, State 12345</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-foundation-light rounded-full p-3">
                  <Phone className="text-foundation-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">+ (234) 456-7890-9821</p>
                  <p className="text-gray-600">+ (234) 456-7890-9821</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-foundation-light rounded-full p-3">
                  <Mail className="text-foundation-primary h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">info@lyndambah.org</p>
                  <p className="text-gray-600">support@lyndambah.org</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 order-1 lg:order-2">
            <h3 className="text-xl font-bold text-foundation-primary mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-foundation-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-foundation-primary"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-foundation-primary"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-foundation-primary"
                  required
                  disabled={isSubmitting}
                ></textarea>
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-foundation-primary hover:bg-foundation-dark text-white font-bold py-3 rounded-md flex justify-center items-center space-x-2"
                disabled={isSubmitting}
              >
                {formSubmitted ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span>Message Sent!</span>
                  </>
                ) : isSubmitting ? (
                  <>
                    <span className="mr-2 animate-spin">●</span>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    <span>Send Message</span>
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
