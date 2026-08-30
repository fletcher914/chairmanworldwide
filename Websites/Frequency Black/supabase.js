/* =========================================================
   FREQUENCY BLACK
   Supabase Connection + Homepage Story Loader
   ========================================================= */


/* ---------------------------------------------------------
   1. SUPABASE CONNECTION
   --------------------------------------------------------- */

// Your Supabase project URL
const SUPABASE_URL = "https://txmykrgfqbydinvbpmok.supabase.co/rest/v1/;

// Your PUBLIC / PUBLISHABLE key.
// IMPORTANT: Use the publishable key, NOT the secret/service_role key.
const SUPABASE_KEY = "sb_publishable_dkN9HDOtkNgsuKvRJrpvpg_pewjzz7W";


// Create Supabase client
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* ---------------------------------------------------------
   2. GET PUBLISHED STORIES
   --------------------------------------------------------- */

async function getPublishedStories() {

  const { data, error } = await supabaseClient
    .from("stories")
    .select(`
      *,
      categories (
        id,
        name,
        slug
      )
    `)
    .eq("publish_to_web", true)
    .in("status", ["published", "developing"])
    .order("importance_score", {
      ascending: false
    });

  if (error) {
    console.error(
      "Frequency Black: Could not load stories:",
      error
    );

    return [];
  }

  console.log(
    "Frequency Black: Stories loaded:",
    data
  );

  return data || [];
}


/* ---------------------------------------------------------
   3. FIND THE FREQUENCY STORY
   --------------------------------------------------------- */

function getFrequencyStory(stories) {

  // First preference:
  // story specifically marked as The Frequency

  const frequencyStory = stories.find(
    story => story.is_frequency === true
  );

  if (frequencyStory) {
    return frequencyStory;
  }


  // Second preference:
  // homepage featured story

  const featuredStory = stories.find(
    story => story.featured_home === true
  );

  if (featuredStory) {
    return featuredStory;
  }


  // Final fallback:
  // highest-ranked published story

  return stories[0] || null;
}


/* ---------------------------------------------------------
   4. CREATE ARTICLE URL
   --------------------------------------------------------- */

function getArticleURL(story) {

  if (!story || !story.slug) {
    return "#";
  }

  return `article.html?slug=${encodeURIComponent(story.slug)}`;
}


/* ---------------------------------------------------------
   5. FORMAT DATE
   --------------------------------------------------------- */

function formatStoryDate(dateValue) {

  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric"
    }
  );
}


/* ---------------------------------------------------------
   6. DISPLAY THE FREQUENCY STORY
   --------------------------------------------------------- */

function displayFrequencyStory(story) {

  if (!story) {

    console.log(
      "Frequency Black: No Frequency story available."
    );

    return;
  }


  /*
     HEADLINE
  */

  const headline =
    document.querySelector(
      "[data-frequency-headline]"
    );

  if (headline) {

    headline.textContent =
      story.headline || "The Frequency";

  } else {

    console.warn(
      "Frequency Black: data-frequency-headline not found."
    );

  }


  /*
     SUMMARY
  */

  const summary =
    document.querySelector(
      "[data-frequency-summary]"
    );

  if (summary) {

    summary.textContent =
      story.summary_short ||
      story.summary_long ||
      "";

  }


  /*
     ARTICLE LINK
  */

  const link =
    document.querySelector(
      "[data-frequency-link]"
    );

  if (link) {

    link.href = getArticleURL(story);

  }


  /*
     CATEGORY
  */

  const category =
    document.querySelector(
      "[data-frequency-category]"
    );

  if (category) {

    category.textContent =
      story.categories?.name ||
      "The Frequency";

  }


  /*
     DATE
  */

  const date =
    document.querySelector(
      "[data-frequency-date]"
    );

  if (date) {

    date.textContent =
      formatStoryDate(
        story.published_at ||
        story.created_at
      );

  }


  /*
     IMAGE
  */

  const image =
    document.querySelector(
      "[data-frequency-image]"
    );

  if (image && story.image_url) {

    image.src = story.image_url;

    image.alt =
      story.headline ||
      "Frequency Black";

  }


  console.log(
    "Frequency Black: The Frequency loaded:",
    story.headline
  );
}


/* ---------------------------------------------------------
   7. CATEGORY HELPERS
   --------------------------------------------------------- */

function storiesForCategory(
  stories,
  categorySlug
) {

  return stories.filter(story => {

    return (
      story.categories &&
      story.categories.slug === categorySlug
    );

  });
}


/* ---------------------------------------------------------
   8. GROUP STORIES INTO THE FOUR FREQUENCY BLACK SECTIONS
   --------------------------------------------------------- */

function organizeStories(stories) {

  return {

    politicsPower:
      storiesForCategory(
        stories,
        "politics-power"
      ),

    environment:
      storiesForCategory(
        stories,
        "environment"
      ),

    blackAmericaCulture:
      storiesForCategory(
        stories,
        "black-america-culture"
      ),

    realEstate:
      storiesForCategory(
        stories,
        "real-estate"
      )

  };
}


/* ---------------------------------------------------------
   9. START FREQUENCY BLACK
   --------------------------------------------------------- */

async function startFrequencyBlack() {

  console.log(
    "Frequency Black: Connecting to Supabase..."
  );


  try {

    const stories =
      await getPublishedStories();


    if (!stories.length) {

      console.warn(
        "Frequency Black: Supabase returned no published stories."
      );

      return;
    }


    /*
       THE FREQUENCY
    */

    const frequencyStory =
      getFrequencyStory(stories);

    displayFrequencyStory(
      frequencyStory
    );


    /*
       ORGANIZE THE REST OF THE STORIES
    */

    const sections =
      organizeStories(stories);


    console.log(
      "Frequency Black sections:",
      sections
    );


    console.log(
      "Frequency Black: Supabase connection successful."
    );

  }

  catch (error) {

    console.error(
      "Frequency Black startup error:",
      error
    );

  }

}


/* ---------------------------------------------------------
   10. RUN AFTER THE PAGE LOADS
   --------------------------------------------------------- */

document.addEventListener(
  "DOMContentLoaded",
  startFrequencyBlack
);
