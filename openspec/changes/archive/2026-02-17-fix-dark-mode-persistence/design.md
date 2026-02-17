## Context

The app currently implements dark mode using React state (`isDarkMode`) with a toggle in the header. The dark mode preference is stored only in component state, which means it resets to `false` (light mode) on every page refresh. The app applies dark mode by toggling the `dark` class on the `<html>` element, which Tailwind CSS uses to apply dark mode styles.

## Goals / Non-Goals

**Goals:**
- Persist user's dark mode preference across browser sessions
- Automatically restore saved preference when app loads
- Save preference immediately when user toggles dark mode
- Maintain current Tailwind CSS dark mode implementation

**Non-Goals:**
- Server-side user preference storage (no authentication in this app)
- Cross-device synchronization
- Dark mode auto-detection based on system preferences
- Migration of existing users (there are no saved preferences yet)

## Decisions

### localStorage for Persistence

**Decision**: Use browser localStorage to persist the dark mode preference.

**Rationale**:
- Simple, synchronous API suitable for a single boolean value
- No backend/database required
- Persists across browser sessions
- Immediate writes prevent data loss

**Alternatives Considered**:
- sessionStorage: Would not persist across browser sessions (rejected)
- Cookie: Unnecessary overhead for client-side-only preference (rejected)
- System preference detection (`prefers-color-scheme`): Would override user choice (could be added as fallback in future)

### Storage Key and Format

**Decision**: Use localStorage key `"darkMode"` with string values `"true"` or `"false"`.

**Rationale**:
- Clear, self-documenting key name
- String storage is native to localStorage (simpler than JSON)
- Boolean-like values are easy to parse

### Loading Strategy

**Decision**: Load preference during App component initialization (useState initializer function).

**Rationale**:
- Prevents flash of wrong theme on page load
- Runs once before first render
- Synchronous read is acceptable for single localStorage value

## Risks / Trade-offs

**[Risk]** Private browsing mode or disabled localStorage → **Mitigation**: Gracefully fall back to default light mode (no crashes)

**[Risk]** localStorage quota limits (unlikely for single boolean) → **Mitigation**: None needed - single key has negligible storage footprint

**[Trade-off]** No cross-device sync → **Accepted**: App has no authentication, cross-device sync would require backend changes (out of scope)

**[Trade-off]** Ignores system dark mode preference → **Accepted**: Explicit user choice takes precedence. Could add system preference as initial default in future if no saved preference exists.
