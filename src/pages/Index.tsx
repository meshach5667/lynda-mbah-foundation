
import { Helmet } from "react-helmet";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Programs from "@/components/home/Programs";
import Impact from "@/components/home/Impact";
import Donate from "@/components/home/Donate";
import Team from "@/components/home/Team";
import News from "@/components/home/News";
import Contact from "@/components/home/Contact";
import { ensureDemoProjects } from "@/lib/supabase";

const Index = () => {
  useEffect(() => {
    // Ensure demo projects exist when the home page loads
    ensureDemoProjects();
  }, []);

  return (
    <>
      <Helmet>
        <title>Lynda Mbah Foundation - Empowering Communities</title>
        <meta name="description" content="The Lynda Mbah Foundation is dedicated to sustainable development, education, healthcare, and community empowerment across underserved regions." />
      </Helmet>
      
      <Navbar />
      
      <main>
        <Hero />
        <About />
        <Programs />
        <Impact />
        <Donate />
        <Team />
        <News />
        <Contact />
      </main>
      
      <Footer />
    </>
  );
};

export default Index;
