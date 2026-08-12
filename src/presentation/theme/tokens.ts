export const theme = {
  colors: {
    background: '#fafafa',
    surface: '#ffffff',
    border: '#e5e7eb',
    text: '#1a1a1a',
    textMuted: '#6b7280',
    primary: '#166534',
    primaryHover: '#15803d',
    danger: '#b91c1c',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    sizes: {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.75rem',
    },
  },
} as const;

export type AppTheme = typeof theme;
