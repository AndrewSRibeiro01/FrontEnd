import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.typography.sizes.md};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }
  a { color: ${({ theme }) => theme.colors.primary}; text-decoration: none; }
  a:hover { color: ${({ theme }) => theme.colors.primaryHover}; }
`;
