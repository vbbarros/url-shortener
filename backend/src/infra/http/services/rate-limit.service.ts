import { Injectable } from '@nestjs/common';
import { RateLimitData, RateLimitConfig } from '../interfaces/rate-limit.interface';

@Injectable()
export class RateLimitService {
  private readonly ipRateLimits: Map<string, RateLimitData> = new Map();
  private readonly config: RateLimitConfig = {
    limit: 10,
    windowMs: 60000, // 1 minute
  };

  getRateLimitData(ip: string): RateLimitData {
    const now = Date.now();
    const existingData = this.ipRateLimits.get(ip);

    if (!existingData || now >= existingData.resetTime) {
      // Initialize with limit - 1 to account for current request
      const newData: RateLimitData = {
        remaining: this.config.limit - 1,
        resetTime: now + this.config.windowMs,
      };
      this.ipRateLimits.set(ip, newData);
      return newData;
    }

    // Decrement remaining for current request
    existingData.remaining = Math.max(0, existingData.remaining - 1);
    return existingData;
  }

  getConfig(): RateLimitConfig {
    return this.config;
  }
} 