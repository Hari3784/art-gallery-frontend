# Virtual Art Gallery API Contract (v1)

Base URL: `/api/v1`

Auth: JWT Bearer Token in `Authorization: Bearer <token>`

Roles: `ADMIN`, `ARTIST`, `VISITOR`, `CURATOR`

## 1) Authentication

### POST `/auth/register`
Create account.

Request:
```json
{
  "name": "Mina Park",
  "email": "mina@gallery.com",
  "password": "Secret@123",
  "role": "VISITOR"
}
```

Response:
```json
{
  "token": "jwt-token",
  "user": {
    "id": 12,
    "name": "Mina Park",
    "email": "mina@gallery.com",
    "role": "VISITOR"
  }
}
```

### POST `/auth/login`
Login user.

Request:
```json
{
  "email": "mina@gallery.com",
  "password": "Secret@123"
}
```

### POST `/auth/forgot-password`
Trigger password reset.

Request:
```json
{
  "email": "mina@gallery.com"
}
```

## 2) Users & Role Management (Admin)

### GET `/users`
List all users. (ADMIN)

### PATCH `/users/:id/role`
Change role. (ADMIN)

Request:
```json
{
  "role": "CURATOR"
}
```

### DELETE `/users/:id`
Deactivate/remove user. (ADMIN)

## 3) Artworks

### GET `/artworks`
Public browse list with filters.

Query params:
- `search`
- `culture`
- `category`
- `artistId`
- `maxPrice`
- `status` (`APPROVED`, `PENDING`, `REJECTED`) for admin views

### GET `/artworks/:id`
Get artwork detail with cultural/historical data.

### POST `/artworks`
Create/upload artwork. (ARTIST)

Request:
```json
{
  "title": "Temple Dawn",
  "description": "Sunrise over temple architecture",
  "culturalInfo": "Inspired by Thanjavur murals",
  "historicalInfo": "18th century tradition",
  "culture": "Indian",
  "period": "Contemporary",
  "category": "Painting",
  "price": 350,
  "imageUrl": "https://..."
}
```

### PATCH `/artworks/:id`
Edit artwork. (ARTIST owner or ADMIN)

### DELETE `/artworks/:id`
Delete artwork. (ARTIST owner or ADMIN)

### PATCH `/artworks/:id/status`
Approve/reject artwork. (ADMIN)

Request:
```json
{
  "status": "APPROVED",
  "moderationNote": "Content meets guidelines"
}
```

## 4) Visitor Commerce

### GET `/wishlist`
Get visitor wishlist. (VISITOR)

### POST `/wishlist/:artworkId`
Add to wishlist. (VISITOR)

### DELETE `/wishlist/:artworkId`
Remove from wishlist. (VISITOR)

### GET `/cart`
Get cart items. (VISITOR)

### POST `/cart/:artworkId`
Add artwork to cart. (VISITOR)

### DELETE `/cart/:artworkId`
Remove from cart. (VISITOR)

### POST `/checkout`
Create order and payment transaction. (VISITOR)

Request:
```json
{
  "purchaserName": "Mina Park",
  "mobile": "9876543210",
  "address": "12 MG Road, Bengaluru",
  "landmark": "Near Metro Station",
  "paymentMethod": "CARD",
  "currency": "INR"
}
```

Response:
```json
{
  "orderId": 501,
  "status": "PAID",
  "amount": 770
}
```

## 5) Reviews & Ratings

### GET `/artworks/:id/reviews`
Artwork reviews.

### POST `/artworks/:id/reviews`
Add review and rating. (VISITOR)

Request:
```json
{
  "rating": 5,
  "comment": "Excellent cultural storytelling"
}
```

## 6) Buyer Queries / Artist Chat

### GET `/conversations`
List current user conversations. (ARTIST/VISITOR)

### POST `/conversations`
Start conversation.

### GET `/conversations/:id/messages`
Load messages.

### POST `/conversations/:id/messages`
Send message.

## 7) Curator: Exhibitions & Tours

### GET `/exhibitions`
List exhibitions.

### POST `/exhibitions`
Create exhibition. (CURATOR)

Request:
```json
{
  "title": "Sacred Lines",
  "theme": "Spiritual Heritage",
  "culture": "Global",
  "commentary": "Curated interpretation",
  "virtualTourLabel": "Temple Hall 360",
  "featured": true,
  "artworkIds": [1, 2, 3]
}
```

### PATCH `/exhibitions/:id`
Edit exhibition. (CURATOR/ADMIN)

### DELETE `/exhibitions/:id`
Delete exhibition. (CURATOR owner or ADMIN)

## 8) Admin Analytics

### GET `/analytics/overview`
Platform-level metrics. (ADMIN)

Response:
```json
{
  "totalUsers": 128,
  "approvedArtworks": 342,
  "pendingArtworks": 9,
  "totalSales": 225,
  "totalRevenue": 89240
}
```

### GET `/transactions`
Transaction list with filters. (ADMIN)

## 9) Common Response Errors

- `400` invalid payload
- `401` missing/invalid token
- `403` insufficient role permissions
- `404` resource not found
- `409` duplicate email / conflicting operation
- `500` server error
