import { Injectable } from '@nestjs/common';

export interface HealthStatus {
  readonly status: 'ok';
  readonly uptimeSeconds: number;
}

@Injectable()
export class HealthService {
  check(): HealthStatus {
    return {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
