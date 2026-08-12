import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md';

interface ButtonProps {
  $variant?: Variant;
  $size?: Size;
  $block?: boolean;
}

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.primaryHover};
      border-color: ${({ theme }) => theme.colors.primaryHover};
    }
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceAlt};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
    border: 1px solid ${({ theme }) => theme.colors.danger};
    &:hover:not(:disabled) {
      filter: brightness(0.95);
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid transparent;
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surfaceAlt};
    }
  `,
} satisfies Record<Variant, ReturnType<typeof css>>;

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background 0.15s, border-color 0.15s, filter 0.15s;
  padding: ${({ $size = 'md', theme }) =>
    $size === 'sm'
      ? `${theme.spacing.xs} ${theme.spacing.sm}`
      : `${theme.spacing.sm} ${theme.spacing.md}`};
  font-size: ${({ $size = 'md', theme }) =>
    $size === 'sm' ? theme.typography.sizes.sm : theme.typography.sizes.md};
  width: ${({ $block }) => ($block ? '100%' : 'auto')};

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.focus};
    outline-offset: 2px;
  }

  ${({ $variant = 'primary' }) => variants[$variant]}
`;
