## ADDED Requirements

### Requirement: Load saved preference on initialization

The system SHALL load the user's saved dark mode preference from localStorage when the app initializes and apply it to the UI.

#### Scenario: User has previously enabled dark mode
- **WHEN** app initializes and localStorage contains `darkMode: "true"`
- **THEN** app SHALL apply dark mode (add `dark` class to `<html>` element)
- **THEN** dark mode toggle button SHALL reflect dark mode state

#### Scenario: User has previously disabled dark mode
- **WHEN** app initializes and localStorage contains `darkMode: "false"`
- **THEN** app SHALL apply light mode (remove `dark` class from `<html>` element)
- **THEN** dark mode toggle button SHALL reflect light mode state

#### Scenario: No saved preference exists
- **WHEN** app initializes and localStorage does not contain `darkMode` key
- **THEN** app SHALL default to light mode
- **THEN** no error SHALL occur

### Requirement: Save preference on toggle

The system SHALL save the user's dark mode preference to localStorage whenever the user toggles dark mode.

#### Scenario: User enables dark mode
- **WHEN** user clicks the dark mode toggle button to enable dark mode
- **THEN** app SHALL save `darkMode: "true"` to localStorage
- **THEN** `dark` class SHALL be added to `<html>` element

#### Scenario: User disables dark mode
- **WHEN** user clicks the dark mode toggle button to disable dark mode
- **THEN** app SHALL save `darkMode: "false"` to localStorage
- **THEN** `dark` class SHALL be removed from `<html>` element

### Requirement: Handle localStorage errors gracefully

The system SHALL handle localStorage errors gracefully without crashing the app.

#### Scenario: localStorage is unavailable
- **WHEN** localStorage is unavailable (e.g., private browsing mode with restrictions)
- **THEN** app SHALL fall back to default light mode
- **THEN** dark mode toggle SHALL still function within the current session
- **THEN** no JavaScript errors SHALL be thrown

#### Scenario: Invalid stored value
- **WHEN** localStorage contains an invalid value for `darkMode` key (not "true" or "false")
- **THEN** app SHALL default to light mode
- **THEN** next toggle SHALL overwrite the invalid value with valid "true" or "false"

### Requirement: Persist across browser sessions

The system SHALL maintain the user's dark mode preference across browser sessions.

#### Scenario: User returns after closing browser
- **WHEN** user enables dark mode, closes the browser, and returns to the app
- **THEN** app SHALL load with dark mode enabled (from saved preference)

#### Scenario: User refreshes page
- **WHEN** user has dark mode enabled and refreshes the page
- **THEN** app SHALL maintain dark mode (no flash of light mode)
