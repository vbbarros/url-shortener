import { ButtonHTMLAttributes } from 'react';
import * as S from './styles';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'success';
  isLoading?: boolean;
  size?: 'small' | 'medium';
}

export const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  ...props 
}: ButtonProps) => {
  return (
    <S.Button
      variant={variant}
      size={size}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </S.Button>
  );
}; 