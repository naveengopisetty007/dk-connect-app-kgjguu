
# Supabase Setup Instructions for DK Connect

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project in Supabase

## Database Setup

### 1. Create Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  submission_type TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attachments table
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reactions table
CREATE TABLE reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id, reaction_type)
);

-- Create indexes for better performance
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_attachments_comment_id ON attachments(comment_id);
CREATE INDEX idx_reactions_comment_id ON reactions(comment_id);
CREATE INDEX idx_reactions_user_id ON reactions(user_id);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
CREATE POLICY "Users can view all comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for attachments
CREATE POLICY "Users can view all attachments" ON attachments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert attachments for their comments" ON attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM comments 
      WHERE comments.id = attachments.comment_id 
      AND comments.user_id = auth.uid()
    )
  );

-- Create policies for reactions
CREATE POLICY "Users can view all reactions" ON reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reactions" ON reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON reactions
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. Create Storage Bucket

1. Go to Storage in your Supabase dashboard
2. Create a new bucket named `attachments`
3. Set it to public or configure appropriate policies

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Get your Supabase URL and Anon Key from Project Settings > API
3. Update the values in `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Enable Email Authentication

1. Go to Authentication > Providers in Supabase
2. Enable Email provider
3. Configure email templates if needed

## Testing

1. Create a test user in Authentication > Users
2. Use the credentials to login to the app
3. Test creating comments and reactions

## Notes

- Make sure to keep your Supabase keys secure
- Never commit `.env` file to version control
- The app uses Row Level Security (RLS) for data protection
- Users can only delete their own comments
- All users can view all comments and reactions
