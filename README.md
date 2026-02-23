# Virtual Art Gallery Platform

Role-based virtual gallery application built with React + Vite.

## Implemented Frontend Modules

- Landing page with featured artworks
- Authentication pages (Login, Register, Forgot Password)
- Role dashboards: Admin, Artist, Visitor, Curator
- Visitor flows: browse, filter/search, artwork detail, wishlist, cart, checkout, virtual tour view
- Artist flows: upload/manage artworks, sales and revenue view
- Curator flows: create/manage exhibitions, themes, commentary, virtual tours
- Admin flows: users/roles management, artwork approval, moderation, transaction analytics

## Tech Stack

- React 19
- Vite 8
- ESLint

## Run Project

```bash
npm install
npm run dev
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

## Backend Integration Docs

- REST API Contract: [docs/api-contract.md](docs/api-contract.md)
- MySQL Schema: [docs/schema.sql](docs/schema.sql)

## Backend Starter (Express + JWT + MySQL)

Backend is scaffolded in [backend](backend) with:

- JWT authentication
- Role middleware (`ADMIN`, `ARTIST`, `VISITOR`, `CURATOR`)
- Core routes: auth, users, artworks, exhibitions, wishlist/cart/checkout, analytics
- MySQL connection pool (`mysql2/promise`)

### Setup backend

1. Copy [backend/.env.example](backend/.env.example) to `backend/.env`
2. Update DB and JWT values
3. Run database script from [docs/schema.sql](docs/schema.sql)

### Run backend

```bash
npm.cmd --prefix backend install
npm.cmd --prefix backend run dev
```

Health check: `GET http://localhost:5000/health`

## Suggested Backend Stack

- Node.js + Express + JWT authentication
- MySQL 8+
- Role-based access middleware (`Admin`, `Artist`, `Visitor`, `Curator`)

## Current Status

- Frontend is fully functional with mock state.
- Next step is replacing mock state calls with real API integration using the contract above.
