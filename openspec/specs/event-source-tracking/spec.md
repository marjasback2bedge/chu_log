## ADDED Requirements

### Requirement: Store optional source link for events

The system SHALL store an optional source link (URL) for each event in the database.

#### Scenario: Event created with source link
- **WHEN** user creates an event and provides a source link
- **THEN** system SHALL store the source link in the `source_link` field

#### Scenario: Event created without source link
- **WHEN** user creates an event without providing a source link
- **THEN** system SHALL store `null` in the `source_link` field
- **THEN** event SHALL be created successfully (field is optional)

#### Scenario: Existing events without source link
- **WHEN** querying existing events created before this feature
- **THEN** system SHALL return `null` for the `source_link` field
- **THEN** event display SHALL handle null gracefully

### Requirement: Collect source link in event form

The system SHALL provide an input field in the event creation form for users to optionally enter a source link.

#### Scenario: Form displays source link field
- **WHEN** user opens the event creation form
- **THEN** form SHALL display a source link input field
- **THEN** field label SHALL be "資料來源" (Data Source)
- **THEN** field placeholder SHALL be "Discord 訊息連結" (Discord message link)

#### Scenario: Source link field is optional
- **WHEN** user submits the form without filling the source link field
- **THEN** form SHALL accept the submission
- **THEN** event SHALL be created with `null` source link

#### Scenario: Source link field accepts any text
- **WHEN** user enters any text in the source link field
- **THEN** form SHALL accept the input without validation
- **THEN** system SHALL store the input as-is in the database

### Requirement: Display event title as clickable link when source exists

The system SHALL display the event title as a clickable link when a source link is provided.

#### Scenario: Event has source link
- **WHEN** displaying an event card where `source_link` is not null and not empty
- **THEN** event title SHALL be rendered as a clickable link (`<a>` element)
- **THEN** link text SHALL be the event title
- **THEN** link href SHALL be the source link URL

#### Scenario: Clicking title with source link
- **WHEN** user clicks an event title that has a source link
- **THEN** browser SHALL navigate to the source link URL
- **THEN** link SHALL open in a new tab (`target="_blank"`)
- **THEN** link SHALL include `rel="noopener noreferrer"` for security

### Requirement: Display event title as plain text when no source

The system SHALL display the event title as plain text when no source link is provided.

#### Scenario: Event has no source link
- **WHEN** displaying an event card where `source_link` is null or empty string
- **THEN** event title SHALL be rendered as plain text (not a link)
- **THEN** title SHALL display normally in the card header

#### Scenario: Clicking title without source link
- **WHEN** user clicks an event title that has no source link
- **THEN** nothing SHALL happen (title is not clickable)

### Requirement: Persist source link across sessions

The system SHALL persist the source link in the database and retrieve it when displaying events.

#### Scenario: Source link persists after page refresh
- **WHEN** user creates an event with a source link and refreshes the page
- **THEN** system SHALL retrieve the event with its source link from the database
- **THEN** event card SHALL display the title as a clickable link

#### Scenario: Source link persists for other users
- **WHEN** user A creates an event with a source link
- **THEN** user B SHALL see the same event with the clickable title link
- **THEN** clicking the link SHALL navigate to the same source URL
