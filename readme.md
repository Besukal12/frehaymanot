# Frehaymanot

A full-stack monorepo for a Christian education platform focused on managing and publishing Sunday school content. The project combines a public-facing website with an admin dashboard for content teams to manage mezmurs, courses, announcements, and user feedback.

## Overview

Frehaymanot is designed to help a church or educational organization organize and distribute:

- Mezmur resources and categories
- Course materials by grade and subject
- Weekly or event announcements
- Public feedback submissions from users

The platform is split into two main apps:

- `apps/web` — Next.js frontend for the public site and dashboard
- `apps/api` — Express API with Prisma + PostgreSQL for content and admin operations

---

## Project Goals

This project aims to provide:

- A clean public experience for browsing educational content
- An easy-to-manage admin dashboard for content owners
- Secure authenticated operations with Clerk
- Structured content storage with Prisma and PostgreSQL
- Media uploads with Cloudinary support for PDFs and thumbnails
- A scalable monorepo setup with PNPM workspaces

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Clerk authentication
- shadcn-style UI components

### Backend

- Express 5
- TypeScript
- Prisma ORM
- PostgreSQL
- Clerk middleware for auth
- Cloudinary for file uploads
- Zod validation

### Tooling

- PNPM workspaces
- Vitest for backend tests
- ESLint
- Prisma migrations

---

## Architecture

```text
frehaymanot/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   ├── src/
│   │   ├── test/
│   │   ├── .env
│   │   └── package.json
│   └── web/
│       ├── src/
│       ├── public/
│       ├── .env.local
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── readme.md
└── LICENSE (if added later)
```

### App responsibilities

- `apps/web`: public pages, dashboard, forms, navigation, authentication views
- `apps/api`: data access layer, routes, validation, auth checks, uploads, database logic
- `apps/api/prisma`: Prisma schema and database migrations

---

## Features

### 1. Mezmur management

- Create and organize mezmur categories
- Upload mezmur cover images and PDF files
- Browse mezmurs by category and title
- View mezmur detail pages
- Manage content from the admin dashboard

### 2. Course management

- Add course categories and educational grouping
- Upload thumbnails and PDFs for course materials
- Track grade levels
- Maintain a searchable experience for learners

### 3. Announcements

- Create announcement entries with title, slug, and content
- Attach thumbnail media
- Publish updates for the public site

### 4. Feedback system

- Public feedback form for users
- Admin area to review and delete submissions
- Basic pagination and sorting on the dashboard side

### 5. Admin dashboard

- Overview analytics cards
- Category management screens
- CRUD interfaces for content
- Secure protected routes using Clerk authentication

### 6. File upload support

- Image uploads
- PDF uploads
- Cloudinary integration for storage

---

## Authentication and Authorization

The project uses Clerk for authentication.

### Protected routes

- Dashboard and admin actions are guarded using Clerk middleware.
- The API checks user authentication and, in some routes, admin role access.
- The web app also protects `/dashboard` routes.

Relevant auth checks are implemented in:

- `apps/api/src/middleware/auth.middleware.ts`
- `apps/web/src/middleware.ts`

---

## Database Model

The Prisma schema includes the following main models:

- `MezmurCategory`
- `Mezmur`
- `CourseCategory`
- `Course`
- `Announcement`
- `Feedback`

This data model supports content-rich educational resources with metadata such as:

- title
- description
- category
- uploadedById
- thumbnail URL / storage ID
- PDF URL / storage ID
- timestamps

The schema is defined in:

- `apps/api/prisma/schema.prisma`

---

## Required Environment Variables

### API environment

Create `apps/api/.env` with the following structure:

```env
NODE_ENV=development
PORT=5000

DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Web environment

Create `apps/web/.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If you use Clerk on the frontend, make sure the proper Clerk environment keys are configured in the app as required by your Clerk setup.

> Never commit `.env` files with real secrets to version control.

---

## Installation

### 1. Install dependencies

From the project root:

```bash
pnpm install
```

### 2. Install app dependencies separately if needed

This monorepo is set up as a PNPM workspace, so root install is usually enough. If you want to install per app:

```bash
cd apps/api && pnpm install
cd ../web && pnpm install
```

---

## Running the Project

### Start both apps in development mode

From the root:

```bash
pnpm dev
```

This runs the API and web app together in parallel.

### Run API only

```bash
cd apps/api
pnpm dev
```

### Run web app only

```bash
cd apps/web
pnpm dev
```

### Build for production

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

---

## Useful Scripts

### Root package scripts

```json
{
  "scripts": {
    "dev": "pnpm --parallel --filter ./apps/* dev",
    "build": "pnpm --recursive build",
    "lint": "pnpm --recursive lint",
    "test": "pnpm --recursive test"
  }
}
```

### API scripts

```bash
cd apps/api
pnpm dev
pnpm build
pnpm start
pnpm test
pnpm lint
```

### Web scripts

```bash
cd apps/web
pnpm dev
pnpm build
pnpm start
pnpm lint
```

---

## Prisma Setup

This project uses Prisma for PostgreSQL access.

### Generate Prisma client

```bash
cd apps/api
npx prisma generate
```

### Run migrations

```bash
cd apps/api
npx prisma migrate deploy
```

### Create a new migration

```bash
cd apps/api
npx prisma migrate dev --name your_migration_name
```

---

## API Overview

### Base URL

```text
http://localhost:5000
```

### Main endpoint groups

#### Mezmur endpoints

- `POST /api/mezmur/categories-add`
- `GET /api/mezmur/categories-get`
- `PATCH /api/mezmur/categories-update/:id`
- `DELETE /api/mezmur/categories-delete/:id`
- `POST /api/mezmur/add`
- `GET /api/mezmur/get`
- `GET /api/mezmur/get/:id`
- `PATCH /api/mezmur/update/:id`
- `DELETE /api/mezmur/delete/:id`

#### Course endpoints

- `POST /api/course/categories`
- `GET /api/course/categories`
- `PATCH /api/course/categories/:id`
- `DELETE /api/course/categories/:id`
- `POST /api/course/create`
- `GET /api/course/get`
- `GET /api/course/get/:id`
- `PATCH /api/course/update/:id`
- `DELETE /api/course/delete/:id`

#### Announcement endpoints

- `POST /api/announcement/create`
- `GET /api/announcement/get`
- `GET /api/announcement/get/:id`
- `PATCH /api/announcement/update/:id`
- `DELETE /api/announcement/delete/:id`

#### Feedback endpoints

- `POST /api/feedback`
- `GET /api/feedback`
- `GET /api/feedback/:id`
- `DELETE /api/feedback/:id`

---

## Frontend Structure

The web app uses a Next.js app-router structure under `apps/web/src/app`.

Main sections include:

- public pages for announcements, courses, mezmurs, and feedback
- dashboard pages for managing content
- protected layouts and middleware for authentication
- shared UI components under `src/components`

### Example route areas

- `/` — landing page
- `/announcements` — public announcements page
- `/courses` — public course listing
- `/mezmurs` — public mezmur listing
- `/feedback` — user feedback form
- `/dashboard` — protected admin dashboard

---

## Testing

The API includes Vitest tests for key resources such as:

- announcements
- courses
- mezmurs
- feedback
- upload validation

Run them with:

```bash
cd apps/api
pnpm test
```

---

## Development Notes

### Local development

- Web frontend typically runs on `http://localhost:3000`
- API runs on `http://localhost:5000`
- Frontend API calls are configured through `NEXT_PUBLIC_API_URL`

### Media uploads

Uploaded thumbnails and PDFs are processed and stored via Cloudinary. Ensure your Cloudinary credentials are valid before using content creation routes.

### Admin workflows

Most content creation and deletion routes require authenticated admin access. This is enforced by Clerk-based middleware in the API.

---

## Contribution Guidelines

1. Create a feature branch
2. Use clear, descriptive commit messages
3. Keep the API and web app logic consistent with the project structure
4. Validate with linting and tests when modifying existing behavior
5. Ensure environment variables are not committed

---

## Deployment Notes

This project is ready for deployment as a monorepo with:

- a PostgreSQL database for Prisma
- a Node.js server for the API
- a Next.js app for the frontend
- Cloudinary for media storage
- Clerk for authentication

For production, set environment variables for all three services and ensure the database is migrated before startup.

---

## License

This project is currently licensed under the ISC license.

---

## Author

Created by Besukal.

---

## Summary

Frehaymanot is a modern content management platform for a church or educational institution, combining a public-facing web presence with a secure admin dashboard. It supports managing mezmurs, courses, announcements, and feedback through a PostgreSQL-backed API and a Next.js-powered frontend.

If you want to continue developing the project, start by installing dependencies, configuring the environment variables, and running the app using the commands in this README.
