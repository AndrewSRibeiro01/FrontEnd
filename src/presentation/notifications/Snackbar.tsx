import styled, { css, keyframes } from 'styled-components';

export type SnackbarKind = 'success' | 'error' | 'info';

export interface SnackbarItem {
  id: number;
  kind: SnackbarKind;
  message: string;
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(24px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const Stack = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 1000;
  max-width: min(360px, calc(100vw - 2rem));
`;

const kindStyles = {
  success: css`
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  `,
  error: css`
    background: ${({ theme }) => theme.colors.danger};
    color: #fff;
  `,
  info: css`
    background: ${({ theme }) => theme.colors.text};
    color: #fff;
  `,
} satisfies Record<SnackbarKind, ReturnType<typeof css>>;

const Toast = styled.div<{ $kind: SnackbarKind }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
  animation: ${slideIn} 0.18s ease-out;
  ${({ $kind }) => kindStyles[$kind]}
`;

const Message = styled.span`
  flex: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 0;
  color: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  line-height: 1;
  cursor: pointer;
  padding: 0;
  opacity: 0.85;

  &:hover {
    opacity: 1;
  }
`;

interface SnackbarStackProps {
  items: SnackbarItem[];
  onDismiss: (id: number) => void;
}

export function SnackbarStack({ items, onDismiss }: SnackbarStackProps) {
  if (items.length === 0) return null;
  return (
    <Stack role="region" aria-label="Notificações">
      {items.map((item) => (
        <Toast key={item.id} $kind={item.kind} role="status">
          <Message>{item.message}</Message>
          <CloseButton
            type="button"
            aria-label="Fechar"
            onClick={() => onDismiss(item.id)}
          >
            ×
          </CloseButton>
        </Toast>
      ))}
    </Stack>
  );
}
