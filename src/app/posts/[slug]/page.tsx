import { createClient } from "../../../../supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

// Define types for better type safety
interface Category {
  name: string;
  slug: string;
}

interface User {
  name: string;
  full_name: string | null;
  email: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  published: boolean;
  featured_image: string | null;
  published_at: string | null;
  created_at: string;
  content_type: string;
  users: User;
}

// ✅ Updated type: params is now a Promise
type Props = {
  params: Promise<{ slug: string }>;
};

// ✅ Resolve params in generateMetadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; // ✅ Resolve the Promise
  const supabase = await createClient();

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single() as { data: Pick<Post, "title" | "excerpt"> | null };

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on our platform.`,
  };
}

// ✅ Resolve params in the component
export default async function PostPage({ params }: Props) {
  const { slug } = await params; // ✅ Resolve the Promise
  const supabase = await createClient();

  // Fetch the post using resolved slug
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      users!inner(name, full_name, email)
    `)
    .eq("slug", slug)
    .eq("published", true)
    .single() as { data: Post | null; error: any };

  if (error || !post) {
    notFound();
  }

  // Fetch post categories with proper typing
  const { data: postCategories } = await supabase
    .from("post_categories")
    .select(`
      categories!inner(name, slug)
    `)
    .eq("post_id", post.id) as { data: { categories: Category }[] | null };

  const categories = postCategories?.map((pc) => pc.categories) || [];

  // Format the date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get author name
  const authorName =
    post.users.full_name || post.users.name || post.users.email;

  // Format content type
  const contentTypeLabel = ({
    blog: "Blog Post",
    guide: "Guide",
    comparison: "Comparison",
  } as Record<string, string>)[post.content_type] || post.content_type;

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        {post.featured_image && (
          <div className="mb-6 rounded-lg overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 gap-x-4 gap-y-2">
          <div>By {authorName}</div>
          <div>•</div>
          <div>{formatDate(post.published_at || post.created_at)}</div>
          <div>•</div>
          <div>{contentTypeLabel}</div>

          {categories.length > 0 && (
            <div className="flex items-center gap-2 ml-auto">
              <span>Categories:</span>
              <div className="flex flex-wrap gap-1">
                {categories.map((category: Category, index: number) => (
                  <span
                    key={index}
                    className="bg-secondary/50 px-2 py-0.5 rounded-full text-xs"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {post.excerpt && (
          <div className="bg-muted/30 p-4 rounded-lg mb-6 italic text-muted-foreground">
            {post.excerpt}
          </div>
        )}
      </div>

      <article className="prose prose-sm sm:prose lg:prose-lg mx-auto dark:prose-invert">
        {post.content
          .split("\n")
          .map((paragraph: string, index: number) =>
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />,
          )}
      </article>
    </main>
  );
}