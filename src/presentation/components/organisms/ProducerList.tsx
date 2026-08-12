import { Link } from 'react-router-dom';
import styled from 'styled-components';

import type { Producer } from '../../../domain/entities/producer';
import { formatDocument } from '../../../domain/validation/document';
import { Button } from '../atoms/Button';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  overflow: hidden;

  th, td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    font-size: ${({ theme }) => theme.typography.sizes.sm};
  }
  th {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    font-weight: ${({ theme }) => theme.typography.weights.medium};
    color: ${({ theme }) => theme.colors.textMuted};
  }
  tbody tr:last-child td {
    border-bottom: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  justify-content: flex-end;
`;

interface ProducerListProps {
  items: Producer[];
  onEdit: (producer: Producer) => void;
  onDelete: (producer: Producer) => void;
}

export function ProducerList({ items, onEdit, onDelete }: ProducerListProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Documento</th>
          <th style={{ width: '1%' }}></th>
        </tr>
      </thead>
      <tbody>
        {items.map((p) => (
          <tr key={p.id}>
            <td>
              <Link to={`/producers/${p.id}`}>{p.name}</Link>
            </td>
            <td>{formatDocument(p.document)}</td>
            <td>
              <Actions>
                <Button
                  type="button"
                  $variant="ghost"
                  $size="sm"
                  onClick={() => onEdit(p)}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  $variant="ghost"
                  $size="sm"
                  onClick={() => onDelete(p)}
                >
                  Excluir
                </Button>
              </Actions>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
