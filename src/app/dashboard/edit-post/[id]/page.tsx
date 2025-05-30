import DashboardNavbar from "@/components/dashboard-navbar";
import PostForm from "@/components/post-form";
import { redirect } from "next/navigation";
import { createClient } from "../../../../../supabase/server";

export default async function EditPost({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch the post
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id)
    .eq("author_id", user.id)
    .single();

  if (error || !post) {
    return redirect("/dashboard");
  }

  // Fetch post categories
  const { data: postCategories } = await supabase
    .from("post_categories")
    .select("category_id")
    .eq("post_id", post.id);

  const categoryIds = postCategories?.map((pc) => pc.category_id) || [];

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Edit Content</h1>
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <PostForm
              mode="edit"
              post={{
                ...post,
                categories: categoryIds,
              }}
            />
          </div>
        </div>
      </main>
    </>
  );
}
