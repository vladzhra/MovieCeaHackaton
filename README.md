# MovieCea — Discover Great Cinema

MovieCea is a premium, full-stack movie discovery platform. Explore a curated collection of the world's greatest films with detailed information, rich aesthetics, and a smooth user experience.

## 🌟 Key Features

### 🎬 Premium Frontend

- **Dark Cinema Aesthetic**: A stunning, modern interface with a deep purple and gold accent palette.
- **Interactive Movie Grid**: Responsive grid with hover effects, poster cards, and live genre badges.
- **Detailed Movie Modal**: View comprehensive information for every film, including:
  - Backdrops, posters, and taglines.
  - Full financial data (Budget, Box Office, Profit).
  - Production companies (with logos), production countries, and spoken languages.
  - Live ratings and popularity metrics.
  - Direct links to IMDB and official homepages.
- **Live Search & Filtering**: Instant title search and interactive genre filter chips.
- **Seamless Navigation**: Clean pagination and smooth glassmorphism UI elements.

### ⚙️ Robust Backend & Data

- **Extended Schema**: Supports 20+ fields from movie dumps, including normalized relations for companies and languages.
- **Smart Data Import**: Seamlessly import thousands of movies from `movies_dump.json` with automatic upsert and dependency management.
- **RESTful API**: Fast and validated NestJS endpoints for searching and paginating through large film collections.
- **Database Visualization**: Integrated **pgAdmin** for easy data exploration.

## 🛠️ Tech Stack

- **Frontend**: React (Vite) + TypeScript + Vanilla CSS (Custom Design System)
- **Backend**: Node.js + NestJS + TypeScript
- **Database**: PostgreSQL
- **ORM**: TypeORM (PostgreSQL)
- **Orchestration**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 1. Setup the Data

Ensure your `movies_dump.json` file is in the project root. A sample file is provided by default.

### 2. Launch the Stack

Run the following command from the root directory:

```bash
docker compose up --build
```

### 3. Access the Services

- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:3000](http://localhost:3000)
- **pgAdmin (DB Viz)**: [http://localhost:5050](http://localhost:5050)

## 🔍 Exploration & Development

### Database Management

You can visualize and modify your database live at [http://localhost:5050](http://localhost:5050).

### Manual Data Import

To re-import or update your movie library from the JSON dump:

```bash
# Run seed script inside the API container
docker exec moviecea-api npm run seed
```

### Resetting the Environment

To stop the services and clear the database:

```bash
docker compose down -v
```

## 📂 Project Structure

- `api/`: NestJS backend source code and entities.
- `web/`: React frontend (Vite) source code and design system.
- `movies_dump.json`: Primary data source for the application library.
- `docker-compose.yml`: Orchestration for the DB, API, Web, and pgAdmin services.
