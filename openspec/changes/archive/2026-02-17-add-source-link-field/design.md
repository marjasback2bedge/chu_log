## Context

The app currently stores events in the `stupid_events` table with fields like `event_title`, `event_description`, `event_date`, etc. The EventForm component collects these details, and EventCard displays them. However, there's no way to reference the original source where an event was reported (typically Discord messages).

Most events are first mentioned in Discord conversations. Users want to be able to trace back to the original conversation for context, verification, or additional details. Currently, the event title is displayed as plain text in EventCard without any link.

## Goals / Non-Goals

**Goals:**
- Add `source_link` column to `stupid_events` table (nullable, no migration needed)
- Extend EventForm to collect optional source link with appropriate label and placeholder
- Make event titles in EventCard clickable when a source link is provided
- Update SQL schema file to include the new column
- Maintain backward compatibility (existing events without source links work fine)

**Non-Goals:**
- URL validation or format checking (trust user input)
- Auto-fetching Discord message metadata or embed previews
- Supporting multiple source links per event
- Explicitly supporting non-Discord sources (though the field accepts any URL)
- Migrating existing events to have source links (field is optional)

## Decisions

### Database Column: Nullable Text Type

**Decision**: Add `source_link` as a nullable `text` column to `stupid_events` table.

**Rationale**:
- **Nullable**: Field is optional - users may not always have a source link
- **Text type**: Flexible to store any URL length (Discord URLs can be long)
- **No default value**: Null clearly indicates "no source" vs. empty string

**Alternatives Considered**:
- VARCHAR with length limit: Rejected - Discord URLs can vary in length, text is safer
- Non-nullable with default '': Rejected - null is clearer for "no source"

### Conditional Link Rendering

**Decision**: In EventCard, conditionally render event title as a link only when `source_link` exists and is non-empty.

**Rationale**:
- Clear UX: Title is clickable only when there's somewhere to go
- Backward compatible: Existing events (source_link = null) display as plain text
- Simple implementation: `{source_link ? <a href={source_link}>{event_title}</a> : <h3>{event_title}</h3>}`

**Alternatives Considered**:
- Always show link icon: Rejected - clutters UI when no link available
- Show disabled link: Rejected - confusing UX

### External Link Behavior

**Decision**: Open source links in a new tab with `target="_blank"` and `rel="noopener noreferrer"`.

**Rationale**:
- **New tab**: Users don't lose their place in the event list
- **Security**: `rel="noopener noreferrer"` prevents window.opener access and referrer leakage
- **Standard practice**: Expected behavior for external links

### No URL Validation

**Decision**: Do not validate URL format in the frontend or backend.

**Rationale**:
- **Simplicity**: Keeps implementation lean, no regex or validation library needed
- **Flexibility**: Users can paste any link format (Discord, Slack, etc.)
- **Trust model**: This is a private/internal app, users are trusted
- **Browser behavior**: Invalid URLs simply won't work when clicked - natural feedback

**Alternatives Considered**:
- Regex validation: Rejected - adds complexity, may block valid edge cases
- Backend validation: Rejected - out of scope for this simple feature

### Form Field Placement

**Decision**: Place the source link field after the event description in EventForm.

**Rationale**:
- Logical flow: Title → Description → Source (optional metadata)
- Visual grouping: Keeps core content (title/description) together
- Optional field last: Users can skip if not needed

## Risks / Trade-offs

**[Risk]** Users enter invalid URLs → **Mitigation**: Links simply won't work when clicked; users will notice and can edit the event. No validation needed - natural consequence is sufficient.

**[Risk]** External links could be malicious → **Mitigation**: Use `rel="noopener noreferrer"` for security. This is an internal tool among friends, trust is assumed.

**[Trade-off]** No URL preview or validation → **Accepted**: Keeps implementation simple. Advanced features like link previews can be added later if needed.

**[Trade-off]** Single source link only → **Accepted**: Most events have one primary source. Multi-link support adds UI complexity without clear benefit.

**[Trade-off]** No migration for existing events → **Accepted**: Field is optional, existing events naturally have `null` source_link. No data migration needed.

## Migration Plan

### Database Migration

1. Add column to Supabase via SQL Editor or migration:
   ```sql
   ALTER TABLE stupid_events ADD COLUMN source_link text;
   ```

2. Update `specs/supabase-setup.sql` to include the column in CREATE TABLE statement

**Rollback**: If needed, drop the column:
```sql
ALTER TABLE stupid_events DROP COLUMN source_link;
```

### Frontend Deployment

No special migration needed:
- Existing events: `source_link` is `null`, titles display as plain text (unchanged behavior)
- New events: Users can optionally provide source link
- EventCard automatically handles both cases

**Rollback**: Revert frontend code changes. Database column can remain (unused) or be dropped.

### Zero-Downtime Deployment

This change is backward-compatible:
1. Deploy database migration first (adds nullable column)
2. Deploy frontend changes (reads new field, gracefully handles null)
3. No user impact during deployment

## Open Questions

None - design is straightforward and approved.
