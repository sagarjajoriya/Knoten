import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { safeParse } from './validation';

describe('safeParse', () => {
  const schema = z.object({ id: z.string().min(1) });

  it('returns an ok result for valid input', () => {
    const result = safeParse(schema, { id: 'abc' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.id).toBe('abc');
    }
  });

  it('returns an err result for invalid input', () => {
    const result = safeParse(schema, { id: '' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(z.ZodError);
    }
  });
});
