import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://mjncqxeucxhpvhkwjccb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qbmNxeGV1Y3hocHZoa3dqY2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MTkzOTYsImV4cCI6MjA3Mzk5NTM5Nn0.JpMB5Io7qQ7xKyFrI1Ei_E2cZVjtkuQuC0_D8Z1m0SI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
