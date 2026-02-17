## 1. Update Dark Mode State Initialization

- [x] 1.1 Replace `useState(false)` with initializer function that loads from localStorage
- [x] 1.2 Add localStorage read with key `"darkMode"` to get saved preference
- [x] 1.3 Parse localStorage value ("true" → true, "false" → false, missing/invalid → false)
- [x] 1.4 Wrap localStorage read in try-catch to handle errors gracefully

## 2. Add Dark Mode Persistence on Toggle

- [x] 2.1 Update dark mode toggle button onClick handler to save to localStorage
- [x] 2.2 Save new dark mode value to localStorage with key `"darkMode"` as string ("true" or "false")
- [x] 2.3 Wrap localStorage write in try-catch to handle errors gracefully
- [x] 2.4 Ensure state update and localStorage save happen together

## 3. Manual Testing

- [ ] 3.1 Verify dark mode loads correctly when localStorage has "true"
- [ ] 3.2 Verify dark mode loads correctly when localStorage has "false"
- [ ] 3.3 Verify default light mode when localStorage is empty
- [ ] 3.4 Test toggle button saves preference to localStorage correctly
- [ ] 3.5 Verify preference persists after page refresh
- [ ] 3.6 Test graceful fallback when localStorage is unavailable (open in private mode)
- [ ] 3.7 Verify no console errors when localStorage operations fail
