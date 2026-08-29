const SUPABASE_URL = "https://txmykrgfqbydinvbpmok.supabase.co/rest/v1/;
const SUPABASE_KEY = "sb_publishable_dkN9HDOtkNgsuKvRJrpvpg_pewjzz7W";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadFrequencyStories() {
  const { data, error } = await supabase
    .from("stories")
    .select(`
      id,
      headline,
      slug,
      short_summary,
      what_happened,
      why_it_matters,
      importance_score,
      published_at,
      is_frequency,
      categories (
        name,
        slug
      )
    `)
    .in("status", ["published", "developing"])
    .eq("publish_to_web", true)
    .order("importance_score", { ascending: false });

  if (error) {
    console.error("Frequency Black Supabase error:", error);
    return [];
  }

  return data;
}
