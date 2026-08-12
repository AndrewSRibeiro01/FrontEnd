import type { ReactNode } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  color: ${({ theme }) => theme.colors.textMuted};
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const Title = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const Body = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {description ? <Body>{description}</Body> : null}
      {action}
    </Wrapper>
  );
}
