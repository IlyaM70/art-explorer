import { getArtworkById, getArtistById } from "./api.js";

const params = new URLSearchParams(window.location.search);
const type = params.get("type");
const id = params.get("id");

const loading = document.getElementById("loading");
const errorElement = document.getElementById("error");
const details = document.getElementById("details");

const imageColumn = document.getElementById("image-column");
const imageElement = document.getElementById("detail-image");
const contentColumn = document.getElementById("content-column");

const titleElement = document.getElementById("detail-title");
const metadataElement = document.getElementById("detail-metadata");
const descriptionElement = document.getElementById("detail-description");
const moreAuthorBtn = document.getElementById("more-author-btn");

// Build metadata
function addMetadata(label, value) {
  if (!value) return;

  const paragraph = document.createElement("p");
  paragraph.className = "mb-2";

  const strong = document.createElement("strong");
  strong.textContent = `${label}: `;

  paragraph.append(strong, document.createTextNode(value));
  metadataElement.appendChild(paragraph);
}

// Display description
function setDescription(html) {
  descriptionElement.replaceChildren();

  if (!html) return;

  const text = new DOMParser()
    .parseFromString(html, "text/html")
    .body.textContent;

  const paragraph = document.createElement("p");
  paragraph.textContent = text;

  descriptionElement.appendChild(paragraph);
}

// Show artwork image
function showImage(imageUrl, title) {
  if (!imageUrl) {
    imageColumn.classList.add("d-none");
    return;
  }

  imageElement.src = imageUrl;
  imageElement.alt = title || "Artwork";
  imageElement.referrerPolicy = "no-referrer";

  imageColumn.classList.remove("d-none");
}

// Setup author search button
function setupAuthorButton(artistName) {
  if (!artistName) {
    moreAuthorBtn.classList.add("d-none");
    return;
  }

  moreAuthorBtn.classList.remove("d-none");

  moreAuthorBtn.onclick = () => {
    const params = new URLSearchParams({
      search: artistName
    });

    window.location.href = `index.html?${params}`;
  };
}

// Render artwork
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

// Render artist
function renderArtist(artist) {
  titleElement.textContent = artist.name || "Unknown Artist";

  addMetadata("Birth", artist.birthDate);
  addMetadata("Death", artist.deathDate);

  setDescription(artist.description);
  showImage(null);

  setupAuthorButton(artist.name);
}

// Show error
function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.remove("d-none");
}

// Initialize details page
async function loadDetails() {
  if (
    !["artwork", "artist"].includes(type) ||
    !/^\d+$/.test(id || "")
  ) {
    loading.classList.add("d-none");
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

    metadataElement.replaceChildren();
    descriptionElement.replaceChildren();

    if (type === "artwork") {
      renderArtwork(item);
    } else {
      renderArtist(item);
    }

    details.classList.remove("d-none");

  } catch (error) {
    console.error(error);
    showError("Could not load details. Please try again.");

  } finally {
    loading.classList.add("d-none");
  }
}

loadDetails();
