// Every piece of text the widget shows, per language. A site can pass its own
// language under `strings` in the options (whole or partial), and `lang`
// picks one of these when it does not.

/** @type {Record<string, import('./index').Strings>} */
export const STRINGS = {
  he: {
    open: 'תפריט נגישות',
    close: 'סגירה',
    title: 'נגישות',
    textSize: 'גודל טקסט',
    textSmaller: 'הקטנת טקסט',
    textLarger: 'הגדלת טקסט',
    contrast: 'ניגודיות גבוהה',
    links: 'הדגשת קישורים',
    font: 'גופן קריא',
    spacing: 'ריווח טקסט',
    motion: 'עצירת אנימציות',
    reset: 'איפוס הגדרות',
    statement: 'הצהרת נגישות',
  },
  en: {
    open: 'Accessibility menu',
    close: 'Close',
    title: 'Accessibility',
    textSize: 'Text size',
    textSmaller: 'Smaller text',
    textLarger: 'Larger text',
    contrast: 'High contrast',
    links: 'Highlight links',
    font: 'Readable font',
    spacing: 'Text spacing',
    motion: 'Stop animations',
    reset: 'Reset settings',
    statement: 'Accessibility statement',
  },
};
