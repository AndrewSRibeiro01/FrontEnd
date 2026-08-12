import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Farm } from '../../../domain/entities/farm';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const Item = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.md};
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: auto;
`;

interface FarmListProps {
  items: Farm[];
  onEdit: (farm: Farm) => void;
  onDelete: (farm: Farm) => void;
}

export function FarmList({ items, onEdit, onDelete }: FarmListProps) {
  return (
    <List>
      {items.map((f) => (
        <Item key={f.id}>
          <Header>
            <Title>
              <Link to={`/farms/${f.id}`}>{f.name}</Link>
            </Title>
            <Badge>{f.state}</Badge>
          </Header>
          <Meta>{f.city}</Meta>
          <Meta>
            {f.totalHa} ha totais · {f.arableHa} agricultável · {f.vegetationHa}{' '}
            vegetação
          </Meta>
          <Actions>
            <Button
              type="button"
              $variant="ghost"
              $size="sm"
              onClick={() => onEdit(f)}
            >
              Editar
            </Button>
            <Button
              type="button"
              $variant="ghost"
              $size="sm"
              onClick={() => onDelete(f)}
            >
              Excluir
            </Button>
          </Actions>
        </Item>
      ))}
    </List>
  );
}
