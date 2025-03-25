import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useShortUrl } from '../../hooks/useShortUrl';
import { shortUrlService } from '../../services/short-url.service';
import { Button } from '../Button';
import {
  Container,
  Title,
  Error,
  Loading,
  UrlList,
  UrlItem,
  UrlInfo,
  OriginalUrl,
  ShortUrl,
  Stats,
  EmptyState,
} from './styles';

export function UserUrls() {
  const { user } = useAuth();
  const { urls, loading, error, fetchUserUrls } = useShortUrl();

  useEffect(() => {
    if (user) {
      fetchUserUrls();
    }
  }, [user, fetchUserUrls]);

  if (!user) {
    return null;
  }

  if (loading) {
    return <Loading>Carregando suas URLs...</Loading>;
  }

  if (error) {
    return <Error>Erro ao carregar suas URLs: {error}</Error>;
  }

  if (!urls || urls.length === 0) {
    return (
      <EmptyState>
        <p>Você ainda não tem URLs encurtadas.</p>
        <p>Use o formulário acima para criar sua primeira URL!</p>
      </EmptyState>
    );
  }

  return (
    <Container>
      <Title>Suas URLs</Title>
      <UrlList>
        {urls.map((url) => {
          const shortUrl = shortUrlService.getShortUrlRedirectUrl(url.slug);
          return (
            <UrlItem key={url.id}>
              <UrlInfo>
                <OriginalUrl>{url.originalUrl}</OriginalUrl>
                <ShortUrl href={shortUrl} target="_blank" rel="noopener noreferrer">
                  {shortUrl}
                </ShortUrl>
                <Stats>
                  <span>{url.visits} visitas</span>
                  <span>•</span>
                  <span>Criado em {new Date(url.createdAt).toLocaleDateString()}</span>
                </Stats>
              </UrlInfo>
              <Button
                variant="primary"
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                }}
              >
                Copiar
              </Button>
            </UrlItem>
          );
        })}
      </UrlList>
    </Container>
  );
} 