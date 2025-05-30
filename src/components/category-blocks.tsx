import { BookOpen, BarChart2, FileText } from "lucide-react";
import Link from "next/link";

interface CategoryProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: string;
  link: string;
}

const Category = ({ title, description, icon, image, link }: CategoryProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl shadow-md transition-all hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10" />
      <img
        src={image}
        alt={title}
        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 z-20 p-6 flex flex-col justify-end text-white">
        <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-white/80 mb-4">{description}</p>
        <Link
          href={link}
          className="inline-flex items-center text-sm font-medium text-white hover:text-blue-200 transition-colors"
        >
          Explore Templates
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default function CategoryBlocks() {
  const categories = [
    {
      title: "Blog Posts",
      description: "Templates for engaging blog content",
      icon: <BookOpen className="h-6 w-6" />,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      link: "#blog-templates",
    },
    {
      title: "Comparison Ideas",
      description: "Side-by-side comparison templates",
      icon: <BarChart2 className="h-6 w-6" />,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      link: "#comparison-templates",
    },
    {
      title: "Comprehensive Guides",
      description: "In-depth guide templates with rich schema markup",
      icon: <FileText className="h-6 w-6" />,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      link: "#guide-templates",
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="templates">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Customize How You Express</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our library of pre-designed  templates to
            create content in your own taste.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Category key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
}
