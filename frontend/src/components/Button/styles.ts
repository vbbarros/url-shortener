import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ButtonProps {
  variant: 'primary' | 'success';
  size: 'small' | 'medium';
}

export const Button = styled.button<ButtonProps>`
  padding: ${({ size }) => size === 'small' ? `${theme.spacing.xs} ${theme.spacing.md}` : `${theme.spacing.sm} ${theme.spacing.lg}`};
  border-radius: ${theme.borderRadius.md};
  border: none;
  font-size: ${({ size }) => size === 'small' ? theme.typography.sizes.sm : theme.typography.sizes.md};
  font-weight: 600;
  transition: all 0.2s ease-in-out;

  ${({ variant }) => css`
    background-color: ${theme.colors[variant]};
    color: ${theme.colors.background};

    &:hover:not(:disabled) {
      filter: brightness(0.9);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `}
`; 