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
      summary_short,
      summary_long,
      image_url,
      published_at,
      importance_score,
      is_frequency,
      featured_home,
      categories (
        name,
        slug
      )
    `)
    .eq("publish_to_web", true)
    .in("status", ["published", "developing"])
    .order("importance_score", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Frequency Black Supabase error:", error);
    return [];
  }

  console.log("Frequency Black stories:", data);
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  const stories = await loadFrequencyStories();

  const frequencyStory = stories.find(
    story => story.is_frequency === true
  );

  if (!frequencyStory) {
    console.log("No Frequency story found.");
    return;
  }

  const headline = document.querySelector("[data-frequency-headline]");
  const summary = document.querySelector("[data-frequency-summary]");
  const link = document.querySelector("[data-frequency-link]");

  if (headline) {
    headline.textContent = frequencyStory.headline;
  }

  if (summary) {
    summary.textContent =
      frequencyStory.summary_short ||
      frequencyStory.summary_long ||
      "";
  }

  if (link) {
    link.href = `article.html?slug=${frequencyStory.slug}`;
  }
});
