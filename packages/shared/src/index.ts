/**
 * Public entry point for `@knoten/shared`.
 *
 * This package holds framework-agnostic code shared between the web and API
 * apps: Zod schemas (the single source of truth for contracts), the types
 * inferred from them, and pure utilities. It must never import from React,
 * NestJS, or any runtime-specific dependency.
 */
export * from './result';
export * from './validation';
export * from './workflow/workflow.schema';
