# Knoten

Premium workflow automation platform (n8n-class canvas · Zapier approachability ·
Make execution visibility · Figma/Linear/Notion interaction standards).

Monorepo: pnpm + turbo.

- `apps/web` — React 19 + Vite + Tailwind v4 + `@xyflow/react` (canvas) + zustand +
  react-query + react-hook-form + zod + react-router.
- `apps/api` — backend.
- `packages/shared` — shared types/utilities. `packages/config-*` — shared configs.

## Design system — "Blaupause" (read before building any UI)

Two sources, one is executable and one is visual. They must not drift.

1. **Tokens (source of truth):** `apps/web/src/styles/globals.css`.
   Tailwind v4 `@theme inline` over semantic CSS variables. Use the generated
   utilities — **never hardcode hex values or raw Tailwind palette colors**
   (`bg-blue-600`, `text-gray-500`, `#fff` are all wrong).
2. **Visual spec (the full picture):** `docs/design/knoten-design-spec.html`
   — open in a browser. 20 sections: philosophy, IA, every surface (Dashboard,
   Builder, Node Library, AI Builder, Execution Viewer, Settings), components,
   color, type, motion, and all states. Mockups show the intended look per surface.

### The token vocabulary (use these class names)

- Surfaces: `bg-bg` (app ground) · `bg-surface` (cards/panels/nodes) ·
  `bg-surface-2` (hovers/wells) · borders `border-line` / `border-line-strong`.
- Text: `text-ink` (primary) · `text-ink-2` (secondary) · `text-ink-3` (muted/labels).
- Brand: `bg-accent text-on-accent` (one primary action per view) ·
  `text-accent-text` (links/accent text) · `bg-accent-soft` (selection, AI ghosts).
- Status (**reserved — never decorative**): `ok` (succeeded/healthy),
  `warn` (degraded/retrying/triggers), `err` (failed/destructive), each with a
  matching `-soft` ground. Green means _succeeded_, red means _failed/destructive_ —
  never "new" or "featured".
- Radii: `rounded-input` `rounded-btn` `rounded-card` `rounded-panel`.
  Elevation: `shadow-e1` (resting) `shadow-e2` (raised) `shadow-e3` (floating).
  Type: `font-sans` (Instrument Sans, UI) · `font-mono` (Geist Mono — IDs, payloads,
  expressions, timestamps). Both self-hosted via @fontsource, imported in `main.tsx`.
- Spacing: default Tailwind 4px scale (`p-4` = 16px = the canvas grid unit).

### Non-negotiable rules (from the spec)

- **Theming is automatic.** Semantic tokens flip via `[data-theme]` on `<html>`;
  build with `bg-surface text-ink` and it is correct in both themes. You should
  almost never need `dark:` — reach for it only when a token genuinely can't express
  the case. Verify every new surface in **both** light and dark.
- **Status is never color-alone** — always pair with an icon or a text label
  (accessibility, spec §20). Body text wears only `ink` tokens, never a status color.
- **One primary button per view.** Everything else is secondary/ghost.
- **Numbers use `tabular-nums`** (already on `body`) — keep it for metrics/durations.
- **Keyboard + speed first** (Linear): every action reachable via ⌘K; interactions
  respond < 100ms, optimistically when needed. Motion is fast, transform/opacity only,
  and honors `prefers-reduced-motion`.
- **Every state is designed:** empty (teach + fastest path + 3 templates), error
  (what happened / why / what now, always a next action), loading (tiered by
  duration; skeletons mirror real layout; mutations optimistic). See spec §17–19.
- **Accessibility gates release:** WCAG 2.2 AA, visible focus rings (already global),
  the canvas is keyboard-navigable and screen-reader exposed. Spec §20.

### If you change tokens

Edit `globals.css` only (Tailwind config references, never redefines). Run any
categorical chart palette through the dataviz validator before shipping — both
theme palettes are currently CVD-audited and passing.

## Commands

- `pnpm dev` — all apps (turbo). `pnpm --filter @knoten/web dev` — web only (:5173).
- `pnpm build` · `pnpm lint` · `pnpm typecheck` · `pnpm test` — all via turbo.
- `pnpm format` — prettier (with tailwindcss class sorting).
