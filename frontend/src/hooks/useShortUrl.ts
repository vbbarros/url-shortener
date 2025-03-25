import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { shortUrlService } from '../services/short-url.service';
import { CreateShortUrlRequest, CreateShortUrlResponse, ShortUrl } from '../types/api';

export function useShortUrl() {
  const { user } = useAuth();
  const [urls, setUrls] = useState<ShortUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const fetchUserUrls = useCallback(async () => {
    if (!user) {
      setUrls([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await shortUrlService.getUserUrls();
      setUrls(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar URLs');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUserUrls();
  }, [user, fetchUserUrls, shouldRefetch]);

  const createShortUrl = async (data: CreateShortUrlRequest): Promise<CreateShortUrlResponse> => {
    try {
      setLoading(true);
      setError(null);
      const response = await shortUrlService.create(data);
      if (user) {
        setShouldRefetch(prev => !prev);
      }
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar URL encurtada');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    urls,
    loading,
    error,
    createShortUrl,
    fetchUserUrls,
  };
} 