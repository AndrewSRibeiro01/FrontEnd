import type { ReactNode } from 'react';
import styled from 'styled-components';

import { NavItem } from '../molecules/NavItem';

const Shell = styled.div`
  display: grid;
  grid-template-columns: ${({ theme }) => theme.layout.sidebarWidth} 1fr;
  min-height: 100vh;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Brand = styled.div`
  font-size: ${({ theme }) => theme.typography.sizes.lg};
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: -0.01em;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Main = styled.main`
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: ${({ theme }) => theme.layout.maxContent};
  width: 100%;
`;

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Shell>
      <Sidebar>
        <Brand>Brain Agriculture</Brand>
        <Nav>
          <NavItem to="/" end>
            Dashboard
          </NavItem>
          <NavItem to="/producers">Produtores</NavItem>
        </Nav>
      </Sidebar>
      <Main>{children}</Main>
    </Shell>
  );
}
