import api from './api';
import {
  CreateShortUrlRequest,
  CreateShortUrlResponse,
  ShortUrl,
} from '../types/api';

export const shortUrlService = {
  create: async (data: CreateShortUrlRequest): Promise<CreateShortUrlResponse> => {
    const response = await api.post<CreateShortUrlResponse>('/short-urls', data);
    return response.data;
  },

  getUserUrls: async (): Promise<ShortUrl[]> => {
    const response = await api.get<ShortUrl[]>('/short-urls/list');
    return response.data;
  },

  getShortUrlRedirectUrl: (slug: string): string => {
    return `http://localhost:3000/${slug}`;
  },
}; 