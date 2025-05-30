import Link from "next/link";
import {
  ArrowUpRight,
  HeartHandshake,
  BookOpen,
  Eye,
  FileText,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            {/* ✅ Wrap the heading in a flex container for perfect centering */}
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-5xl sm:text-4.5xl font-bold text-gray-900 mb-8 tracking-tight text-center">
                Unheard
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Thoughts:
                </span>{" "}
                Your Voice
              </h1>
            </div>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
              Your Story Turn whispers into words and ideas into impact.
              Write, share, and connect with the world through a platform built for those who have something meaningful to say.
            </p>

            {/* Buttons and other content remain unchanged */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
              >
                Start Expressing
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#templates"
                className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium"
              >
                View Templates
              </Link>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Expressing Hidden Thoughts</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-500" />
                <span>Decoding Emotional Signals</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-blue-500" />
                <span>Navigating Silent Conversations</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
