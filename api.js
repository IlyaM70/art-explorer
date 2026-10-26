
const API_URL = "https://api.artic.edu/api/v1/artworks/search";
const IMAGE_URL = "https://www.artic.edu/iiif/2";

export async function searchArtworks(query) {
  if (!query?.trim()) {
    return [];
  }

  const params = new URLSearchParams({
    q: query.trim(),
    limit: 9,
    fields: "id,title,artist_title,date_display,image_id",
  });

  try {
    
    const response = await fetch(`${API_URL}?${params}`, {
      method: "GET",
      referrerPolicy: "no-referrer",
    });


    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const { data } = await response.json();

    return data
      .filter((artwork) => artwork.image_id)
      .map((artwork) => ({
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist_title,
        date: artwork.date_display,
        imageUrl: `${IMAGE_URL}/${artwork.image_id}/full/400,/0/default.jpg`,
      }));
  } catch (error) {
    console.error("Failed to fetch artworks:", error);
    return [];
  }
}
