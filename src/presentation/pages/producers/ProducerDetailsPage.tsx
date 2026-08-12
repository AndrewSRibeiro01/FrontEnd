import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/hooks/use-app-dispatch';
import { loadDashboard } from '../../../application/use-cases/dashboard';
import {
  createFarm,
  deleteFarm,
  loadFarms,
  updateFarm,
} from '../../../application/use-cases/farms';
import { loadProducers } from '../../../application/use-cases/producers';
import type { Farm, NewFarm } from '../../../domain/entities/farm';
import { formatDocument } from '../../../domain/validation/document';
import { Button } from '../../components/atoms/Button';
import { Card, CardTitle } from '../../components/atoms/Card';
import { Spinner } from '../../components/atoms/Spinner';
import { VStack } from '../../components/atoms/Stack';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { EmptyState } from '../../components/molecules/EmptyState';
import { FarmForm } from '../../components/organisms/FarmForm';
import { FarmList } from '../../components/organisms/FarmList';

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const BackLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function ProducerDetailsPage() {
  const { producerId = '' } = useParams<{ producerId: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const producer = useAppSelector((state) => state.producers.byId[producerId]);
  const farms = useAppSelector((state) =>
    state.farms.ids
      .map((id) => state.farms.byId[id])
      .filter((f) => f.producerId === producerId),
  );
  const farmsStatus = useAppSelector((state) => state.farms.status);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Farm | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Farm | null>(null);

  useEffect(() => {
    if (!producer) void dispatch(loadProducers());
  }, [dispatch, producer]);

  useEffect(() => {
    if (producerId) void dispatch(loadFarms(producerId));
  }, [dispatch, producerId]);

  const openCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (farm: Farm) => {
    setEditing(farm);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleSubmit = async (values: NewFarm) => {
    if (editing) {
      const { producerId: _unused, ...patch } = values;
      await dispatch(updateFarm(editing.id, patch));
    } else {
      await dispatch(createFarm(values));
    }
    void dispatch(loadDashboard());
    closeForm();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    await dispatch(deleteFarm(confirmDelete.id));
    setConfirmDelete(null);
    void dispatch(loadDashboard());
  };

  if (!producer) {
    return (
      <VStack $gap="lg">
        <BackLink to="/producers">← Voltar</BackLink>
        {farmsStatus === 'loading' ? (
          <Spinner />
        ) : (
          <EmptyState
            title="Produtor não encontrado"
            action={
              <Button onClick={() => navigate('/producers')}>
                Voltar para lista
              </Button>
            }
          />
        )}
      </VStack>
    );
  }

  return (
    <VStack $gap="lg">
      <BackLink to="/producers">← Produtores</BackLink>
      <Header>
        <div>
          <Title>{producer.name}</Title>
          <Meta>{formatDocument(producer.document)}</Meta>
        </div>
        {!showForm ? (
          <Button onClick={openCreate}>Nova fazenda</Button>
        ) : null}
      </Header>

      {showForm ? (
        <Card>
          <CardTitle>
            {editing ? 'Editar fazenda' : 'Nova fazenda'}
          </CardTitle>
          <FarmForm
            producerId={producer.id}
            initial={editing ?? undefined}
            onCancel={closeForm}
            onSubmit={handleSubmit}
          />
        </Card>
      ) : null}

      {farmsStatus === 'loading' && farms.length === 0 ? <Spinner /> : null}

      {farms.length === 0 && farmsStatus !== 'loading' && !showForm ? (
        <EmptyState
          title="Este produtor ainda não tem fazendas"
          description="Um produtor pode estar associado a 0, 1 ou mais propriedades rurais."
          action={<Button onClick={openCreate}>Adicionar fazenda</Button>}
        />
      ) : null}

      {farms.length > 0 ? (
        <FarmList
          items={farms}
          onEdit={openEdit}
          onDelete={setConfirmDelete}
        />
      ) : null}

      <ConfirmDialog
        open={!!confirmDelete}
        title="Excluir fazenda?"
        description={
          confirmDelete
            ? `Isto também remove as safras e culturas de ${confirmDelete.name}.`
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
