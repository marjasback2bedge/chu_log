## Why

Users' dark mode preference is not persisted across page refreshes, causing the app to reset to light mode every time they reload. This creates a poor user experience as users must manually toggle dark mode on every visit.

## What Changes

- Add localStorage-based persistence for dark mode state
- Load saved dark mode preference on app initialization
- Save dark mode preference when user toggles it

## Capabilities

### New Capabilities
- `dark-mode-persistence`: Persist and restore user's dark mode preference across browser sessions using localStorage

### Modified Capabilities
<!-- No existing capabilities are being modified -->

## Impact

- **Code**: `app/src/App.jsx` - dark mode state initialization and toggle handler
- **Browser Storage**: Introduces localStorage usage with key `darkMode`
- **User Experience**: Dark mode preference will persist across page refreshes and browser sessions
