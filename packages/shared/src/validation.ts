import type { z } from 'zod';

import { err, ok, type Result } from './result';

/**
 * Safely parse an unknown value against a Zod schema, returning a `Result`
 * instead of throwing. Keeps validation boundaries explicit across the stack.
 */
export const safeParse = <TSchema extends z.ZodType>(
  schema: TSchema,
  input: unknown,
): Result<z.infer<TSchema>, z.ZodError<z.infer<TSchema>>> => {
  const parsed = schema.safeParse(input);
  return parsed.success ? ok(parsed.data) : err(parsed.error);
};
