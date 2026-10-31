
import { searchArtworks, searchArtists } from "./api.js";

// Art Institute API limits the number of accessible search results.
const MAX_ACCESSIBLE_PAGE = 100;

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const container = document.getElementById("artworks-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchTypeInput = document.getElementById("search-type");

const pagination = document.getElementById("pagination");
const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");
const pageInput = document.getElementById("page-input");
const goToPageButton = document.getElementById("go-to-page");

let currentPage = 1;
let totalPages = 1;
let currentQuery = "";
let currentSearchType = "artworks";
let requestId = 0;


function showLoading() {
  loading.classList.remove("d-none");
  errorMessage.classList.add("d-none");
}

function hideLoading() {
  loading.classList.add("d-none");
}

function showError(message) {
  hideLoading();
  errorMessage.textContent = message;
  errorMessage.classList.remove("d-none");
}

// Build a reusable Bootstrap card.
function createCard(title, content, detailsUrl, imageUrl) {
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

  const link = document.createElement("a");
  link.className = "btn btn-outline-primary mt-auto";
  link.href = detailsUrl;
  link.textContent = "View Details";

  body.append(heading, ...content, link);
  card.append(body);
  column.append(card);

  return column;
}

function createDetailsUrl(type, id) {
  const params = new URLSearchParams({
    type,
    id,
    search: currentQuery,
    searchType: currentSearchType,
    page: currentPage
  });

  return `details.html?${params}`;
}

function createArtworkCard(artwork) {
  const artist = document.createElement("p");
  artist.className = "card-text";
  artist.textContent = artwork.artist || "Unknown artist";

  const date = document.createElement("small");
  date.className = "text-muted mb-3";
  date.textContent = artwork.date || "";

  return createCard(
    artwork.title,
    [artist, date],
    createDetailsUrl("artwork", artwork.id),
    artwork.imageUrl
  );
}

function createArtistCard(artist) {
  const dates = document.createElement("p");
  dates.className = "card-text text-muted";
  dates.textContent = `${artist.birth_date ?? "?"} - ${artist.death_date ?? "?"}`;

  return createCard(
    artist.title,
    [dates],
    createDetailsUrl("artist", artist.id)
  );
}

function updatePagination() {
  pagination.classList.toggle("d-none", totalPages <= 1);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  pageInput.value = currentPage;
  pageInput.max = Math.min(totalPages, MAX_ACCESSIBLE_PAGE);

  prevButton.disabled = currentPage <= 1;
  nextButton.disabled = currentPage >= totalPages;
}

function updateSearchUrl() {
  const params = new URLSearchParams({
    search: currentQuery,
    searchType: currentSearchType,
    page: String(currentPage)
  });

  history.replaceState(null, "", `?${params.toString()}`);
}

async function renderResults() {
  const id = ++requestId;
  const isArtwork = currentSearchType === "artworks";

  showLoading();
  container.replaceChildren();
  pagination.classList.add("d-none");
  prevButton.disabled = true;
  nextButton.disabled = true;

  try {
    const { results, pagination: pageData } = isArtwork
      ? await searchArtworks(currentQuery, currentPage)
      : await searchArtists(currentQuery, currentPage);

    // Prevent older requests from replacing newer results.
    if (id !== requestId) return;

    if (results.length) {
      const createResultCard = isArtwork
        ? createArtworkCard
        : createArtistCard;

      container.replaceChildren(...results.map(createResultCard));
    } else {
      container.textContent = "No results found.";
    }

    totalPages = Math.min(pageData.total_pages, MAX_ACCESSIBLE_PAGE);
    currentPage = Math.min(pageData.current_page, totalPages);

    updateSearchUrl();
    updatePagination();
  } catch (err) {
    if (id !== requestId) return;

    console.error("Search failed:", err);
    showError("Failed to load results. Please try again.");
  } finally {
    if (id === requestId) {
      hideLoading();
    }
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) return;

  currentQuery = query;
  currentSearchType = searchTypeInput.value;
  currentPage = 1;
  totalPages = 1;

  renderResults();
});

prevButton.addEventListener("click", () => {
  if (currentPage <= 1) return;

  currentPage--;
  renderResults();
});

nextButton.addEventListener("click", () => {
  if (currentPage >= totalPages) return;

  currentPage++;
  renderResults();
});

goToPageButton.addEventListener("click", () => {
  const page = Number(pageInput.value);

  if (
    !Number.isInteger(page) ||
    page < 1 ||
    page > totalPages ||
    page > MAX_ACCESSIBLE_PAGE
  ) {
    pageInput.value = currentPage;
    return;
  }

  if (page === currentPage) return;

  currentPage = page;
  renderResults();
});
container.addEventListener("click", (event) => {
  const link = event.target.closest("a");

  if (!link || !link.href.includes("details.html")) return;

  sessionStorage.setItem("artExplorerScroll", JSON.stringify({
    search: currentQuery,
    searchType: currentSearchType,
    page: currentPage,
    scrollY: window.scrollY
  }));
});

// Restore search state from the URL.
const params = new URLSearchParams(window.location.search);

const initialSearch = params.get("search");
const initialType = params.get("searchType");
const initialPage = Number(params.get("page"));

if (initialSearch) {
  searchInput.value = initialSearch;
  currentQuery = initialSearch;

  if (initialType === "artworks" || initialType === "artists") {
    currentSearchType = initialType;
  }

  searchTypeInput.value = currentSearchType;
  currentPage = Number.isInteger(initialPage) && initialPage > 0
    ? initialPage
    : 1;

  renderResults()
}

// Restore the previous search results page and scroll position when returning from artwork or artist details.
async function restoreSearchState() {
  await renderResults();

  const saved = sessionStorage.getItem("artExplorerScroll");

  if (!saved) return;

  const position = JSON.parse(saved);

  if (
    position.search === currentQuery &&
    position.searchType === currentSearchType &&
    position.page === currentPage
  ) {
    window.scrollTo(0, position.scrollY);
  }

  sessionStorage.removeItem("artExplorerScroll");
}

restoreSearchState();
