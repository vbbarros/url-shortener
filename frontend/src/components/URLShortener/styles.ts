import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  width: 100%;
  padding: ${theme.spacing.xl};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: ${theme.spacing.lg};
  }
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
`;

export const ResultContainer = styled.div`
  margin-top: ${theme.spacing.xl};
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const SuccessMessage = styled.p`
  color: ${theme.colors.success};
  font-size: ${theme.typography.sizes.md};
`;

export const ShortUrlContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: center;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const ShortUrl = styled.a`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.sizes.md};
  flex: 1;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

export const Error = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  margin-top: ${theme.spacing.sm};
`; 