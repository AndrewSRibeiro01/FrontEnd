import styled, { css } from 'styled-components';

const fieldStyles = css`
  width: 100%;
  font-family: inherit;
  font-size: ${({ theme }) => theme.typography.sizes.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.15s, box-shadow 0.15s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primarySoft};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    cursor: not-allowed;
  }

  &[aria-invalid='true'] {
    border-color: ${({ theme }) => theme.colors.danger};
  }
`;

export const Input = styled.input`
  ${fieldStyles}
`;

export const Select = styled.select`
  ${fieldStyles}
  appearance: auto;
`;

export const TextArea = styled.textarea`
  ${fieldStyles}
  min-height: 5rem;
  resize: vertical;
`;
