export type FeatureId = 'textSize' | 'contrast' | 'links' | 'font' | 'spacing' | 'motion';

/** Every piece of text the widget shows. */
export interface Strings {
  open: string;
  close: string;
  title: string;
  textSize: string;
  textSmaller: string;
  textLarger: string;
  contrast: string;
  links: string;
  font: string;
  spacing: string;
  motion: string;
  reset: string;
  statement: string;
}

export interface State {
  /** 0 = the site's own size, then 112.5%, 125%, 150%. */
  textSize: number;
  contrast: boolean;
  links: boolean;
  font: boolean;
  spacing: boolean;
  motion: boolean;
}

export interface Options {
  /** 'he' or 'en' (built in). Defaults to <html lang>. Other values fall back to English unless `strings` is given. */
  lang?: string;
  /** Override any built-in text, or supply a whole other language. */
  strings?: Partial<Strings>;
  /** Link shown at the bottom of the menu. Omit to hide it. */
  statementUrl?: string;
  /** Which switches to show, in this order. Default: all. */
  features?: FeatureId[];
  /** Which corner the button sits in. Default: 'inline-start' (bottom-left in LTR, bottom-right in RTL). */
  position?: 'inline-start' | 'inline-end';
  /** localStorage key. Default: 'a11y-widget'. */
  storageKey?: string;
  /** Where to append the widget. Default: document.body. */
  container?: HTMLElement;
  /** Called after any change, with the full state. */
  onChange?: (state: State) => void;
  /**
   * Let the site own the "stop animations" switch, for example when it
   * already has one that reloads the page. `get` seeds the switch, `set`
   * runs after the widget has applied its own class.
   */
  motion?: { get: () => boolean; set: (on: boolean) => void };
}

export interface Widget {
  host: HTMLElement;
  open(): void;
  close(): void;
  set(id: FeatureId, value: number | boolean): void;
  reset(): void;
  readonly state: State;
  unmount(): void;
}

/** Mount the menu. Call once per page, after <body> exists. */
export function mountAccessibilityWidget(options?: Options): Widget;

/** Apply saved choices without rendering the menu (for an early inline script). */
export function applySavedPreferences(storageKey?: string): void;
