# @andzhelo/accessibility-widget

A small accessibility menu for any website. One round button in a corner; behind it, six switches:

- **Text size** — 100 / 112.5 / 125 / 150 %
- **High contrast** — black ground, white text, yellow links; pictures untouched
- **Highlight links** — underlined and bold
- **Readable font** — Arial / system sans, including Hebrew
- **Text spacing** — wider lines, letters and words
- **Stop animations** — CSS animations and transitions off, autoplaying video hidden

Plus a reset and a link to the site's accessibility statement. Hebrew and English are built in; RTL follows the page.

Zero dependencies, no build step, about 9 KB unminified. The menu renders in a shadow root, so the site's CSS cannot break it; the switches work by adding classes to `<html>`.

> This widget does **not** make a site accessible. It gives visitors a few adjustments that the Israeli regulations (IS 5568 / WCAG 2.0 AA) and the public expect to find. The site's own semantics, keyboard support, contrast and statement still have to be right.

## Install

```sh
# from a sibling checkout
npm install ../accessibility_widget

# or from GitHub, once pushed
npm install github:andzhelo/accessibility-widget
```

## Use

### Astro

```astro
<script>
  import { mountAccessibilityWidget } from '@andzhelo/accessibility-widget';

  mountAccessibilityWidget({
    statementUrl: document.documentElement.lang === 'he' ? '/accessibility/' : '/en/accessibility/',
  });
</script>
```

### Plain HTML

```html
<script type="module">
  import { mountAccessibilityWidget } from './node_modules/@andzhelo/accessibility-widget/src/index.js';
  mountAccessibilityWidget({ lang: 'he', statementUrl: '/accessibility.html' });
</script>
```

### Avoiding a flash

Saved choices are applied when `mountAccessibilityWidget` runs. If your script loads late, apply them first from a tiny module in `<head>`:

```html
<script type="module">
  import { applySavedPreferences } from '/path/to/index.js';
  applySavedPreferences();
</script>
```

## Options

| Option | Default | What it does |
|---|---|---|
| `lang` | `<html lang>` | `'he'` or `'en'`; others fall back to English |
| `strings` | — | Override any text, or supply another language (see `src/strings.js` for the keys) |
| `statementUrl` | — | Link at the bottom of the menu; omitted = no link |
| `features` | all six | Which switches, in which order: `'textSize' \| 'contrast' \| 'links' \| 'font' \| 'spacing' \| 'motion'` |
| `position` | `'inline-start'` | Corner: `inline-start` is bottom-left in LTR, bottom-right in RTL |
| `storageKey` | `'a11y-widget'` | localStorage key |
| `container` | `document.body` | Where the widget element is appended |
| `onChange` | — | `(state) => void` after any change |
| `motion` | — | `{ get(), set(on) }` — let the site own the "stop animations" switch (below) |

Returns `{ host, open(), close(), set(id, value), reset(), state, unmount() }`.

### When the site already has a motion switch

If the site decides at start-up whether to animate (GSAP, Lenis, a hero film) and reloads when the visitor turns motion off, tell the widget so both switches agree:

```js
mountAccessibilityWidget({
  motion: {
    get: () => localStorage.getItem('my-motion') === 'off',
    set: (on) => {
      if (on) localStorage.setItem('my-motion', 'off');
      else localStorage.removeItem('my-motion');
      location.reload();
    },
  },
});
```

The widget still adds `html.a11y-motion` (CSS animations stop at once); `set` runs last and may reload.

## Styling

The menu reads these custom properties from the page, so set them on `:root` or on `a11y-widget`:

```css
a11y-widget {
  --a11y-accent: #f6b43a;      /* button ring, active switches */
  --a11y-bg: #15130f;          /* button and panel background */
  --a11y-fg: #f3eee4;          /* text */
  --a11y-muted: #a39c8e;       /* secondary text */
  --a11y-line: rgb(255 255 255 / 0.14);
  --a11y-font: system-ui, sans-serif;
  --a11y-radius: 0.75rem;
  --a11y-button-size: 3rem;
  --a11y-offset-block: 1.25rem;   /* distance from the bottom edge */
  --a11y-offset-inline: 1.25rem;  /* distance from the side edge */
  --a11y-z: 2147483000;
}
```

## What the switches do to the page

Each switch toggles a class on `<html>`; the stylesheet `#a11y-widget-page` (injected once) does the rest:

| Class | Effect |
|---|---|
| `a11y-text-1/2/3` | `html { font-size }` at 112.5 / 125 / 150 % — sites sized in `rem` scale as a whole |
| `a11y-contrast` | black backgrounds, white text, yellow links, white outlines on buttons |
| `a11y-links` | underline + bold on every `<a>` |
| `a11y-font` | Arial / Helvetica everywhere except inside SVG |
| `a11y-spacing` | line-height 1.8, letter- and word-spacing, paragraph gaps |
| `a11y-motion` | `animation: none; transition: none`, autoplay video hidden |

A site can add its own rules against these classes where the defaults are not enough.

## Demo

```sh
npm run demo   # then open http://localhost:4400/demo/
```

## License

MIT
