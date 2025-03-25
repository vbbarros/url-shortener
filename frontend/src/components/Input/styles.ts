import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;
`;

export const Label = styled.label`
  font-size: ${theme.typography.sizes.sm};
  color: ${theme.colors.text};
`;

interface InputProps {
  hasError?: boolean;
}

export const Input = styled.input<InputProps>`
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
  font-size: ${theme.typography.sizes.md};
  width: 100%;
  transition: all 0.2s ease-in-out;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};

  ${({ hasError }) => hasError && css`
    border-color: red;
  `}

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

export const Error = styled.span`
  font-size: ${theme.typography.sizes.sm};
  color: red;
`; 