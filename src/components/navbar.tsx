import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { BookOpen, Menu, X, FileText, Lightbulb } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-4 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        {/* Navbar Header */}
        <div className="flex items-center justify-between w-full md:w-auto mb-4 md:mb-0">
          <Link
            href="/"
            prefetch
            className="text-2xl font-bold text-blue-600 flex items-center"
          >
            <BookOpen className="mr-2 h-6 w-6" />
            Unheard Thoughts
          </Link>
          <button
            className="md:hidden text-gray-600 hover:text-blue-600"
            aria-label="Toggle menu"
            id="mobile-menu-button"
          >
            <Menu className="h-6 w-6 menu-icon" />
            <X className="h-6 w-6 close-icon hidden" />
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="/dashboard"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
            >
            Dashboard
          </Link>
          <Link
            href="/posts"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Browse Content
          </Link>
          <Link
            href="#features"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Features
          </Link>
          <Link
            href="#join"
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Join
          </Link>
        </div>

        {/* Desktop User Actions */}
        <div className="hidden md:flex gap-4 items-center">
          {user ? (
            <>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-100">
          <Link
            href="/posts"
            className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
          >
            Browse Content
          </Link>
          <Link
            href="#templates"
            className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
          >
            Templates
          </Link>
          <Link
            href="#features"
            className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
          >
            Features
          </Link>
          <Link
            href="#join"
            className="block py-2 text-gray-600 hover:text-blue-600 font-medium"
          >
            Join
          </Link>

          {user ? (
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <Link href="/dashboard" className="block py-2">
                <Button
                  variant="outline"
                  className="w-full border-blue-200 hover:bg-blue-50"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile" className="block py-2">
                <Button variant="ghost" className="w-full">
                  Profile
                </Button>
              </Link>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-100 flex flex-col space-y-2">
              <Link
                href="/sign-in"
                className="block py-2 text-center text-gray-700 hover:text-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="block py-2 text-center text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Updated Script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('mobile-menu-button').addEventListener('click', function() {
              const menu = document.getElementById('mobile-menu');
              menu.classList.toggle('hidden');
              
              const menuIcon = document.querySelector('.menu-icon');
              const closeIcon = document.querySelector('.close-icon');
              menuIcon.classList.toggle('hidden');
              closeIcon.classList.toggle('hidden');
            });
          `,
        }}
      />
    </nav>
  );
}