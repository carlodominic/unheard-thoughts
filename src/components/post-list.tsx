"use client";

import { Button } from "@/components/ui/button";
import { deletePostAction } from "@/app/actions";
import Link from "next/link";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PenIcon, TrashIcon, EyeIcon, PlusIcon } from "lucide-react";

type Post = {
  id: string;
  title: string;
  content: string;
  excerpt?: string | null;
  featured_image?: string | null;
  published: boolean;
  content_type: string;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
  slug: string;
};

type PostListProps = {
  posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case "blog":
        return "Blog Post";
      case "guide":
        return "Guide";
      case "comparison":
        return "Comparison";
      default:
        return type;
    }
  };

  const getContentTypeBadgeClass = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-blue-100 text-blue-800";
      case "guide":
        return "bg-green-100 text-green-800";
      case "comparison":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Content</h2>
        <Link href="/dashboard/create-post">
          <Button size="sm">
            <PlusIcon className="h-4 w-4 mr-1" />
            Create New
          </Button>
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg">
          <p className="text-muted-foreground">
            You haven't created any content yet.
          </p>
          <Link href="/dashboard/create-post">
            <Button variant="link" className="mt-2">
              Create your first post
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border rounded-lg p-4 bg-card">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg">{post.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getContentTypeBadgeClass(post.content_type)}`}
                    >
                      {getContentTypeLabel(post.content_type)}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${post.published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    {post.published ? (
                      <span>
                        Published:{" "}
                        {post.published_at
                          ? formatDate(post.published_at)
                          : formatDate(post.created_at)}
                      </span>
                    ) : (
                      <span>Last updated: {formatDate(post.updated_at)}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {post.published && (
                    <Link href={`/posts/${post.slug}`} target="_blank">
                      <Button size="sm" variant="ghost">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                  <Link href={`/dashboard/edit-post/${post.id}`}>
                    <Button size="sm" variant="ghost">
                      <PenIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog
                    open={postToDelete === post.id}
                    onOpenChange={(open) => !open && setPostToDelete(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPostToDelete(post.id)}
                      >
                        <TrashIcon className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Content</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <form action={deletePostAction}>
                          <input type="hidden" name="id" value={post.id} />
                          <AlertDialogAction
                            type="submit"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
