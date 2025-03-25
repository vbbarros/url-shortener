import { Module } from '@nestjs/common';
import { RateLimitInterceptor } from './interceptors/rate-limit.interceptor';
import { RateLimitService } from './services/rate-limit.service';

@Module({
  providers: [RateLimitInterceptor, RateLimitService],
  exports: [RateLimitInterceptor, RateLimitService],
})
export class HttpModule {} 