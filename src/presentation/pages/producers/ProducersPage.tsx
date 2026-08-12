import { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/hooks/use-app-dispatch';
import {
  createProducer,
  deleteProducer,
  loadProducers,
  updateProducer,
} from '../../../application/use-cases/producers';
import { loadDashboard } from '../../../application/use-cases/dashboard';
import type { Producer } from '../../../domain/entities/producer';
import { Button } from '../../components/atoms/Button';
import { Card, CardTitle } from '../../components/atoms/Card';
import { Spinner } from '../../components/atoms/Spinner';
import { HStack, VStack } from '../../components/atoms/Stack';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { EmptyState } from '../../components/molecules/EmptyState';
import { ProducerForm } from '../../components/organisms/ProducerForm';
import { ProducerList } from '../../components/organisms/ProducerList';

const PageTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export function ProducersPage() {
  const dispatch = useAppDispatch();
  const { ids, byId, status, error } = useAppSelector(
    (state) => state.producers,
  );
  const producers = ids.map((id) => byId[id]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Producer | null>(null);

  useEffect(() => {
    void dispatch(loadProducers());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (producer: Producer) => {
    setEditing(producer);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (values: {
    document: string;
    name: string;
  }) => {
    if (editing) {
      await dispatch(updateProducer(editing.id, values));
    } else {
      await dispatch(createProducer(values));
    }
    void dispatch(loadDashboard());
    closeForm();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await dispatch(deleteProducer(confirmDelete.id));
    setConfirmDelete(null);
    void dispatch(loadDashboard());
  };

  return (
    <VStack $gap="lg">
      <HStack $justify="space-between" $align="center">
        <PageTitle>Produtores</PageTitle>
        {!showForm ? (
          <Button onClick={openCreate}>Novo produtor</Button>
        ) : null}
      </HStack>

      {error ? <ErrorBox role="alert">{error}</ErrorBox> : null}

      {showForm ? (
        <Card>
          <CardTitle>
            {editing ? 'Editar produtor' : 'Novo produtor'}
          </CardTitle>
          <ProducerForm
            initial={editing ?? undefined}
            submitLabel={editing ? 'Salvar alterações' : 'Cadastrar'}
            onCancel={closeForm}
            onSubmit={handleSubmit}
          />
        </Card>
      ) : null}

      {status === 'loading' && producers.length === 0 ? <Spinner /> : null}

      {status !== 'loading' && producers.length === 0 && !showForm ? (
        <EmptyState
          title="Nenhum produtor cadastrado"
          description="Comece cadastrando um produtor rural para associar propriedades."
          action={<Button onClick={openCreate}>Cadastrar primeiro produtor</Button>}
        />
      ) : null}

      {producers.length > 0 ? (
        <ProducerList
          items={producers}
          onEdit={openEdit}
          onDelete={setConfirmDelete}
        />
      ) : null}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir produtor?"
        description={
          confirmDelete
            ? `Isto também remove as fazendas, safras e culturas de ${confirmDelete.name}. A ação não pode ser desfeita.`
            : ''
        }
        confirmLabel="Excluir"
        destructive
        onCancel={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
      />
    </VStack>
  );
}
