
"use server";

import { encodedRedirect } from "@/utils/utils";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";
import { Database } from "@/types/supabase";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required",
    );
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        email: email,
      },
    },
  });

  console.log("After signUp", error);

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  }

  if (user) {
    try {
      const { error: updateError } = await supabase.from("users").insert({
        id: user.id,
        name: fullName,
        full_name: fullName,
        email: email,
        user_id: user.id,
        token_identifier: user.id,
        created_at: new Date().toISOString(),
      });

      if (updateError) {
        console.error("Error updating user profile:", updateError);
      }
    } catch (err) {
      console.error("Error in user profile creation:", err);
    }
  }

  return encodedRedirect(
    "success",
    "/sign-up",
    "Thanks for signing up! Please check your email for a verification link.",
  );
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

// Content management actions
export const createPostAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be logged in to create content",
    );
  }

  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const contentType = formData.get("contentType")?.toString() || "blog";
  const excerpt = formData.get("excerpt")?.toString();
  const featuredImage = formData.get("featuredImage")?.toString();
  const published = formData.get("published") === "true";
  const categoryIds = formData.getAll("categories").map((c) => c.toString());

  // Generate slug from title
  const slug =
    title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  if (!title || !content) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Title and content are required",
    );
  }

  // Insert post
  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      title,
      content,
      slug,
      excerpt,
      featured_image: featuredImage,
      published,
      content_type: contentType,
      author_id: user.id,
      published_at: published ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating post:", error);
    return encodedRedirect("error", "/dashboard", error.message);
  }

  // Add categories if provided
  if (categoryIds.length > 0 && post) {
    const categoryEntries = categoryIds.map((categoryId) => ({
      post_id: post.id,
      category_id: categoryId,
    }));

    const { error: categoryError } = await supabase
      .from("post_categories")
      .insert(categoryEntries);

    if (categoryError) {
      console.error("Error adding categories:", categoryError);
    }
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Content created successfully",
  );
};

export const updatePostAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be logged in to update content",
    );
  }

  const id = formData.get("id")?.toString();
  const title = formData.get("title")?.toString();
  const content = formData.get("content")?.toString();
  const contentType = formData.get("contentType")?.toString();
  const excerpt = formData.get("excerpt")?.toString();
  const featuredImage = formData.get("featuredImage")?.toString();
  const published = formData.get("published") === "true";
  const categoryIds = formData.getAll("categories").map((c) => c.toString());

  // Generate slug from title if title is provided
  let slug;
  if (title) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  if (!id) {
    return encodedRedirect("error", "/dashboard", "Post ID is required");
  }

  // Check if the post exists and belongs to the user
  const { data: existingPost, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .single();

  if (fetchError || !existingPost) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Post not found or you don't have permission to edit it",
    );
  }

  // Prepare update data
  const updateData: Database["public"]["Tables"]["posts"]["Update"] = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (slug) updateData.slug = slug;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (featuredImage !== undefined) updateData.featured_image = featuredImage;
  if (contentType) updateData.content_type = contentType;

  // Handle published status change
  if (published !== undefined) {
    updateData.published = published;
    // If publishing for the first time, set published_at
    if (published && !existingPost.published_at) {
      updateData.published_at = new Date().toISOString();
    }
  }

  // Update post
  const { error: updateError } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", id);

  if (updateError) {
    console.error("Error updating post:", updateError);
    return encodedRedirect("error", "/dashboard", updateError.message);
  }

  // Update categories if provided
  if (categoryIds.length > 0) {
    // First delete existing categories
    await supabase.from("post_categories").delete().eq("post_id", id);

    // Then add new categories
    const categoryEntries = categoryIds.map((categoryId) => ({
      post_id: id,
      category_id: categoryId,
    }));

    const { error: categoryError } = await supabase
      .from("post_categories")
      .insert(categoryEntries);

    if (categoryError) {
      console.error("Error updating categories:", categoryError);
    }
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Content updated successfully",
  );
};

export const deletePostAction = async (formData: FormData) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return encodedRedirect(
      "error",
      "/sign-in",
      "You must be logged in to delete content",
    );
  }

  const id = formData.get("id")?.toString();

  if (!id) {
    return encodedRedirect("error", "/dashboard", "Post ID is required");
  }

  // Check if the post exists and belongs to the user
  const { data: existingPost, error: fetchError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .single();

  if (fetchError || !existingPost) {
    return encodedRedirect(
      "error",
      "/dashboard",
      "Post not found or you don't have permission to delete it",
    );
  }

  // Delete post (post_categories will be deleted automatically due to CASCADE)
  const { error: deleteError } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Error deleting post:", deleteError);
    return encodedRedirect("error", "/dashboard", deleteError.message);
  }

  return encodedRedirect(
    "success",
    "/dashboard",
    "Content deleted successfully",
  );
};

export const getCategories = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data || [];
};
