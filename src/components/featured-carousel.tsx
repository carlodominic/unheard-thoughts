"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

interface FeaturedItem {
  id: number;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  slug: string;
}

export default function FeaturedCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample featured content
  const featuredItems: FeaturedItem[] = [
    {
      id: 1,
      title: "10 SEO Strategies That Actually Work in 2023",
      category: "SEO Guide",
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      excerpt:
        "Learn the latest SEO techniques that are driving real results for content creators.",
      slug: "#",
    },
    {
      id: 2,
      title: "WordPress vs. Headless CMS: A Complete Comparison",
      category: "Comparison",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      excerpt:
        "Discover which content management system is right for your publishing needs.",
      slug: "#",
    },
    {
      id: 3,
      title: "The Ultimate Guide to Content Monetization",
      category: "Guide",
      image:
        "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=800&q=80",
      excerpt:
        "Explore multiple revenue streams for your content business with this comprehensive guide.",
      slug: "#",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === featuredItems.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? featuredItems.length - 1 : prevIndex - 1,
    );
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden bg-white py-12" id="featured">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Content</h2>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {featuredItems.map((item) => (
              <div key={item.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg flex flex-col md:flex-row">
                  <div className="md:w-1/2 h-64 md:h-auto relative">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <div className="md:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-gray-600 mb-6">{item.excerpt}</p>
                    </div>
                    <Link
                      href={item.slug}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800"
                    >
                      Read More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {featuredItems.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 w-2 rounded-full ${index === currentIndex ? "bg-blue-600" : "bg-gray-300"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
