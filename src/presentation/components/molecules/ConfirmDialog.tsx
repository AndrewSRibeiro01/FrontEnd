import { useEffect } from 'react';
import styled from 'styled-components';

import { Button } from '../atoms/Button';
import { HStack } from '../atoms/Stack';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 20, 15, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Panel = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 420px;
  width: calc(100% - 2rem);
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm};
`;

const Body = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textMuted};
`;

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <Backdrop onClick={onCancel} role="dialog" aria-modal="true">
      <Panel onClick={(e) => e.stopPropagation()}>
        <Title>{title}</Title>
        {description ? <Body>{description}</Body> : null}
        <HStack $justify="end" $gap="sm">
          <Button type="button" $variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            $variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </HStack>
      </Panel>
    </Backdrop>
  );
}
