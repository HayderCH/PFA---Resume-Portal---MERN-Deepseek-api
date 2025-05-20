
-- Create a storage bucket for CV uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'candidate-cvs',
  'Candidate CVs',
  true,
  5242880, -- 5MB limit
  '{application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,image/jpeg,image/png}'
);

-- Create policy to allow authenticated users to upload CV files
CREATE POLICY "Candidates can upload their own CVs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'candidate-cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow authenticated users to view their own CVs
CREATE POLICY "Candidates can view their own CVs"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'candidate-cvs' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public access to CVs (needed for CV URLs to work)
CREATE POLICY "CVs are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'candidate-cvs');
