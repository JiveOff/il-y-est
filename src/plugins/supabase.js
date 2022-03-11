import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zdxtlklfhnygfwvaocye.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkeHRsa2xmaG55Z2Z3dmFvY3llIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDY5ODkzOTUsImV4cCI6MTk2MjU2NTM5NX0.baQ0SWkenf65S6-31YDW3lMjxESeL4-0AEwaL1Z9fng";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
