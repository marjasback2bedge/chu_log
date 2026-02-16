# 曲楷鈞公逸事 (chu_log)

## Project Overview
A fun event logging app for recording anecdotes about a friend (曲楷鈞). Built with React + Vite frontend and Supabase backend.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, lucide-react, date-fns
- **Backend**: Supabase (PostgreSQL, Realtime subscriptions, RPC)
- **Styling**: Warm color scheme (amber/orange/rose), glassmorphism header, animations

## Project Structure
```
app/
  src/
    App.jsx              # Main app - header, search, event grid, dark mode
    index.css            # Global styles, animations, custom scrollbar
    lib/supabaseClient.js # Supabase client config
    components/
      EventCard.jsx      # Event display card with like button
      EventForm.jsx      # New event creation form
      SearchBar.jsx      # Search by event title
  index.html             # Entry HTML
```

## Database Schema (Supabase)
Table: `stupid_events`
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, auto-generated |
| event_title | text | max 50 chars (was `person_name`, renamed) |
| event_description | text | max 1000 chars |
| event_date | date | |
| recorder_name | text | max 50 chars |
| tags | text[] | default '{}' |
| likes | integer | default 0, >= 0 |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

RPC: `increment_likes(event_id uuid)` - increments likes by 1

RLS is enabled on the table.

## Commands
- `cd app && npm run dev` - Start dev server
- `cd app && npm run build` - Production build

## Conventions
- All UI text is in Traditional Chinese (zh-TW)
- Warm color palette: amber-500, orange-500, rose-500
- Dark mode supported via `dark:` Tailwind classes
- No new dependencies unless absolutely necessary
