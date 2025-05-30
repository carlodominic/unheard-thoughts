import { createClient } from "../../../supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  BookOpen,
  FileText,
  BarChart2,
  Search,
  Filter,
  Brain,
  Eye,
  HeartHandshake,
} from "lucide-react";

// Define types
interface User {
  name: string;
  full_name: string | null;
}

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content_type: string;
  published: boolean;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  users: User;
}

type GroupedPosts = Record<string, Post[]>;

export const metadata: Metadata = {
  title: "Unspoken Narratives | UnheardThoughts",
  description: "Explore hidden emotions and silent conversations through our community's authentic expressions.",
};

export default async function PostsPage() {
  const supabase = await createClient();

  // Fetch all published posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      users!inner(name, full_name)
    `,
    )
    .eq("published", true)
    .order("published_at", { ascending: false }) as { data: Post[] | null; error: any };

  if (error) {
    console.error("Error fetching posts:", error);
  }

  // Format the date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Group posts by content type
  const groupedPosts =
    posts?.reduce(
      (acc: GroupedPosts, post) => {
        const type = post.content_type;
        if (!acc[type]) acc[type] = [];
        acc[type].push(post);
        return acc;
      },
      {} as GroupedPosts,
    ) || {};

  // Content type labels and icons
  const contentTypeInfo: Record<string, { label: string; icon: JSX.Element }> = {
    blog: {
      label: "Expressing Hidden Thoughts",
      icon: <Brain className="h-5 w-5 text-blue-600" />,
    },
    guide: {
      label: "Decoding Emotional Signals",
      icon: <Eye className="h-5 w-5 text-green-600" />,
    },
    comparison: {
      label: "Navigating Silent Conversations",
      icon: <HeartHandshake className="h-5 w-5 text-purple-600" />,
    },
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Unspoken Narratives</h1>
            <p className="text-blue-100 max-w-2xl mx-auto">
              Explore hidden emotions, silent conversations, and tools for authentic self-expression from our community.
            </p>
          </div>
        </div>

        <main className="container mx-auto px-4 py-12 -mt-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-400" />
              <span className="text-gray-600">
                Explore unspoken stories and insights
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">Filter by theme:</span>
              <div className="flex gap-2">
                {Object.entries(contentTypeInfo).map(([type, info]) => (
                  <Link
                    key={type}
                    href={`#${type}`}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm transition-colors"
                  >
                    {info.icon}
                    <span>{info.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {Object.keys(groupedPosts).length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border">
              <div className="max-w-md mx-auto p-8">
                <div className="text-blue-600 mb-4">
                  <Brain className="h-12 w-12 mx-auto opacity-30" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">No Stories Yet</h2>
                <p className="text-muted-foreground mb-6">
                  Be the first to share your unspoken thoughts!
                </p>
                <Link href="/dashboard/create-post">
                  <Button>Share Your Story</Button>
                </Link>
              </div>
            </div>
          ) : (
            Object.entries(groupedPosts).map(([contentType, typePosts]) => (
              <section
                key={contentType}
                id={contentType}
                className="mb-16 scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6 border-b pb-3">
                  {contentTypeInfo[contentType]?.icon}
                  <h2 className="text-2xl font-semibold">
                    {contentTypeInfo[contentType]?.label || contentType}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typePosts.map((post) => {
                    const authorName =
                      post.users.full_name || post.users.name || "Anonymous";

                    return (
                      <Link href={`/posts/${post.slug}`} key={post.id}>
                        <div className="border rounded-lg overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow bg-white">
                          {post.featured_image ? (
                            <div className="h-48 overflow-hidden">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-48 bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                              {contentTypeInfo[post.content_type]?.icon ? (
                                <div className="h-16 w-16 opacity-30">
                                  {contentTypeInfo[post.content_type].icon}
                                </div>
                              ) : (
                                <Brain className="h-16 w-16 text-blue-200" />
                              )}
                            </div>
                          )}

                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                              {post.title}
                            </h3>

                            {post.excerpt && (
                              <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                                {post.excerpt}
                              </p>
                            )}

                            <div className="text-xs text-muted-foreground mt-auto pt-4 flex justify-between items-center border-t">
                              <span className="font-medium">{authorName}</span>
                              <span>
                                {formatDate(
                                  post.published_at || post.created_at,
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}