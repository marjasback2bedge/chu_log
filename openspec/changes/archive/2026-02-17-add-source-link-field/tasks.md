## 1. Database Migration

- [x] 1.1 Add `source_link` column to `stupid_events` table in Supabase (run `ALTER TABLE stupid_events ADD COLUMN source_link text;`)
- [x] 1.2 Verify column was added successfully by querying the table schema
- [x] 1.3 Update `specs/supabase-setup.sql` to include `source_link text` in CREATE TABLE statement

## 2. Update EventForm Component

- [x] 2.1 Add `source_link` field to form state initialization (default to empty string)
- [x] 2.2 Add source link input field to the form JSX after event description
- [x] 2.3 Set input label to "資料來源" (Data Source)
- [x] 2.4 Set input placeholder to "Discord 訊息連結" (Discord message link)
- [x] 2.5 Add onChange handler to update `source_link` in form state
- [x] 2.6 Include `source_link` in formData object when submitting to database

## 3. Update EventCard Component

- [x] 3.1 Read `source_link` field from event prop
- [x] 3.2 Add conditional rendering logic for event title: if source_link exists, render as `<a>` element; otherwise render as plain text
- [x] 3.3 For clickable titles, set `href` to `event.source_link`
- [x] 3.4 For clickable titles, add `target="_blank"` to open in new tab
- [x] 3.5 For clickable titles, add `rel="noopener noreferrer"` for security
- [x] 3.6 Ensure clickable title maintains the same styling as plain text title

## 4. Manual Testing - Event Creation

- [ ] 4.1 Test creating a new event WITH a source link (e.g., Discord URL)
- [ ] 4.2 Verify event is created successfully and source_link is stored in database
- [ ] 4.3 Test creating a new event WITHOUT a source link (leave field empty)
- [ ] 4.4 Verify event is created successfully with null source_link
- [ ] 4.5 Verify form field is truly optional (no validation errors when empty)

## 5. Manual Testing - Event Display

- [ ] 5.1 Verify events WITH source links display titles as clickable links
- [ ] 5.2 Click a source-linked title and verify it opens the correct URL in a new tab
- [ ] 5.3 Verify events WITHOUT source links display titles as plain text (not clickable)
- [ ] 5.4 Verify existing events (created before this feature) display correctly with null source_link
- [ ] 5.5 Verify link styling matches the original title styling (no visual break)

## 6. Manual Testing - Edge Cases

- [ ] 6.1 Test with an invalid URL (e.g., "not-a-url") - should store and render, but link won't work when clicked
- [ ] 6.2 Test with a very long URL - verify it stores correctly
- [ ] 6.3 Test with empty string vs null - both should display as plain text
- [ ] 6.4 Verify source links persist after page refresh
- [ ] 6.5 Verify source links are visible to all users (realtime updates work)
