// Two stylesheets. PAGE_CSS goes into the document head: it is what the
// switches do to the site, driven by classes on <html>. PANEL_CSS lives in
// the widget's shadow root, so the site's styles and the widget's never
// touch; only the custom properties (--a11y-*) cross that line, on purpose.

// Text sizes: steps 1–3 above the site's own size. Sites that size in rem
// scale as a whole; sites in px grow only where they inherit.
export const TEXT_STEPS = [100, 112.5, 125, 150];

export const PAGE_CSS = `
html.a11y-text-1 { font-size: ${TEXT_STEPS[1]}% !important; }
html.a11y-text-2 { font-size: ${TEXT_STEPS[2]}% !important; }
html.a11y-text-3 { font-size: ${TEXT_STEPS[3]}% !important; }

/* High contrast: black ground, white text, yellow links. Pictures, video,
   maps and icons are left alone so they stay readable. :where() keeps the
   catch-all's specificity low, so the link and button rules below win. */
html.a11y-contrast body,
html.a11y-contrast body :where(*:not(img):not(video):not(iframe):not(canvas):not(svg):not(svg *):not(a11y-widget)) {
  background-color: #000 !important;
  background-image: none !important;
  color: #fff !important;
  border-color: #fff !important;
  box-shadow: none !important;
  text-shadow: none !important;
}
html.a11y-contrast body a,
html.a11y-contrast body a *:not(svg):not(svg *) {
  color: #ffeb3b !important;
}
html.a11y-contrast body :is(button, [role="button"], input[type="submit"]) {
  outline: 2px solid #fff !important;
  outline-offset: 2px;
}
html.a11y-contrast body :focus-visible {
  outline: 3px solid #ffeb3b !important;
  outline-offset: 3px;
}

html.a11y-links body a {
  text-decoration: underline !important;
  text-decoration-thickness: 2px !important;
  text-underline-offset: 0.15em !important;
  font-weight: 700 !important;
}

html.a11y-font body,
html.a11y-font body :where(*:not(svg):not(svg *)) {
  font-family: Arial, Helvetica, "Noto Sans Hebrew", sans-serif !important;
  letter-spacing: 0.02em !important;
}

html.a11y-spacing body,
html.a11y-spacing body :where(*:not(svg):not(svg *)) {
  line-height: 1.8 !important;
  letter-spacing: 0.06em !important;
  word-spacing: 0.16em !important;
}
html.a11y-spacing body :is(p, li, dd, blockquote) {
  margin-block-end: 1.2em !important;
}

html.a11y-motion *,
html.a11y-motion *::before,
html.a11y-motion *::after {
  animation: none !important;
  transition: none !important;
  scroll-behavior: auto !important;
}
html.a11y-motion video[autoplay] {
  display: none !important;
}
`;

export const PANEL_CSS = `
:host {
  /* Every colour and size a site may want to tune, with a dark default. */
  --_accent: var(--a11y-accent, #f6b43a);
  --_bg: var(--a11y-bg, #15130f);
  --_fg: var(--a11y-fg, #f3eee4);
  --_muted: var(--a11y-muted, #a39c8e);
  --_line: var(--a11y-line, rgb(255 255 255 / 0.14));
  --_font: var(--a11y-font, system-ui, -apple-system, "Segoe UI", Arial, sans-serif);
  --_radius: var(--a11y-radius, 0.75rem);
  --_size: var(--a11y-button-size, 3rem);
  --_offset-block: var(--a11y-offset-block, 1.25rem);
  --_offset-inline: var(--a11y-offset-inline, 1.25rem);

  position: fixed;
  z-index: var(--a11y-z, 2147483000);
  inset-block-end: var(--_offset-block);
  font: 400 1rem/1.35 var(--_font);
  color: var(--_fg);
  direction: inherit;
}
:host([data-position="inline-start"]) { inset-inline-start: var(--_offset-inline); }
:host([data-position="inline-end"])   { inset-inline-end: var(--_offset-inline); }

*, *::before, *::after { box-sizing: border-box; }
button { font: inherit; color: inherit; cursor: pointer; }

.toggle {
  display: grid;
  place-items: center;
  width: var(--_size);
  height: var(--_size);
  border: 2px solid var(--_accent);
  border-radius: 50%;
  background: var(--_bg);
  color: var(--_accent);
  box-shadow: 0 6px 18px rgb(0 0 0 / 0.35);
  transition: transform 0.2s ease;
}
.toggle svg { width: 60%; height: 60%; }
.toggle:hover { transform: scale(1.06); }
.toggle:focus-visible, .panel :focus-visible {
  outline: 3px solid var(--_accent);
  outline-offset: 3px;
}

.panel {
  position: absolute;
  inset-block-end: calc(var(--_size) + 0.75rem);
  width: min(20rem, calc(100vw - 2 * var(--_offset-inline)));
  padding: 1rem;
  border: 1px solid var(--_line);
  border-radius: var(--_radius);
  background: var(--_bg);
  box-shadow: 0 16px 40px rgb(0 0 0 / 0.45);
}
:host([data-position="inline-start"]) .panel { inset-inline-start: 0; }
:host([data-position="inline-end"])   .panel { inset-inline-end: 0; }
.panel[hidden] { display: none; }

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 0.75rem;
}
.head h2 { margin: 0; font-size: 1.05rem; font-weight: 700; }
.close {
  width: 2rem; height: 2rem;
  border: 0; border-radius: 50%;
  background: transparent;
  color: var(--_muted);
  font-size: 1.4rem; line-height: 1;
}
.close:hover { color: var(--_fg); }

.list { display: grid; gap: 0.4rem; margin: 0; padding: 0; list-style: none; }

.row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  min-height: 2.6rem;
  padding: 0.45rem 0.7rem;
  border: 1px solid var(--_line);
  border-radius: calc(var(--_radius) * 0.6);
  background: transparent;
  text-align: start;
}
.row:hover { border-color: var(--_fg); }
.row[aria-pressed="true"] {
  background: var(--_accent);
  border-color: var(--_accent);
  color: #111;
}
.row svg { flex: none; width: 1.25rem; height: 1.25rem; }
.row .label { flex: 1; }

.size {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 2.6rem;
  padding: 0.3rem 0.3rem 0.3rem 0.7rem;
  border: 1px solid var(--_line);
  border-radius: calc(var(--_radius) * 0.6);
}
.size .label { flex: 1; }
.size output { min-width: 3.2ch; color: var(--_muted); font-variant-numeric: tabular-nums; text-align: center; }
.size button {
  width: 2rem; height: 2rem;
  border: 1px solid var(--_line);
  border-radius: 0.4rem;
  background: transparent;
  font-weight: 700;
}
.size button:disabled { opacity: 0.35; cursor: default; }
.size button:not(:disabled):hover { border-color: var(--_accent); color: var(--_accent); }

.foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-block-start: 0.85rem;
  padding-block-start: 0.75rem;
  border-block-start: 1px solid var(--_line);
  font-size: 0.875rem;
}
.foot a { color: var(--_fg); text-decoration: underline; text-underline-offset: 0.2em; }
.foot a:hover { color: var(--_accent); }
.reset { border: 0; background: transparent; color: var(--_muted); padding: 0.25rem 0; }
.reset:hover { color: var(--_fg); }

@media (prefers-reduced-motion: reduce) {
  .toggle { transition: none; }
}
`;
