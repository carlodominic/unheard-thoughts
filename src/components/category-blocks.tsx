import { Brain, MessageSquare, Eye } from "lucide-react";
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
          Explore Tools
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
      title: "Unspoken Thoughts",
      description:
        "Templates to articulate hidden emotions and internal conflicts",
      icon: <Brain className="h-6 w-6" />,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      link: "#unsaid-thoughts-tools", 
    },
    {
      title: "Silent Signals",
      description:
        "Guides to decode body language, tone, and digital communication cues",
      icon: <Eye className="h-6 w-6" />,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      link: "#silent-signal-guides", 
    },
    {
      title: "Digital Expression",
      description:
        "Creative tools for conveying complex feelings through emojis, texts, and media",
      icon: <MessageSquare className="h-6 w-6" />,
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      link: "#digital-expression-kits", 
    },
  ];

  return (
    <section className="py-16 bg-gray-50" id="tools">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Express What Goes Unsaid</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover frameworks and templates to transform silent struggles into meaningful dialogue.
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