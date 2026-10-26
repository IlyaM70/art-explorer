
const API_URL = "https://api.artic.edu/api/v1";
const IMAGE_URL = "https://www.artic.edu/iiif/2";
const PAGE_SIZE = 9;

async function fetchAPI(endpoint, params) {
  const response = await fetch(`${API_URL}/${endpoint}?${params}`, {
    referrerPolicy: "no-referrer",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return await response.json();
}

export async function searchArtworks(query, page = 1) {
  if (!query.trim()) {
    return {
      results: [],
      pagination: {
        current_page: 1,
        total_pages: 1,
      },
    };
  }


  const params = new URLSearchParams({
    q: query.trim(),
    page: page,
    limit: PAGE_SIZE,
    fields: "id,title,artist_title,date_display,image_id",
  });

  const {data,pagination} = await fetchAPI("artworks/search", params);

  const artworks = data
    .filter((artwork) => artwork.image_id)
    .map((artwork) => ({
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist_title,
      date: artwork.date_display,
      imageUrl: `${IMAGE_URL}/${artwork.image_id}/full/400,/0/default.jpg`,
    }));

    return { results: artworks, pagination };
}

export async function searchArtists(query, page = 1) {
  if (!query.trim()) {
    return {
      results: [],
      pagination: {
        current_page: 1,
        total_pages: 1,
      },
    };
  }

  const params = new URLSearchParams({
    q: query.trim(),
    page: page,
    limit: PAGE_SIZE,
    fields: "id,title,birth_date,death_date",
  });

  const {data,pagination} = await fetchAPI("artists/search", params);

  const artists = data.map((artist) => ({
    id: artist.id,
    title: artist.title,
    birth_date: artist.birth_date,
    death_date: artist.death_date,
  }));

  return { results: artists, pagination };
}
