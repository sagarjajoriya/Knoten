import { describe, expect, it } from 'vitest';

import { HealthService } from './health.service.js';

describe('HealthService', () => {
  it('reports an ok status', () => {
    const service = new HealthService();

    const result = service.check();

    expect(result.status).toBe('ok');
    expect(result.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
