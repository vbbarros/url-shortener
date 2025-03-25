import { IsUrl, IsString, IsOptional, MinLength } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  originalUrl: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  customSlug?: string;
} 