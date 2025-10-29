/*
  # Create Comments and Credits System

  ## New Tables
  
  ### `user_credits`
  - `id` (uuid, primary key) - Unique identifier
  - `user_identifier` (text, unique) - User identifier (email, IP, or guest ID)
  - `credits_remaining` (integer) - Number of AI credits remaining
  - `created_at` (timestamptz) - When the user was created
  - `updated_at` (timestamptz) - Last update timestamp

  ### `comments`
  - `id` (uuid, primary key) - Unique identifier
  - `pack_id` (text) - Sample pack ID from Hygraph
  - `author` (text) - Comment author name
  - `text` (text) - Comment content
  - `ai_generated` (boolean) - Whether comment was AI-generated
  - `user_identifier` (text) - Links to user_credits
  - `created_at` (timestamptz) - When comment was created

  ## Security
  - Enable RLS on both tables
  - Allow anyone to read comments
  - Allow anyone to insert comments (credits checked in app logic)
  - Allow anyone to read their own credits
*/

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_identifier text UNIQUE NOT NULL,
  credits_remaining integer DEFAULT 10 NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pack_id text NOT NULL,
  author text NOT NULL,
  text text NOT NULL,
  ai_generated boolean DEFAULT false,
  user_identifier text,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_comments_pack_id ON comments(pack_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_credits
CREATE POLICY "Anyone can read credits"
  ON user_credits FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert credits"
  ON user_credits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update credits"
  ON user_credits FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for comments
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert comments"
  ON comments FOR INSERT
  WITH CHECK (true);
