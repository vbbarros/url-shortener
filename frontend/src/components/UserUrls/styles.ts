import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.div`
  margin-top: ${theme.spacing.xl};
  width: 100%;
`;

export const Title = styled.h2`
  font-size: ${theme.typography.sizes.lg};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
`;

export const Error = styled.div`
  color: ${theme.colors.error};
  font-size: ${theme.typography.sizes.sm};
  margin-bottom: ${theme.spacing.md};
`;

export const Loading = styled.div`
  text-align: center;
  color: ${theme.colors.text};
  font-size: ${theme.typography.sizes.md};
  padding: ${theme.spacing.xl} 0;
`;

export const UrlList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

export const UrlItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

export const UrlInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

export const OriginalUrl = styled.div`
  color: ${theme.colors.text};
  font-size: ${theme.typography.sizes.sm};
  word-break: break-all;
`;

export const ShortUrl = styled.a`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.sizes.md};
  text-decoration: none;
  word-break: break-all;

  &:hover {
    text-decoration: underline;
  }
`;

export const Stats = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  color: ${theme.colors.text};
  font-size: ${theme.typography.sizes.sm};
  opacity: 0.8;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl} 0;
  color: ${theme.colors.text};
  opacity: 0.8;

  p {
    margin: ${theme.spacing.xs} 0;
    font-size: ${theme.typography.sizes.md};
  }
`; 