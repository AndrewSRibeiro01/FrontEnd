import styled from 'styled-components';

export const PageContainer = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
`;

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.typography.sizes.xl};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

export const PageLead = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;
