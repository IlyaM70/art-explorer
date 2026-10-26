import { searchArtworks, searchArtists } from "./api.js";

const container = document.getElementById("artworks-container");
const searchForm = document.getElementById("search-form");

// Create a reusable Bootstrap card
function createCard(title, content, imageUrl = null) {
  const column = document.createElement("div");
  column.className = "col";

  const card = document.createElement("div");
  card.className = "card h-100";

  if (imageUrl) {
    const image = document.createElement("img");
    image.className = "card-img-top";
    image.src = imageUrl;
    image.alt = title;
    image.style.height = "220px";
    image.style.objectFit = "cover";
    image.referrerPolicy = "no-referrer";

    card.append(image);
  }

  const body = document.createElement("div");
  body.className = "card-body";

  const heading = document.createElement("h5");
  heading.className = "card-title";
  heading.textContent = title;

  body.append(heading, ...content);
  card.append(body);
  column.append(card);

  return column;
}

// Create an artwork card
function createArtworkCard(artwork) {
  const artist = document.createElement("p");
  artist.className = "card-text";
  artist.textContent = artwork.artist || "Unknown artist";

  const date = document.createElement("small");
  date.className = "text-muted";
  date.textContent = artwork.date || "";

  return createCard(artwork.title, [artist, date], artwork.imageUrl);
}

// Create an artist card
function createArtistCard(artist) {
  const dates = document.createElement("p");
  dates.className = "card-text text-muted";
  dates.textContent =
    `${artist.birth_date ?? "?"} -  ${artist.death_date ?? "?"}`;

  return createCard(artist.title, [dates]);
}

// Fetch and render search results
async function renderResults(query, searchType) {
  const isArtwork = searchType === "artworks";

  const results = isArtwork
    ? await searchArtworks(query)
    : await searchArtists(query);

  const cards = results.map(
    isArtwork ? createArtworkCard : createArtistCard
  );

  container.replaceChildren(...cards);
}

// Handle search form submission
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = document.getElementById("search-input").value.trim();
  const searchType = document.getElementById("search-type").value;

  if (!query) return;

  try {
    await renderResults(query, searchType);
  } catch (error) {
    console.error("Search failed:", error);
  }
});

