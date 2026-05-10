# TipCalc — Mobile UX & Design TODO

## Critical (breaks usability)

- **Prevent native keyboard from opening on bill input.**
  The `<input type="number">` is tappable and triggers the system keyboard, conflicting with the custom keypad. Make it `readonly` (or replace it with a styled `<div>`) so only the keypad drives input. Also add `inputmode="none"` as a belt-and-suspenders guard.

- **Fix body flex layout.**
  `body` has `justify-content: center` and `align-items: center` but no `display: flex`, so those rules do nothing. Add `display: flex; flex-direction: column;` to the body so the layout actually works as intended.

- **Remove the stray extra `</div>` tag** at the bottom of `index.html` (line 144). It closes a div that was never opened and will cause rendering issues in strict parsers.

- **Remove the empty `.container-top` div.** It's a dead placeholder that adds invisible height and confuses the layout.

---

## High Priority (materially hurts the mobile experience)

- **Increase keypad button tap targets.**
  Buttons are currently `padding: 10px` with no minimum height. On mobile, Apple and Google both specify 44–48px minimum tap target height. Set `min-height: 60px` and bump `font-size` to `22px` on keypad buttons. The current targets are too small and cause mis-taps.

- **Add `:active` press state to keypad buttons.**
  There is no visual feedback when a button is tapped. Add a darker background on `:active` so users feel the button register (e.g., `#0d47a1`). This is essential on mobile where hover states don't exist.

- **Fix the layout so nothing requires scrolling on a standard phone screen.**
  Right now the results table is sandwiched between the controls and keypad, and the keypad sits at the bottom of the document flow. The user may have to scroll to see results. The keypad should be pinned to the bottom of the viewport (`position: sticky; bottom: 0`) and the content above should scroll if needed. Results should live directly above the keypad so they're always in view.

- **Make the Total row visually dominant.**
  The most important number (Total) looks the same as the bill and tip rows. It should be much larger — at least `font-size: 28px`, bold, and have a filled green background on the entire row (not just a border). The Tip row should also be visually elevated above the Bill and Effective Tip rows.

- **Remove the redundant "C" clear button next to the bill input.**
  There is already a `C` key on the keypad. Having two clear buttons for the same field adds confusion and wastes space in the header. Delete the `.clear-button` and the `<button class="clear-button">` from the HTML.

- **Prevent iOS from zooming in on input focus.**
  Any `<input>` with `font-size` below `16px` triggers an automatic zoom on iOS Safari, which breaks the layout. Set `font-size: 16px` minimum on all inputs, or (since the input is becoming readonly) ensure it can't receive focus at all.

---

## Medium Priority (polish and feel)

- **Show the bill amount as a large display, not a form input.**
  Replace the input field with a styled display area (e.g., a `<div>` or `<p>`) showing the formatted amount in a large font (32–40px). This is how calculator apps work. If you keep an actual `<input>`, style it to look like a display (no border, no background, large centered font, `readonly`).

- **Group the Tip % label, value, and slider into a single visual card.**
  Right now "Tip", "15%", and the slider are three separate inline elements that feel disconnected. Wrap them in a styled container that makes their relationship clear — label on the left, current value on the right, slider spanning full width below.

- **Increase the slider touch area.**
  The `<input type="range">` thumb is small. Use CSS pseudo-elements (`::-webkit-slider-thumb`, `::-moz-range-thumb`) to set thumb width/height to at least 28px and give it a visible, touch-friendly appearance.

- **Add smooth show/hide animation for the Survey section.**
  Currently it's `display: none` / `display: block`, which is an abrupt jump. Use `max-height` transition or a CSS class toggle so the survey panel slides open gracefully.

- **Replace the Survey table layout with CSS Grid or Flexbox.**
  `<table>` used for UI layout is semantically wrong and harder to style responsively. A grid with two columns achieves the same two-column label/select layout and scales better.

- **Make the tip option selector more mobile-friendly.**
  The `<select>` dropdown label text is verbose ("Round Tip Up", "Round Total Down"). Consider shortening the labels or using segmented button groups for the most common options (Exact / Round Up / Round Down) with Survey as a secondary toggle. Native `<select>` on mobile opens a full-screen picker which is fine, but the element itself needs more height (`min-height: 44px`).

- **Add `aria-label` to the slider and associate `tipValue` with it.**
  Use `aria-labelledby="tipValueLabel"` on the slider and add a `role="status"` to the live percentage display so screen readers announce changes.

- **Add padding to all container edges.**
  Content currently runs edge-to-edge on the screen. Add at least `16px` horizontal padding to containers so text and controls have breathing room on narrow phones.

---

## Low Priority (quality of life)

- **Add dark mode support.**
  Add a `@media (prefers-color-scheme: dark)` block that inverts the background/text colors and adjusts button colors. The current white-on-white design is harsh in dark environments (restaurants at night being the primary use case for this app).

- **Persist the bill amount in sessionStorage (not localStorage).**
  The bill amount clears on every reload which is intentional, but within the same session (e.g., rotating the phone) it should survive. Use `sessionStorage` so it survives refreshes but resets when the tab is closed.

- **Show a subtle "copied" toast when tapping the Total amount.**
  Add a tap handler to the Total row that copies the value to the clipboard and briefly shows a small toast ("Copied $42"). This is a natural action — users often want to paste the total into a payment app.

- **Replace Arial with a system font stack.**
  `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif` renders the native UI font on each platform (SF Pro on iOS, Roboto on Android), giving the app a more native feel with no download cost.

- **Add a `manifest.json` `display: standalone` check.**
  When running as an installed PWA, the browser chrome is hidden. The app should account for the iOS safe area insets at the bottom (home indicator). Add `padding-bottom: env(safe-area-inset-bottom)` to the keypad container so buttons aren't clipped on iPhone X and later.

- **Consider splitting Effective Tip % out of the results table.**
  "Effective Tip" is a detail that matters when using rounding modes. It could live as a small secondary label near the slider rather than as a primary result row, freeing space in the results table for the three numbers users actually care about (Bill, Tip, Total).
