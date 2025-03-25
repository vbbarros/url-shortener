import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Container = styled.header`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-bottom: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md} ${theme.borderRadius.md} 0 0;
`;

export const Logo = styled.div`
  font-size: ${theme.typography.sizes.md};
  font-weight: 600;
  color: ${theme.colors.text};
`;

export const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  span {
    color: ${theme.colors.text};
    font-size: ${theme.typography.sizes.sm};
  }

  button {
    padding: ${theme.spacing.xs} ${theme.spacing.md};
    font-size: ${theme.typography.sizes.sm};
  }
`; 