/**
 * The icon set, drawn Phosphor-style on a 256 viewBox and stroked, exactly as
 * in the design reference. Keystatic's icon pickers offer the keys of
 * CONTENT_ICONS; the rest are used by the layout itself.
 */
export const CONTENT_ICONS = {
  bulb: '<path d="M96 232h64"/><path d="M104 200h48"/><path d="M128 24a72 72 0 0 0-44 129c8 6 12 15 12 25v6h64v-6c0-10 4-19 12-25A72 72 0 0 0 128 24Z"/>',
  terminal: '<polyline points="48 80 104 128 48 176"/><line x1="128" y1="176" x2="208" y2="176"/>',
  magnifier: '<circle cx="112" cy="112" r="72"/><line x1="163" y1="163" x2="224" y2="224"/>',
  cube: '<path d="M128 24 224 72v112l-96 48-96-48V72Z"/><path d="M32 72l96 48 96-48"/><path d="M128 120v112"/>',
  layout: '<rect x="32" y="48" width="192" height="160" rx="12"/><path d="M32 96h192"/><path d="M104 96v112"/>',
  code: '<polyline points="64 88 16 128 64 168"/><polyline points="192 88 240 128 192 168"/><line x1="160" y1="40" x2="96" y2="216"/>',
  steering: '<circle cx="128" cy="128" r="96"/><circle cx="128" cy="128" r="28"/><path d="M100 128H32"/><path d="M156 128h68"/><path d="M128 156v68"/>',
  loop: '<path d="M176 96h48V48"/><path d="M224 96a100 100 0 1 0 0 64"/>',
  suitcase: '<rect x="48" y="72" width="160" height="136" rx="16"/><path d="M96 72V48h64v24"/><path d="M96 208v16"/><path d="M160 208v16"/><path d="M112 72v136"/><path d="M144 72v136"/>',
  timer: '<circle cx="128" cy="136" r="88"/><path d="M128 88v48h48"/><path d="M104 24h48"/>',
} as const;

export const ICONS = {
  ...CONTENT_ICONS,
  'arrow-right': '<line x1="40" y1="128" x2="216" y2="128"/><polyline points="144 56 216 128 144 200"/>',
  'arrows-left-right': '<polyline points="176 144 208 176 176 208"/><line x1="48" y1="176" x2="208" y2="176"/><polyline points="80 112 48 80 80 48"/><line x1="208" y1="80" x2="48" y2="80"/>',
  check: '<polyline points="40 144 96 200 224 72"/>',
} as const;

export type ContentIcon = keyof typeof CONTENT_ICONS;
export type IconName = keyof typeof ICONS;
export const CONTENT_ICON_NAMES = Object.keys(CONTENT_ICONS) as [ContentIcon, ...ContentIcon[]];
