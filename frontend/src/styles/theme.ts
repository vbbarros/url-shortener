export const theme = {
  colors: {
    primary: '#4C6EF5',
    success: '#2B8A3E',
    error: '#E03131',
    background: '#FFFFFF',
    text: '#1A1A1A',
    border: '#E5E5E5',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
    },
  },
} as const;

export type Theme = typeof theme; 