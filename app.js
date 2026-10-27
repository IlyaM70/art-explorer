import { searchArtworks, searchArtists } from "./api.js";

const container = document.getElementById("artworks-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchTypeInput = document.getElementById("search-type");

const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let currentSearchType = "artworks";
let requestId = 0;

// Create a reusable Bootstrap card
function createCard(title, content, detailsUrl, imageUrl = null) {
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
  body.className = "card-body d-flex flex-column";

  const heading = document.createElement("h5");
  heading.className = "card-title";
  heading.textContent = title;

  const detailsLink = document.createElement("a");
  detailsLink.className = "btn btn-outline-primary mt-auto";
  detailsLink.href = detailsUrl;
  detailsLink.textContent = "View Details";

  body.append(heading, ...content, detailsLink);
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
  date.className = "text-muted mb-3";
  date.textContent = artwork.date || "";

  const detailsUrl = `details.html?type=artwork&id=${artwork.id}`;

  return createCard(
    artwork.title,
    [artist, date],
    detailsUrl,
    artwork.imageUrl
  );
}

// Create an artist card
function createArtistCard(artist) {
  const dates = document.createElement("p");
  dates.className = "card-text text-muted";
  dates.textContent =
    `${artist.birth_date ?? "?"} - ${artist.death_date ?? "?"}`;

  const detailsUrl = `details.html?type=artist&id=${artist.id}`;

  return createCard(
    artist.title,
    [dates],
    detailsUrl
  );
}

// Update pagination controls
function updatePagination() {
  pagination.classList.toggle("d-none", totalPages <= 1);

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
}

// Fetch and render search results
async function renderResults() {
  const id = ++requestId;
  const isArtwork = currentSearchType === "artworks";

  prevButton.disabled = true;
  nextButton.disabled = true;

  try {
    const { results, pagination: pageData } = isArtwork
      ? await searchArtworks(currentQuery, currentPage)
      : await searchArtists(currentQuery, currentPage);

    // Ignore outdated requests
    if (id !== requestId) return;

    const cards = results.map(
      isArtwork ? createArtworkCard : createArtistCard
    );

    container.replaceChildren(...cards);

    if (results.length === 0) {
      container.textContent = "No results found.";
    }

    currentPage = pageData.current_page;
    totalPages = Math.max(1, pageData.total_pages);

    updatePagination();
  } catch (error) {
    if (id !== requestId) return;

    console.error("Search failed:", error);
    container.textContent = "Failed to load results.";
    pagination.classList.add("d-none");
  }
}

// Handle search form
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  const searchType = searchTypeInput.value;

  if (!query) return;

  currentQuery = query;
  currentSearchType = searchType;
  currentPage = 1;
  totalPages = 1;

  pagination.classList.add("d-none");
  renderResults();
});

// Previous page
prevButton.addEventListener("click", () => {
  if (currentPage <= 1) return;

  currentPage--;
  renderResults();
});

// Next page
nextButton.addEventListener("click", () => {
  if (currentPage >= totalPages) return;

  currentPage++;
  renderResults();
});

// Search automatically when redirected from details page
const searchParams = new URLSearchParams(window.location.search);
const initialSearch = searchParams.get("search");

if (initialSearch) {
  searchInput.value = initialSearch;
  searchTypeInput.value = "artworks";

  currentQuery = initialSearch;
  currentSearchType = "artworks";

  renderResults();
}
