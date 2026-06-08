# Design

Visual system for the SDN Thailand public website. Captured from the live codebase (`app/globals.css`, `tailwind.config.ts`, shared components). Keep new work consistent with these tokens; see [PRODUCT.md](PRODUCT.md) for the strategy behind them.

## Theme

Light-only. The color scheme is locked to light (`color-scheme: light` in `globals.css`) because the component layer hard-codes light surfaces (`bg-white`, `text-gray-*`); a real dark theme is not built yet, so auto dark mode is intentionally disabled. The identity is a single warm orange accent on near-black ink over clean white surfaces. The frame stays quiet so articles, news, and video are the focus; orange is used sparingly as the one moment of brand color. Dark values are retained below as a reference target for a future dark theme, not an active mode.

- **Color strategy:** Restrained. Tinted/neutral surfaces with one saturated accent (orange) carrying well under 10% of any screen, except deliberate dark anchors like the footer.
- **Surface inversion:** Footers and other anchor surfaces flip to the dark ink background, where the orange accent gets full contrast and reads as premium rather than loud.

## Color

Defined as CSS variables in `app/globals.css`. Hex values are the source of truth in code; OKLCH is given for reference when composing new tones.

### Brand

| Token | Light | Dark | Use |
|---|---|---|---|
| `--accent` | `#ff7834` | `#ff7834` | The one brand color. Buttons, links, active states, icon accents, focus rings. |
| accent hover | `#e86b2a` | `#e86b2a` | Hover/pressed for accent fills and links. |

**Accent contrast rule (important):** `#ff7834` on white is ~2.6:1, which fails AA for body text. Use it freely on **dark surfaces** (footer: ~11:1) and as **fills, underlines, icons, and focus rings** (no text-contrast requirement). For accent **text on light backgrounds**, keep the resting color a dark neutral and let orange be the hover/active + a non-color indicator (underline). Do not set small light-weight body or nav text to `#ff7834` on white as its only state.

### Neutrals

| Token | Light | Dark |
|---|---|---|
| `--background` | `#ffffff` | `#121212` |
| `--foreground` / `--primary` | `#1a1a1a` | `#f7f7f7` |
| `--secondary` | `#f7f7f7` | `#252525` |
| `--muted` | `#6e6e6e` | `#6e6e6e` |
| `--hover-bg` | `#f2f2f2` | `#2c2c2c` |

Dark anchor surface (footer): `#1a1a1a` background; text in `white` (headings) and `white/65–70` (body, ~9:1); secondary/legal text `white/50` (~5.7:1). Hairlines `white/10`.

### Status

- Success: accent fill, white text.
- Error: `#fee2e2` bg / `#991b1b` text.

## Typography

Two Thai-capable families, set in `tailwind.config.ts` and applied in `globals.css`.

- **Headings (`--font-heading`):** Seppuri, weight 500. All `h1`–`h6` and `.prose` headings. Tailwind: `font-seppuri`.
- **Body (`--font-body`):** IBM Plex Sans Thai Looped, weight 400, 16px, line-height 1.6. Tailwind: `font-ibm`.

Body line length should cap around 65–75ch for prose. Use `text-balance` (utility defined in `globals.css`) on short headings. Maintain ≥1.25 scale ratio between heading steps; lean on Seppuri 500 vs. IBM 400 weight contrast for hierarchy rather than adding more families. Cap families at these two (plus mono only if a real need appears).

## Layout & Spacing

- Content max width: `max-w-7xl` centered, with `px-4 sm:px-6 lg:px-8` gutters.
- Section rhythm via Tailwind spacing; vary generous vs. tight groupings rather than a flat scale.
- Responsive grids: prefer `repeat(auto-fit, minmax(280px, 1fr))` or flex-wrap for 1D; reserve CSS Grid for true 2D layouts.
- Border radius: small and restrained (`rounded`, `rounded-sm`, `rounded-lg`); full `rounded-full` for avatars, social chips, and the logo.
- Shadows: soft and low (`shadow-sm` for chrome, `shadow-lg` for menus/popovers). `.custom-sider` uses `0 4px 12px -2px rgba(0,0,0,0.08)`.

## Components

- **Navbar (`app/components/Navbar.tsx`):** White bar, `h-14`, light-weight links in `text-gray-700`, hover/active `#ff7834` with an animated bottom underline as the active indicator. Hover-intent submenus (200ms open delay) and a nested Data Center menu. Focus-visible rings in `#ff7834/60`.
- **Footer (`app/components/Footer.tsx`):** Dark `#1a1a1a` anchor with a 1px orange top rule. Four-region grid (brand / contact / quick links / social). Logo, `<address>` semantics, animated link hairline on hover, social chips (`bg-white/5` ring `white/10`, hover fills `#ff7834`). All meets AA.
- **Buttons / links (`globals.css`):** `.btn-primary` = accent fill, white text, hover `#e86b2a`. `.link-primary` = accent text with underline-on-hover (use on light backgrounds with care per the accent contrast rule).
- **Cards:** Use only when genuinely the best affordance; never nested. Soft radius + low shadow.

## Motion

- Defined keyframes: `fade-in` (0.5s ease-out, used for content), `shimmer` (1.5s loop, skeleton loaders).
- Transitions are color/opacity/transform only, ~200–300ms, ease-out. No bounce/elastic.
- **Reduced motion:** Every animation needs a `prefers-reduced-motion` fallback. New interactive code uses `motion-reduce:transition-none` (as in the footer/navbar underlines). Don't gate content visibility on a transition.

## Accessibility

Target WCAG 2.1 AA. Body text ≥4.5:1 (large ≥3:1); honor the accent contrast rule above. Visible focus via `focus-visible` rings, semantic HTML (`<address>`, `<nav>`, labeled controls, `aria-label` on icon-only buttons), and `alt` text on images. The active light theme passes AA throughout; a future dark theme must re-verify before being enabled.

## Internationalization

Thai-first UI. All copy in Thai; fonts (Seppuri, IBM Plex Sans Thai Looped) are chosen for Thai legibility across a wide age range. A Google Translate widget is styled in `globals.css`.
