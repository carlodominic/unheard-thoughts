import DashboardNavbar from "@/components/dashboard-navbar";
import PostForm from "@/components/post-form";
import { redirect } from "next/navigation";
import { createClient } from "../../../../supabase/server";

export default async function CreatePost() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Create New Content</h1>
          <div className="bg-card rounded-xl p-6 border shadow-sm">
            <PostForm mode="create" />
          </div>
        </div>
      </main>
    </>
  );
}
