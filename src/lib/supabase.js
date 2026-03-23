import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://yrvsmpqhxqjelwthkgtk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_3Q8ugvSIDGck0Ja0l7qxYA_WJcWx4To";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
