# Virtual Art Gallery Platform

Professional REST-based virtual gallery application built with React + Vite (frontend) and Node.js + Express (backend).

## Implemented Frontend Modules

- Landing page with featured artworks
- Authentication pages (Login, Register, Forgot Password)
- Role dashboards: Admin, Artist, Visitor, Curator
- Visitor flows: browse, filter/search, artwork detail, wishlist, cart, checkout, virtual tour view
- Artist flows: upload/manage artworks, sales and revenue view
- Curator flows: create/manage exhibitions, themes, commentary, virtual tours
- Admin flows: users/roles management, artwork approval, moderation, transaction analytics

## Tech Stack

- Frontend: React 19, React Router, Vite 8
- Backend: Node.js, Express 5, CORS
- Storage: JSON file persistence (`backend/src/data/artworks.json`)

## Run Project

```bash
npm install
npm run dev
```

Run backend in another terminal:

```bash
npm.cmd --prefix backend install
npm.cmd --prefix backend run dev
```

For PowerShell script policy issues on Windows:

```bash
npm.cmd run dev
```

## Build & Lint

```bash
npm.cmd run lint
npm.cmd run build
```

## Backend REST API

- Base URL: `http://localhost:5000/api`
- Endpoints:
	- `GET /artworks`
	- `GET /artworks/:id`
	- `POST /artworks`
	- `PUT /artworks/:id`
	- `DELETE /artworks/:id`
- Validation:
	- Required fields for create: `title`, `category`, `price`, `image`
	- Validates numeric IDs, status values, image URL, and price values
- Persistence:
	- Data is persisted in `backend/src/data/artworks.json`
	- Changes survive backend restarts
- Error handling:
	- Consistent JSON error responses with appropriate HTTP status codes
- CORS:
	- Enabled for frontend-backend integration

Health check: `GET http://localhost:5000/health`

Detailed contract: [docs/api-contract.md](docs/api-contract.md)

## Current Status

- Frontend uses React Router with direct URL access for Home, Gallery, About, and Contact.
- Gallery is dynamic and fetched from backend API.
- Backend is database-free and ready for academic submission.
