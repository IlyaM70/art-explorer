
const API_URL = "https://api.artic.edu/api/v1";
const IMAGE_URL = "https://www.artic.edu/iiif/2";

async function fetchAPI(endpoint, params) {
  const response = await fetch(`${API_URL}/${endpoint}?${params}`, {
    referrerPolicy: "no-referrer",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const { data } = await response.json();
  return data;
}

export async function searchArtworks(query) {
  if (!query.trim()) {
    return [];
  }


  const params = new URLSearchParams({
    q: query.trim(),
    limit: 9,
    fields: "id,title,artist_title,date_display,image_id",
  });

  const data = await fetchAPI("artworks/search", params);

  return data
    .filter((artwork) => artwork.image_id)
    .map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist_title,
      date: artwork.date_display,
      imageUrl: `${IMAGE_URL}/${artwork.image_id}/full/400,/0/default.jpg`,
    }));
}

export async function searchArtists(query) {
  if (!query.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
    fields: "id,title,birth_date,death_date",
  });

  return fetchAPI("artists/search", params);
}
