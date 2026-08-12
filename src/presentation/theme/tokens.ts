export const theme = {
  colors: {
    background: '#f6f7f4',
    surface: '#ffffff',
    surfaceAlt: '#f0f2ec',
    border: '#dfe3d9',
    text: '#1f2a1c',
    textMuted: '#5b6a58',
    primary: '#2f6f3e',
    primaryHover: '#255933',
    primarySoft: '#e2f0e5',
    danger: '#b91c1c',
    dangerSoft: '#fdecec',
    warning: '#b45309',
    focus: '#2f6f3eaa',
  },
  chart: [
    '#2f6f3e',
    '#a1c181',
    '#e0a458',
    '#c1666b',
    '#4a7c9b',
    '#8a5cf5',
    '#f3b664',
    '#79b4b7',
    '#c25e5e',
    '#6a994e',
  ],
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    pill: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.08)',
  },
  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.25rem',
      xl: '1.75rem',
      xxl: '2.25rem',
    },
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  layout: {
    sidebarWidth: '240px',
    maxContent: '1200px',
  },
} as const;

export type AppTheme = typeof theme;
