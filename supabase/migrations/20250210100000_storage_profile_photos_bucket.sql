-- Storage: RLS policies for profile-photos bucket so uploads work.
-- The 400 + "new row violates row-level security policy" on upload is from storage.objects RLS.
-- Create the bucket in Dashboard first if needed: Storage > New bucket > name: profile-photos, Public: on.

-- RLS on storage.objects: allow authenticated users to upload to profile-photos
-- Restrict path to user's own folder: first segment of path = auth.uid()
DROP POLICY IF EXISTS "Authenticated users can upload to own profile-photos folder" ON storage.objects;
CREATE POLICY "Authenticated users can upload to own profile-photos folder"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'profile-photos'
    AND (storage.foldername(name))[1] = (SELECT auth.uid()::text)
  );

-- Allow authenticated users to read from profile-photos (for viewing photos)
DROP POLICY IF EXISTS "Authenticated users can read profile-photos" ON storage.objects;
CREATE POLICY "Authenticated users can read profile-photos"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'profile-photos');

-- Public read if bucket is public (anon can view photos via public URL)
DROP POLICY IF EXISTS "Public read profile-photos" ON storage.objects;
CREATE POLICY "Public read profile-photos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'profile-photos');

-- Allow users to update/delete their own objects in profile-photos (optional, for re-upload/delete)
DROP POLICY IF EXISTS "Users can update own profile-photos" ON storage.objects;
CREATE POLICY "Users can update own profile-photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'profile-photos' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'profile-photos' AND owner = auth.uid());

DROP POLICY IF EXISTS "Users can delete own profile-photos" ON storage.objects;
CREATE POLICY "Users can delete own profile-photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'profile-photos' AND owner = auth.uid());
