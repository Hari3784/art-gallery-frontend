# Virtual Art Gallery API Contract

Base URL: `/api`

Storage model: JSON file (`backend/src/data/artworks.json`)

## 1) Endpoints

### GET `/artworks`
Returns artwork list with optional filters.

Query params:
- `search` (matches title, artist, description)
- `culture`
- `category`
- `status` (`pending`, `approved`, `rejected`)
- `maxPrice`

Response:
```json
[
  {
    "id": 1,
    "title": "Temple Dawn",
    "artist": "Aarav Iyer",
    "culture": "Indian",
    "period": "18th Century Inspired",
    "category": "Painting",
    "price": 28500,
    "description": "A sunrise view over a South Indian temple complex.",
    "historicalInfo": "Inspired by mural traditions from Thanjavur.",
    "image": "https://...",
    "status": "approved",
    "rating": 4.7,
    "reviews": 86,
    "featured": true
  }
]
```

### GET `/artworks/:id`
Returns a single artwork by ID.

### POST `/artworks`
Creates a new artwork.

Required fields:
- `title`
- `category`
- `price`
- `image` (must be `http` or `https` URL)

Example request:
```json
{
  "title": "New Artwork",
  "artist": "Student Artist",
  "culture": "Indian",
  "period": "Contemporary",
  "category": "Painting",
  "price": 12000,
  "description": "Sample description",
  "historicalInfo": "Sample history",
  "image": "https://example.com/art.jpg",
  "status": "pending",
  "featured": false
}
```

### PUT `/artworks/:id`
Updates an existing artwork. Requires at least one valid updatable field.

Updatable fields:
- `title`, `artist`, `culture`, `period`, `category`
- `price`, `description`, `historicalInfo`
- `image`, `status`, `featured`

### DELETE `/artworks/:id`
Deletes an artwork by ID.

## 2) Validation Rules

- `id` must be a positive integer
- `price` must be a non-negative number
- `status` must be one of `pending`, `approved`, `rejected`
- `image` must be a valid `http` or `https` URL

## 3) Error Response Format

```json
{
  "success": false,
  "message": "Validation or runtime message",
  "path": "/api/artworks/abc"
}
```

Common status codes:
- `400` bad request / validation error
- `404` route or resource not found
- `500` internal server error
