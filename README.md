# 曲楷鈞公逸事

一個用來記錄那個誰的網站，支援新增事件、即時同步、搜尋與點讚。
A simple web app to record that person's events, with features like adding events, real-time sync, search, and likes.

## Features

- Event list (sorted by creation time in descending order)
- Add events (title, description, date, recorder, tags)
- Keyword search (currently searches event_title)
- Like (calls Supabase RPC: increment_likes)
- Supabase Realtime sync for inserts and updates
- Dark mode toggle


## Tech Stack

- React 19 + Vite 5
- Tailwind CSS 3
- Supabase (`@supabase/supabase-js`)
- date-fns、lucide-react

## Repo Structure

```text
.
├── app/                    # Frontend
│   ├── src/
│   ├── .env.example
│   └── package.json
├── specs/                  # Specifications and SQL scripts
│   ├── project-spec.md
│   ├── supabase-setup.sql
│   └── openapi-spec.yaml
└── README.md
```

## Quick Start

### 1. Install dependencies

```bash
cd app
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Set your Supabase project info:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the development server

```bash
npm run dev
```

Default: `http://localhost:5173`.

## Supabase setup

1. Create a project in Supabase.
2. Go to SQL Editor and execute `specs/supabase-setup.sql`.
3. Go to `Database > Replication` and enable Realtime for `stupid_events`.
4. Confirm that the `increment_likes(event_id uuid)` function exists.

### Important Schema Fields

The frontend uses the `event_title` field for the title and search functionality.

When creating the table, ensure `stupid_events` contains at least the following fields:

- `id` (uuid, primary key)
- `event_title` (text, not null)
- `event_description` (text, not null)
- `event_date` (date, not null)
- `recorder_name` (text, not null)
- `tags` (text[])
- `likes` (integer)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Available Scripts (in `app/` directory)

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally
- `npm run lint`: Run ESLint

## Deployment

The frontend is a standard Vite project that can be deployed to static hosting platforms like GitHub Pages, Vercel, Netlify, etc. Make sure to configure the corresponding environment variables before deployment.

## Related Documentation

- `specs/QUICK_START.md`: Specification-oriented quick guide
- `specs/project-spec.md`: Complete project specification
- `specs/openapi-spec.yaml`: API specification draft
