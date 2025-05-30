import Navbar from "@/components/navbar";
import PostList from "@/components/post-list";
import { InfoIcon, UserCircle, PlusIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user's posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
  }

  return (
    <>
      <Navbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <Link href="/dashboard/create-post">
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Content
                </Button>
              </Link>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>
                Welcome to your content dashboard. Create and manage your
                content here.
              </span>
            </div>
          </header>

          {/* Content Management Section */}
          <section className="bg-card rounded-xl p-6 border shadow-sm">
            <PostList posts={posts || []} />
          </section>

        </div>
      </main>
    </>
  );
}
