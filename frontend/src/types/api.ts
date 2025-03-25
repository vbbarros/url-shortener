export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateShortUrlRequest {
  originalUrl: string;
  customSlug?: string;
}

export interface ShortUrl {
  id: string;
  originalUrl: string;
  slug: string;
  visits: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShortUrlResponse extends ShortUrl {}

export interface GetUserUrlsResponse extends Array<ShortUrl> {} 