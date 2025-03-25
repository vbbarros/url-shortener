import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RateLimitService } from '../services/rate-limit.service';

@Injectable()
export class RateLimitInterceptor implements NestInterceptor {
  private readonly defaultConfig = {
    limit: 100,
    windowMs: 60000,
  };

  constructor(private readonly rateLimitService: RateLimitService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    const ip = request.ip || request.connection.remoteAddress;
    let config;
    let rateLimitData;

    try {
      config = this.rateLimitService.getConfig();
    } catch (error) {
      config = this.defaultConfig;
    }

    try {
      rateLimitData = this.rateLimitService.getRateLimitData(ip);
    } catch (error) {
      rateLimitData = {
        remaining: 0,
        resetTime: Date.now() + (config.windowMs || this.defaultConfig.windowMs),
      };
    }

    response.header('X-RateLimit-Limit', config.limit);
    response.header('X-RateLimit-Remaining', rateLimitData.remaining);
    response.header('X-RateLimit-Reset', new Date(rateLimitData.resetTime).toISOString());

    return next.handle();
  }
} 