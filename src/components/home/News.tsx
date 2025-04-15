
import { ArrowRight, Calendar, User } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  category: string;
  slug: string;
}

const NewsCard = ({ title, excerpt, image, date, author, category, slug }: NewsCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-foundation-accent text-white text-sm font-semibold py-1 px-3 rounded">
          {category}
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{author}</span>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2 line-clamp-2 hover:text-foundation-primary transition-colors">
          <a href={`/news/${slug}`}>{title}</a>
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <a 
          href={`/news/${slug}`} 
          className="inline-flex items-center font-medium text-foundation-primary hover:text-foundation-dark"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </a>
      </div>
    </div>
  );
};

const News = () => {
  const newsItems: NewsCardProps[] = [
    {
      title: "New School Building Completed in Rural Community",
      excerpt: "We are thrilled to announce the completion of a new school building that will serve over 300 children in a rural community.",
      image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80",
      date: "June 15, 2023",
      author: "Admin",
      category: "Education",
      slug: "new-school-building"
    },
    {
      title: "Healthcare Initiative Reaches 10,000 Beneficiaries",
      excerpt: "Our healthcare initiative has successfully reached a milestone of serving 10,000 people with essential medical services.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      date: "May 22, 2023",
      author: "Admin",
      category: "Healthcare",
      slug: "healthcare-milestone"
    },
    {
      title: "Women Empowerment Workshop Series Launches",
      excerpt: "We're launching a series of workshops aimed at providing skills training and entrepreneurship support for women in underserved communities.",
      image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      date: "April 10, 2023",
      author: "Admin",
      category: "Women Empowerment",
      slug: "women-empowerment-workshop"
    },
  ];

  return (
    <section id="news" className="section-container bg-white">
      <div className="container mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h5 className="text-foundation-accent font-semibold mb-2">Latest News</h5>
          <h2 className="section-title mx-auto">Our Impact Stories</h2>
          <p className="text-gray-700">
            Stay updated with our latest news, stories, and impacts from the communities we serve.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <NewsCard key={item.slug} {...item} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a 
            href="/news" 
            className="inline-flex items-center justify-center px-6 py-3 text-foundation-primary border-2 border-foundation-primary rounded-full hover:bg-foundation-primary hover:text-white transition-colors duration-300"
          >
            View All News
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default News;
