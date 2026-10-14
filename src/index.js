// An accessibility menu that sits in a corner of any page: a round button,
// and behind it a short list of switches that change how the site reads.
//
// How it works: each switch adds or removes a class on <html>
// (a11y-contrast, a11y-text-2, ...) and PAGE_CSS in styles.js does the
// rest. The menu itself is rendered inside a shadow root so the site's CSS
// cannot restyle it by accident, and the site tunes it through --a11y-*
// custom properties instead (see README).
//
// Choices are kept in localStorage and applied again on the next page.

import { STRINGS } from './strings.js';
import { PAGE_CSS, PANEL_CSS, TEXT_STEPS } from './styles.js';

/** @typedef {import('./index').Options} Options */
/** @typedef {import('./index').State} State */
/** @typedef {import('./index').FeatureId} FeatureId */

const TAG = 'a11y-widget';
const PAGE_STYLE_ID = 'a11y-widget-page';

/** @type {FeatureId[]} */
const ALL_FEATURES = ['textSize', 'contrast', 'links', 'font', 'spacing', 'motion'];

/** @type {State} */
const EMPTY = { textSize: 0, contrast: false, links: false, font: false, spacing: false, motion: false };

// Icons: plain strokes, drawn to a 24-box, coloured by currentColor.
const ICONS = {
  logo: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4.5" r="2.2"/><path d="M4 8.6c3 .8 5.6 1.2 8 1.2s5-.4 8-1.2l.5 1.9c-2.2.6-4 1-5.5 1.1v3.3l2.4 6.6-1.9.7-2.2-5.9h-.6l-2.2 5.9-1.9-.7 2.4-6.6v-3.3c-1.5-.1-3.3-.5-5.5-1.1z"/></svg>',
  contrast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg>',
  links: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>',
  font: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 20 11 4l7 16M6.5 14h9"/></svg>',
  spacing: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  motion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>',
};

/**
 * @param {string} key
 * @returns {State}
 */
function load(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { ...EMPTY };
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY };
  }
}

/**
 * @param {string} key
 * @param {State} state
 */
function save(key, state) {
  try {
    const dirty = Object.keys(state).some((k) => state[k] !== EMPTY[k]);
    if (dirty) localStorage.setItem(key, JSON.stringify(state));
    else localStorage.removeItem(key);
  } catch {
    // Storage blocked: the switches still work for this page.
  }
}

/** Reflect the state as classes on <html>. */
function applyToPage(state) {
  const root = document.documentElement;
  for (let i = 1; i < TEXT_STEPS.length; i++) root.classList.toggle(`a11y-text-${i}`, state.textSize === i);
  for (const id of ['contrast', 'links', 'font', 'spacing', 'motion']) root.classList.toggle(`a11y-${id}`, !!state[id]);
}

/** Make sure PAGE_CSS is in the document once. */
function ensurePageStyle() {
  if (document.getElementById(PAGE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = PAGE_STYLE_ID;
  style.textContent = PAGE_CSS;
  document.head.appendChild(style);
}

/**
 * Apply saved choices without rendering anything. Call this from a tiny
 * inline module in <head> when a flash of the un-adjusted page matters.
 * @param {string} [storageKey]
 */
export function applySavedPreferences(storageKey = 'a11y-widget') {
  ensurePageStyle();
  applyToPage(load(storageKey));
}

/**
 * Mount the widget. Safe to call once per page; returns handles.
 * @param {Options} [options]
 */
export function mountAccessibilityWidget(options = {}) {
  const lang = options.lang ?? (document.documentElement.lang || 'en').slice(0, 2);
  const t = { ...(STRINGS[lang] ?? STRINGS.en), ...(options.strings ?? {}) };
  const features = (options.features ?? ALL_FEATURES).filter((f) => ALL_FEATURES.includes(f));
  const storageKey = options.storageKey ?? 'a11y-widget';
  const position = options.position ?? 'inline-start';
  const motion = options.motion;

  ensurePageStyle();
  const state = load(storageKey);
  // A host that owns the motion switch (e.g. one that also reloads the
  // page) is the source of truth for it.
  if (motion) state.motion = !!motion.get();
  applyToPage(state);

  // ---- markup -----------------------------------------------------------
  const host = document.createElement(TAG);
  host.dataset.position = position;
  const shadow = host.attachShadow({ mode: 'open' });
  const style = document.createElement('style');
  style.textContent = PANEL_CSS;
  shadow.appendChild(style);

  const toggle = el('button', { class: 'toggle', type: 'button', 'aria-label': t.open, 'aria-expanded': 'false', 'aria-controls': 'panel', 'aria-haspopup': 'dialog' });
  toggle.innerHTML = ICONS.logo;

  const panel = el('div', { class: 'panel', id: 'panel', role: 'dialog', 'aria-labelledby': 'title', hidden: '' });
  const head = el('div', { class: 'head' });
  const title = el('h2', { id: 'title' }, t.title);
  const close = el('button', { class: 'close', type: 'button', 'aria-label': t.close }, '×');
  head.append(title, close);

  const list = el('ul', { class: 'list' });
  /** @type {Record<string, HTMLElement>} */
  const rows = {};

  for (const id of features) {
    const li = el('li');
    if (id === 'textSize') {
      const wrap = el('div', { class: 'size', role: 'group', 'aria-label': t.textSize });
      const label = el('span', { class: 'label' }, t.textSize);
      const minus = el('button', { type: 'button', 'aria-label': t.textSmaller }, 'A−');
      const out = el('output', { 'aria-live': 'polite' });
      const plus = el('button', { type: 'button', 'aria-label': t.textLarger }, 'A+');
      minus.addEventListener('click', () => set('textSize', Math.max(0, state.textSize - 1)));
      plus.addEventListener('click', () => set('textSize', Math.min(TEXT_STEPS.length - 1, state.textSize + 1)));
      wrap.append(label, minus, out, plus);
      rows.textSize = wrap;
      li.append(wrap);
    } else {
      const btn = el('button', { class: 'row', type: 'button', 'aria-pressed': 'false' });
      btn.innerHTML = ICONS[id] + `<span class="label">${t[id]}</span>`;
      btn.addEventListener('click', () => set(id, !state[id]));
      rows[id] = btn;
      li.append(btn);
    }
    list.append(li);
  }

  const foot = el('div', { class: 'foot' });
  const reset = el('button', { class: 'reset', type: 'button' }, t.reset);
  reset.addEventListener('click', () => {
    for (const id of features) set(id, EMPTY[id], true);
    render();
    emit();
  });
  foot.append(reset);
  if (options.statementUrl) foot.append(el('a', { href: options.statementUrl }, t.statement));

  panel.append(head, list, foot);
  shadow.append(toggle, panel);
  (options.container ?? document.body).appendChild(host);

  // ---- behaviour --------------------------------------------------------
  function render() {
    if (rows.textSize) {
      const [, minus, out, plus] = rows.textSize.children;
      out.textContent = `${TEXT_STEPS[state.textSize]}%`;
      minus.disabled = state.textSize === 0;
      plus.disabled = state.textSize === TEXT_STEPS.length - 1;
    }
    for (const id of ['contrast', 'links', 'font', 'spacing', 'motion']) {
      if (rows[id]) rows[id].setAttribute('aria-pressed', String(!!state[id]));
    }
  }

  function emit() {
    options.onChange?.({ ...state });
  }

  /**
   * @param {FeatureId} id
   * @param {number | boolean} value
   * @param {boolean} [quiet] skip render/emit (used by reset's loop)
   */
  function set(id, value, quiet = false) {
    if (state[id] === value) return;
    state[id] = value;
    save(storageKey, state);
    applyToPage(state);
    if (!quiet) {
      render();
      emit();
    }
    // The host's own motion switch runs last: it may reload the page.
    if (id === 'motion' && motion) motion.set(!!value);
  }

  function open() {
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onOutside, true);
    close.focus();
  }
  function closePanel(refocus = true) {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('pointerdown', onOutside, true);
    if (refocus) toggle.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape') closePanel();
  }
  function onOutside(e) {
    if (!e.composedPath().includes(host)) closePanel(false);
  }

  toggle.addEventListener('click', () => (panel.hidden ? open() : closePanel()));
  close.addEventListener('click', () => closePanel());

  render();

  return {
    host,
    open,
    close: closePanel,
    set,
    reset: () => reset.click(),
    get state() {
      return { ...state };
    },
    unmount() {
      closePanel(false);
      host.remove();
    },
  };
}

/**
 * @param {string} tag
 * @param {Record<string, string>} [attrs]
 * @param {string} [text]
 */
function el(tag, attrs = {}, text) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  if (text != null) node.textContent = text;
  return node;
}
