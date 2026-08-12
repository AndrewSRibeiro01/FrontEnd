import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Ring = styled.span`
  display: inline-block;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export function Spinner({ label = 'Carregando…' }: { label?: string }) {
  return <Ring role="status" aria-label={label} />;
}
