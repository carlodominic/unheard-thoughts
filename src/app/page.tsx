import Footer from "@/components/footer";
import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import FeaturedCarousel from "@/components/featured-carousel";
import CategoryBlocks from "@/components/category-blocks";
import {
  ArrowUpRight,
  Users,
  Eye,
  Brain,
  MessageSquare,
  HeartHandshake,
} from "lucide-react";
import { createClient } from "../../supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Featured Content Carousel */}
      <FeaturedCarousel />

      {/* Content Templates */}
      <CategoryBlocks />

      {/* Features Section */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Tools for Authentic Expression
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides users to express their hidden thoughts, navigate silent conversations, and create deeper human connections through emotionally intelligent communication.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Decode Hidden Emotions",
                description:
                  "Tools to identify subtle cues in body language, tone, and silence",
              },
              {
                icon: <Brain className="w-6 h-6" />,
                title: "Emotional Signal Mapping",
                description:
                  "Frameworks to interpret and respond to unspoken psychological signals",
              },
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Conversation Starters",
                description: "Pre-designed prompts for navigating difficult or silent discussions",
              },
              {
                icon: <HeartHandshake className="w-6 h-6" />,
                title: "Trust-Building Speed",
                description: "Instant frameworks for creating emotional safety in communication",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-blue-100">Expressed Thoughts</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-blue-100">Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">30M+</div>
              <div className="text-blue-100">Monthly Readers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Expression Community Section */}
      <section className="py-24 bg-white" id="join">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Connect with Emotional Voices
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Create an account to share your unspoken thoughts and join a community focused on authentic emotional expression.
            </p>
          </div>

          <div className="max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl shadow-md border border-blue-100">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <HeartHandshake className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-center">
                Free Registration
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-500 mr-2" />
                  <span>Share silent struggles safely</span>
                </li>
                <li className="flex items-center">
                  <Brain className="h-5 w-5 text-green-500 mr-2" />
                  <span>Tools for articulating complex emotions</span>
                </li>
                <li className="flex items-center">
                  <Eye className="h-5 w-5 text-green-500 mr-2" />
                  <span>Guides to decode hidden signals</span>
                </li>
                <li className="flex items-center">
                  <Users className="h-5 w-5 text-green-500 mr-2" />
                  <span>Supportive network anywhere</span>
                </li>
              </ul>
              <div className="pt-4">
                <a
                  href="/sign-up"
                  className="block text-center py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full"
                >
                  Share Your Story
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Hidden Stories Section */}
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Discover Unsaid Narratives
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Explore personal journeys, emotional breakthroughs, and guides for navigating silent conversations from our community.
        </p>
        <a
          href="/posts"
          className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Read Hidden Stories
          <ArrowUpRight className="ml-2 w-4 h-4" />
        </a>
      </div>
    </section>

      <Footer />
    </div>
  );
}
