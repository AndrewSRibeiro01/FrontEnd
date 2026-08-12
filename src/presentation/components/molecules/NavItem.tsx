import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(NavLink)`
  display: block;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

interface NavItemProps {
  to: string;
  end?: boolean;
  children: ReactNode;
}

export function NavItem({ to, end, children }: NavItemProps) {
  return (
    <StyledLink to={to} end={end}>
      {children}
    </StyledLink>
  );
}
