export interface AuthResultDto {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
} 