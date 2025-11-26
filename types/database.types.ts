
export interface Comment {
  id: string;
  user_id: string;
  user_name: string;
  customer_name: string;
  subject: string;
  submission_type: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

export interface Attachment {
  id: string;
  comment_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Reaction {
  id: string;
  comment_id: string;
  user_id: string;
  reaction_type: string;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  created_at: string;
}
