
export interface Comment {
  id: string;
  author: string;
  parent_id?: string;
  path?: string;
  body: string;
  deleted_at?: string;
  reaction_count?: number;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  subject?: string;
  submission_type?: string;
}

export interface Attachment {
  id: string;
  comment_id: string;
  storage_path: string;
  filename?: string;
  mime_type?: string;
  size?: number;
  created_at: string;
}

export interface Reaction {
  id: string;
  comment_id: string;
  user_id: string;
  type: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  username?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}
