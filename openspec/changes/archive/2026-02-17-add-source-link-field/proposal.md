## Why

Most events are reported in Discord conversations, but there's currently no way to link back to the original message for context or verification. Users need a way to trace back to the Discord conversation history where an event was first mentioned or reported.

## What Changes

- Add optional `source_link` field to the `stupid_events` database table to store Discord message URLs
- Update EventForm component to include a new input field for source links
  - Field label: "資料來源" (Data Source)
  - Placeholder text: "Discord 訊息連結" (Discord message link)
  - Field is optional (not required)
- Modify EventCard component to make event titles clickable
  - Display the `event_title` as before
  - When `source_link` is provided, wrap the title in a link that opens the Discord message
  - When `source_link` is empty, display title as plain text (no link)
- Update database schema in `specs/supabase-setup.sql`

## Capabilities

### New Capabilities
- `event-source-tracking`: Track and link to the original source of events (e.g., Discord message URLs) to enable users to trace conversation history

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Database**: `stupid_events` table - add `source_link` column (text, nullable)
- **Frontend Components**:
  - `app/src/components/EventForm.jsx` - add source link input field
  - `app/src/components/EventCard.jsx` - make title clickable when source link exists
- **SQL Schema**: `specs/supabase-setup.sql` - include new column in table definition
- **User Experience**: Users can now click event titles to jump to the original Discord conversation
