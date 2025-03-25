import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
  text-align: center;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  width: 100%;
`;

export const Error = styled.div`
  color: red;
  text-align: center;
  margin-bottom: ${theme.spacing.md};
  font-size: ${theme.typography.sizes.sm};
`;

export const Divider = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  margin: ${theme.spacing.lg} 0;
  color: ${theme.colors.text};
  font-size: ${theme.typography.sizes.sm};
  width: 100%;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid ${theme.colors.border};
  }

  &::before {
    margin-right: ${theme.spacing.md};
  }

  &::after {
    margin-left: ${theme.spacing.md};
  }
`;

export const Footer = styled.p`
  margin-top: ${theme.spacing.lg};
  text-align: center;
  font-size: ${theme.typography.sizes.sm};

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    font-weight: 600;
    margin-left: ${theme.spacing.xs};

    &:hover {
      text-decoration: underline;
    }
  }
`; 