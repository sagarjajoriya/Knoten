import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HealthModule } from './modules/health/health.module.js';

/**
 * Composition root of the API. Feature modules are imported here; each module
 * owns its own controllers, services and providers (feature-based structure).
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    HealthModule,
  ],
})
export class AppModule {}
