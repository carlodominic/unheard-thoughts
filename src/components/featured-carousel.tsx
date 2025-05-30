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


  const featuredItems: FeaturedItem[] = [
    {
      id: 1,
      title: "Decoding Unspoken Communication: 10 Signs People Hide Their True Feelings",
      category: "Psychology",
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      excerpt:
        "Learn how to recognize subtle cues in body language, tone, and silence that reveal unspoken thoughts.",
      slug: "#",   
    },
    {
      id: 2,
      title: "Silent Minds: Why We Keep Thoughts to Ourselves (and How to Break the Cycle)",
      category: "Self-Development",
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      excerpt:
        "Explore the psychology behind internal barriers to expression and practical strategies to overcome them.",
      slug: "#",   
    },
    {
      id: 3,
      title: "The Language of Emojis: Modern Tools for Expressing Unsayable Thoughts",
      category: "Digital Culture",
      image:
        "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=800&q=80",
      excerpt:
        "How digital communication is reshaping emotional expression in the age of unsaid conversations.",
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
