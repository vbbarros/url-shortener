import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../Button';
import { Input } from '../Input';
import { Header } from '../Header';
import { UserUrls } from '../UserUrls';
import { useShortUrl } from '../../hooks/useShortUrl';
import { shortUrlService } from '../../services/short-url.service';
import * as S from './styles';

const urlSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

type FormData = z.infer<typeof urlSchema>;

export const URLShortener = () => {
  const [shortUrl, setShortUrl] = useState<string>('');
  const { createShortUrl, loading, error } = useShortUrl();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(urlSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await createShortUrl({ originalUrl: data.url });
      setShortUrl(shortUrlService.getShortUrlRedirectUrl(result.slug));
    } catch (error) {
      console.error('Error shortening URL:', error);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
  };

  return (
    <S.Container>
      <Header />
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Enter the URL to shorten"
          placeholder="https://example.com/foo/bar/biz"
          error={errors.url?.message}
          {...register('url')}
        />
        <Button type="submit" isLoading={loading}>
          Shorten
        </Button>
      </S.Form>

      {error && <S.Error>{error}</S.Error>}

      {shortUrl && (
        <S.ResultContainer>
          <S.SuccessMessage>Success! Here's your short URL:</S.SuccessMessage>
          <S.ShortUrlContainer>
            <S.ShortUrl href={shortUrl} target="_blank" rel="noopener noreferrer">
              {shortUrl}
            </S.ShortUrl>
            <Button variant="success" onClick={handleCopy}>
              Copy
            </Button>
          </S.ShortUrlContainer>
        </S.ResultContainer>
      )}

      <UserUrls />
    </S.Container>
  );
}; 