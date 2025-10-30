/*
  # Remove Comments Table, Keep Credits

  ## Changes
  - Drop the comments table (we'll use GraphQL API instead)
  - Keep the user_credits table for tracking AI generation credits
  
  ## Tables Affected
  - Drop `comments` table and its policies
  - Keep `user_credits` table unchanged
*/

-- Drop comments table policies first
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
DROP POLICY IF EXISTS "Anyone can insert comments" ON comments;

-- Drop the comments table
DROP TABLE IF EXISTS comments;
