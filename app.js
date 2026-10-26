import { searchArtworks } from "./api.js";

async function renderArtworks(query) {
  const container = document.getElementById("artworks-container");
  const artworks = await searchArtworks(query);

  container.replaceChildren();

  const cards = artworks.map((artwork) => {
    const column = document.createElement("div");
    column.className = "col";

    const card = document.createElement("div");
    card.className = "card h-100";

    const image = document.createElement("img");
    image.className = "card-img-top";
    image.src = artwork.imageUrl;
    image.alt = artwork.title;
    image.style.height = "220px";
    image.style.objectFit = "cover";
    image.referrerPolicy = "no-referrer";

    const body = document.createElement("div");
    body.className = "card-body";

    const title = document.createElement("h5");
    title.className = "card-title";
    title.textContent = artwork.title;

    const artist = document.createElement("p");
    artist.className = "card-text";
    artist.textContent = artwork.artist || "Unknown artist";

    const date = document.createElement("small");
    date.className = "text-muted";
    date.textContent = artwork.date || "";

    body.append(title, artist, date);
    card.append(image, body);
    column.append(card);

    return column;
  });

  container.append(...cards);

  return cards;
}

// Test
renderArtworks("monet");
