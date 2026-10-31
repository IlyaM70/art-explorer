# Art Explorer

Art Explorer is a web application for discovering artworks and artists using the **Art Institute of Chicago API**.

Explore the museum's collection, search for artworks or artists, and view detailed information about individual works.

## Live Demo

[Open Art Explorer](https://ilyam70.github.io/art-explorer/)

## Features

- **Artwork Search** – Search the Art Institute of Chicago collection by keyword.
- **Artist Search** – Search for artists and explore their information.
- **Artwork Details** – View artwork images and detailed information on a dedicated page.
- **Artist Details** – Explore individual artist information.
- **Pagination** – Navigate through search results.
- **Artist Exploration** – Find more artworks by a selected artist.
- **URL-Based Search** – Search queries are preserved in the URL.
- **Responsive Design** – Interface adapts to different screen sizes.
- **Error Handling** – Handles unsuccessful requests, empty results, and invalid detail pages.

## Technologies

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Bootstrap 5
- Art Institute of Chicago API
- GitHub Pages

## Project Structure

```text
art-explorer/
├── index.html       # Main search page
├── details.html     # Artwork and artist details
├── style.css        # Application styling
├── api.js           # API requests
├── index.js         # Search and pagination logic
├── details.js       # Details page logic
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/IlyaM70/art-explorer.git
```

### 2. Navigate to the project directory

```bash
cd art-explorer
```

### 3. Start a local development server

Because the application uses JavaScript ES modules, it should be served through a local HTTP server rather than opened directly using `file://`.

Using Python:

```bash
py -m http.server 8000
```

### 4. Open the application

Visit:

```text
http://localhost:8000
```

## API

This project uses the [Art Institute of Chicago API](https://api.artic.edu/docs/).

The API provides access to artwork and artist information, including artwork images and metadata.

- No API key is required.
- Data is retrieved using HTTP GET requests.
- Artwork images are served through the museum's IIIF image service.

## Deployment

The application is deployed using **GitHub Pages**.

[View the live application](https://ilyam70.github.io/art-explorer/)

## Project Status

Core functionality is implemented. The application supports artwork and artist searches, pagination, individual detail pages, and responsive styling.

## Acknowledgments

Artwork data, metadata, and images are provided by the [Art Institute of Chicago](https://www.artic.edu/).