"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/components/submit-button";
import { useState, useEffect } from "react";
import {
  createPostAction,
  updatePostAction,
  getCategories,
} from "@/app/actions";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type PostFormProps = {
  post?: {
    id: string;
    title: string;
    content: string;
    excerpt?: string | null;
    featured_image?: string | null;
    published: boolean;
    content_type: string;
    categories?: string[];
  };
  mode: "create" | "edit";
};

export default function PostForm({ post, mode }: PostFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.categories || [],
  );
  const [contentType, setContentType] = useState<string>(
    post?.content_type || "blog",
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId),
      );
    }
  };

  return (
    <form
      action={mode === "create" ? createPostAction : updatePostAction}
      className="space-y-6"
    >
      {mode === "edit" && post && (
        <input type="hidden" name="id" value={post.id} />
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Enter title"
            defaultValue={post?.title || ""}
            required
          />
        </div>

        <div>
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            name="excerpt"
            placeholder="Brief summary of your content"
            defaultValue={post?.excerpt || ""}
            rows={2}
          />
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            name="content"
            placeholder="Write your content here..."
            defaultValue={post?.content || ""}
            required
            rows={10}
            className="min-h-[200px]"
          />
        </div>

        <div>
          <Label htmlFor="featuredImage">Featured Image URL</Label>
          <Input
            id="featuredImage"
            name="featuredImage"
            placeholder="https://example.com/image.jpg"
            defaultValue={post?.featured_image || ""}
          />
        </div>

        <div>
          <Label>Content Type</Label>
          <div className="flex space-x-4 mt-2">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="contentType"
                value="blog"
                checked={contentType === "blog"}
                onChange={() => setContentType("blog")}
                className="h-4 w-4"
              />
              <span>Blog Post</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="contentType"
                value="guide"
                checked={contentType === "guide"}
                onChange={() => setContentType("guide")}
                className="h-4 w-4"
              />
              <span>Guide</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="contentType"
                value="comparison"
                checked={contentType === "comparison"}
                onChange={() => setContentType("comparison")}
                className="h-4 w-4"
              />
              <span>Comparison</span>
            </label>
          </div>
        </div>

        <div>
          <Label>Categories</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {categories.map((category) => (
              <label key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  name="categories"
                  value={category.id}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked === true)
                  }
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="published"
            name="published"
            value="true"
            defaultChecked={post?.published || false}
          />
          <Label htmlFor="published">Publish immediately</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <SubmitButton>{mode === "create" ? "Create" : "Update"}</SubmitButton>
      </div>
    </form>
  );
}
