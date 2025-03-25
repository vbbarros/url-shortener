export interface RateLimitData {
  remaining: number;
  resetTime: number;
}

export interface RateLimitConfig {
  limit: number;
  windowMs: number;
} 