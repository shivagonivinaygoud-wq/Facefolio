
-- Create user profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create groups table
CREATE TABLE public.groups (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  cover_photo_url text,
  created_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create group members table
CREATE TABLE public.group_members (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone_number text,
  profile_picture_url text,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create photos table
CREATE TABLE public.photos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size integer,
  mime_type text,
  detected_faces jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create a trigger function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  );
  RETURN new;
END;
$$;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for groups
CREATE POLICY "Users can view all groups" ON public.groups
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can create groups" ON public.groups
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group creators can update their groups" ON public.groups
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Group creators can delete their groups" ON public.groups
  FOR DELETE USING (auth.uid() = created_by);

-- Create RLS policies for group members
CREATE POLICY "Users can view group members" ON public.group_members
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_members.group_id
    )
  );

CREATE POLICY "Group creators can manage members" ON public.group_members
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = group_members.group_id 
      AND groups.created_by = auth.uid()
    )
  );

-- Create RLS policies for photos
CREATE POLICY "Users can view photos in groups" ON public.photos
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.groups 
      WHERE groups.id = photos.group_id
    )
  );

CREATE POLICY "Users can upload photos" ON public.photos
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Photo uploaders can update their photos" ON public.photos
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Photo uploaders can delete their photos" ON public.photos
  FOR DELETE USING (auth.uid() = uploaded_by);

-- Create storage bucket for photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('photos', 'photos', true);

-- Create storage policies for photos bucket
CREATE POLICY "Anyone can view photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'photos');

CREATE POLICY "Authenticated users can upload photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Users can update their own photos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]
  );
