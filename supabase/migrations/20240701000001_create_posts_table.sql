-- Create posts table for storing user content
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    published BOOLEAN DEFAULT false,
    content_type TEXT NOT NULL DEFAULT 'blog',
    author_id UUID NOT NULL REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Add RLS policies for posts
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
DO $$
BEGIN
    -- Policy for users to read published posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'posts' 
        AND policyname = 'Anyone can read published posts'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can read published posts" ON public.posts
                FOR SELECT USING (published = true)';
    END IF;

    -- Policy for users to read their own posts (published or not)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'posts' 
        AND policyname = 'Users can read own posts'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can read own posts" ON public.posts
                FOR SELECT USING (auth.uid() = author_id)';
    END IF;

    -- Policy for users to insert their own posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'posts' 
        AND policyname = 'Users can insert own posts'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can insert own posts" ON public.posts
                FOR INSERT WITH CHECK (auth.uid() = author_id)';
    END IF;

    -- Policy for users to update their own posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'posts' 
        AND policyname = 'Users can update own posts'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can update own posts" ON public.posts
                FOR UPDATE USING (auth.uid() = author_id)';
    END IF;

    -- Policy for users to delete their own posts
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'posts' 
        AND policyname = 'Users can delete own posts'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can delete own posts" ON public.posts
                FOR DELETE USING (auth.uid() = author_id)';
    END IF;
END
$$;

-- Enable realtime for posts
alter publication supabase_realtime add table posts;

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add RLS policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
DO $$
BEGIN
    -- Policy for anyone to read categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'categories' 
        AND policyname = 'Anyone can read categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can read categories" ON public.categories
                FOR SELECT USING (true)';
    END IF;
END
$$;

-- Create post_categories junction table
CREATE TABLE IF NOT EXISTS public.post_categories (
    post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add RLS policies for post_categories
ALTER TABLE public.post_categories ENABLE ROW LEVEL SECURITY;

-- Create policies for post_categories
DO $$
BEGIN
    -- Policy for anyone to read post_categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'post_categories' 
        AND policyname = 'Anyone can read post_categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Anyone can read post_categories" ON public.post_categories
                FOR SELECT USING (true)';
    END IF;

    -- Policy for users to insert their own post_categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'post_categories' 
        AND policyname = 'Users can insert own post_categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can insert own post_categories" ON public.post_categories
                FOR INSERT WITH CHECK (
                    EXISTS (
                        SELECT 1 FROM public.posts
                        WHERE id = post_id AND author_id = auth.uid()
                    )
                )';
    END IF;

    -- Policy for users to delete their own post_categories
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'post_categories' 
        AND policyname = 'Users can delete own post_categories'
    ) THEN
        EXECUTE 'CREATE POLICY "Users can delete own post_categories" ON public.post_categories
                FOR DELETE USING (
                    EXISTS (
                        SELECT 1 FROM public.posts
                        WHERE id = post_id AND author_id = auth.uid()
                    )
                )';
    END IF;
END
$$;

-- Enable realtime for post_categories
alter publication supabase_realtime add table post_categories;

-- Insert some default categories
INSERT INTO public.categories (name, slug, description)
VALUES 
('Blog', 'blog', 'Regular blog posts'),
('Guide', 'guide', 'Detailed guides and tutorials'),
('Comparison', 'comparison', 'Product or service comparisons')
ON CONFLICT (slug) DO NOTHING;