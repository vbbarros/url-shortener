import { Module } from '@nestjs/common';
import { AuthModule } from './infra/modules/auth.module';
import { HttpModule } from './infra/http/http.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RateLimitInterceptor } from './infra/http/interceptors/rate-limit.interceptor';
import { ShortUrlModule } from './infra/modules/short-url.module';

@Module({
  imports: [
    AuthModule,
    HttpModule,
    ShortUrlModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: RateLimitInterceptor,
    },
  ],
})
export class AppModule {}
