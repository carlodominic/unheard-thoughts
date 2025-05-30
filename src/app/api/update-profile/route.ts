import { createClient } from "../../../../supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { encodedRedirect } from "@/utils/utils";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be signed in to update your profile",
    );
  }

  const name = formData.get("name") as string;
  const full_name = formData.get("full_name") as string;
  const avatar_url = formData.get("avatar_url") as string;
  const bio = formData.get("bio") as string;

  // Update the user profile
  const { error } = await supabase
    .from("users")
    .update({
      name,
      full_name,
      avatar_url,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error);
    return encodedRedirect("error", "/profile", "Failed to update profile");
  }

  return encodedRedirect("success", "/profile", "Profile updated successfully");
}
