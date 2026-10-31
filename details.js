
import { getArtworkById, getArtistById } from "./api.js";

const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const id = params.get("id");

const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error");
const details = document.getElementById("details");

const imageColumn = document.getElementById("image-column");
const imageElement = document.getElementById("detail-image");
const titleElement = document.getElementById("detail-title");
const metadataElement = document.getElementById("detail-metadata");
const descriptionElement = document.getElementById("detail-description");
const moreAuthorButton = document.getElementById("more-author-btn");

const backToSearch = document.getElementById("back-to-search");

const searchParams = new URLSearchParams({
  search: params.get("search") || "",
  searchType: params.get("searchType") || "artworks",
  page: params.get("page") || "1"
});

backToSearch.href = `index.html?${searchParams}`;

function showLoading() {
  loading.classList.remove("d-none");
  errorMessage.classList.add("d-none");
  details.classList.add("d-none");
}

function hideLoading() {
  loading.classList.add("d-none");
}

function showError(message) {
  hideLoading();
  errorMessage.textContent = message;
  errorMessage.classList.remove("d-none");
}

function addMetadata(label, value) {
  if (!value) return;

  const paragraph = document.createElement("p");
  paragraph.className = "mb-2";

  const labelElement = document.createElement("strong");
  labelElement.textContent = `${label}: `;

  paragraph.append(labelElement, document.createTextNode(value));
  metadataElement.append(paragraph);
}

function setDescription(html) {
  descriptionElement.innerHTML = html || "";
}

function showImage(imageUrl, title) {
  imageColumn.classList.toggle("d-none", !imageUrl);

  if (!imageUrl) return;

  imageElement.src = imageUrl;
  imageElement.alt = title || "Artwork";
  imageElement.referrerPolicy = "no-referrer";
}

function setupAuthorButton(artistName) {
  moreAuthorButton.classList.toggle("d-none", !artistName);

  if (!artistName) return;

  moreAuthorButton.onclick = () => {
  const params = new URLSearchParams({
    search: artistName,
    searchType: "artworks",
    page: "1"
  });

  window.location.href = `index.html?${params}`;
};

}

function renderArtwork(artwork) {
  titleElement.textContent = artwork.title || "Untitled";

  addMetadata("Artist", artwork.artist);
  addMetadata("Date", artwork.date);
  addMetadata("Medium", artwork.medium);
  addMetadata("Dimensions", artwork.dimensions);
  
  setDescription(artwork.description);
  showImage(artwork.imageUrl, artwork.title);
  setupAuthorButton(artwork.artist);
}

function renderArtist(artist) {
  titleElement.textContent = artist.name || "Unknown Artist";

  addMetadata("Birth", artist.birthDate);
  addMetadata("Death", artist.deathDate);

  setDescription(artist.description);
  showImage(null);
  setupAuthorButton(artist.name);
}

async function loadDetails() {
  showLoading();

  if (
    (type !== "artwork" && type !== "artist") ||
    !id ||
    isNaN(Number(id))
  ) {
    showError("Invalid details URL.");
    return;
  }

  try {
    const item = type === "artwork"
      ? await getArtworkById(id)
      : await getArtistById(id);

    if (!item) {
      throw new Error("Item not found.");
    }

    if (type === "artwork") {
      renderArtwork(item);
    } else {
      renderArtist(item);
    }

    details.classList.remove("d-none");
  } catch (err) {
    console.error("Failed to load details:", err);
    showError("Could not load details. Please try again.");
  } finally {
    hideLoading();
  }
}

loadDetails();
