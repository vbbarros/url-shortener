import { InputHTMLAttributes, forwardRef } from 'react';
import * as S from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <S.Container>
        {label && <S.Label>{label}</S.Label>}
        <S.Input ref={ref} {...props} hasError={!!error} />
        {error && <S.Error>{error}</S.Error>}
      </S.Container>
    );
  }
); 