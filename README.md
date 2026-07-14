# Knoten

🪁 A lightweight, open-source visual workflow builder.

This repository is a **pnpm + Turborepo monorepo**. It currently contains only
the scaffolding — no product features yet.

## Requirements

- Node.js `>= 20`
- pnpm `>= 10` (`corepack enable` recommended)

## Getting started

```bash
pnpm install        # install every workspace
pnpm dev            # run all apps in watch mode (web + api)
pnpm build          # build everything (topologically ordered by Turborepo)
pnpm lint           # ESLint across the workspace
pnpm typecheck      # tsc project-reference build
pnpm test           # Vitest across the workspace
pnpm format         # Prettier write
```

Per-app dev servers:

- Web (Vite): http://localhost:5173
- API (NestJS): http://localhost:3000 — health check at `GET /health`

## Workspace layout

```
knoten/
├── apps/
│   ├── web/                 # React 19 + Vite client (React Router, Zustand,
│   │                        #   TanStack Query, React Flow, RHF, Zod)
│   └── api/                 # NestJS service (ESM)
├── packages/
│   ├── shared/              # @knoten/shared — framework-agnostic types,
│   │                        #   Zod schemas (the contract source of truth)
│   ├── config-typescript/   # @knoten/config-typescript — shared tsconfig bases
│   └── config-eslint/       # @knoten/config-eslint — shared flat ESLint configs
├── tsconfig.base.json       # strict compiler options inherited everywhere
├── turbo.json               # task graph + caching
└── pnpm-workspace.yaml
```

### Inside an app (feature-based)

```
apps/web/src/
├── app/          # composition root: providers, router
├── components/   # cross-feature shared UI
├── features/     # self-contained feature modules (added incrementally)
└── lib/          # app-level infrastructure (query client, etc.)

apps/api/src/
├── app.module.ts # composition root
└── modules/      # one NestJS module per feature (e.g. health/)
```

## Architectural decisions

- **Contracts live in `@knoten/shared`.** Zod schemas are the single source of
  truth; both apps infer their types from them, so the client and server can
  never drift.
- **Strict TypeScript, no `any`.** `tsconfig.base.json` enables `strict`,
  `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, etc., and ESLint
  bans `any` and unsafe operations as errors.
- **TypeScript project references** give fast, incremental, correctly-ordered
  builds. Each package uses a solution/build tsconfig split so tests and config
  files are type-checked and linted without being emitted into `dist`.
- **One ESLint flat config** at the root (`@knoten/config-eslint/monorepo`)
  applies the right ruleset per path. A single config keeps the editor,
  `pnpm lint`, and `lint-staged` perfectly consistent.
- **Turborepo** orchestrates and caches tasks with `^build` dependencies so
  `@knoten/shared` is always built before its consumers.
- **Husky + lint-staged** run ESLint and Prettier on staged files pre-commit.

## Path aliases

- `@/*` → `src/*` within each app (configured in both `tsconfig` and the Vite
  resolver).
- `@knoten/*` → workspace packages, resolved by pnpm.
