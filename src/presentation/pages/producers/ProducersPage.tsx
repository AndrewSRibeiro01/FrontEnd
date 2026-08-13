import { useEffect, useMemo, useState } from 'react';
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
import { stripDocument } from '../../../domain/validation/document';
import { Button } from '../../components/atoms/Button';
import { Card, CardTitle } from '../../components/atoms/Card';
import { Input } from '../../components/atoms/Input';
import { Spinner } from '../../components/atoms/Spinner';
import { HStack, VStack } from '../../components/atoms/Stack';
import { ConfirmDialog } from '../../components/molecules/ConfirmDialog';
import { EmptyState } from '../../components/molecules/EmptyState';
import { FormField } from '../../components/molecules/FormField';
import { ProducerForm } from '../../components/organisms/ProducerForm';
import { ProducerList } from '../../components/organisms/ProducerList';
import { useNotify } from '../../notifications/notifications-context';

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

const FiltersCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.md};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export function ProducersPage() {
  const dispatch = useAppDispatch();
  const notify = useNotify();
  const { ids, byId, status, error } = useAppSelector(
    (state) => state.producers,
  );
  const producers = ids.map((id) => byId[id]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Producer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Producer | null>(null);
  const [nameFilter, setNameFilter] = useState('');
  const [documentFilter, setDocumentFilter] = useState('');

  useEffect(() => {
    void dispatch(loadProducers());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const name = nameFilter.trim().toLowerCase();
    const doc = stripDocument(documentFilter);
    return producers.filter((p) => {
      if (name && !p.name.toLowerCase().includes(name)) return false;
      if (doc && !p.document.includes(doc)) return false;
      return true;
    });
  }, [producers, nameFilter, documentFilter]);

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
      notify.success('Produtor atualizado com sucesso.');
    } else {
      await dispatch(createProducer(values));
      notify.success('Produtor cadastrado com sucesso.');
    }
    void dispatch(loadDashboard());
    closeForm();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const name = confirmDelete.name;
    try {
      await dispatch(deleteProducer(confirmDelete.id));
      notify.success(`Produtor "${name}" excluído.`);
    } catch (err) {
      notify.error(err instanceof Error ? err.message : 'Erro ao excluir.');
    }
    setConfirmDelete(null);
    void dispatch(loadDashboard());
  };

  const clearFilters = () => {
    setNameFilter('');
    setDocumentFilter('');
  };

  const hasFilters = nameFilter.trim() !== '' || documentFilter.trim() !== '';

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

      {producers.length > 0 ? (
        <FiltersCard>
          <FiltersGrid>
            <FormField label="Filtrar por nome">
              <Input
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                placeholder="Ex.: João"
              />
            </FormField>
            <FormField label="Filtrar por documento">
              <Input
                value={documentFilter}
                onChange={(e) => setDocumentFilter(e.target.value)}
                placeholder="CPF ou CNPJ"
                inputMode="numeric"
              />
            </FormField>
            <Button
              type="button"
              $variant="secondary"
              onClick={clearFilters}
              disabled={!hasFilters}
            >
              Limpar
            </Button>
          </FiltersGrid>
        </FiltersCard>
      ) : null}

      {status === 'loading' && producers.length === 0 ? <Spinner /> : null}

      {status !== 'loading' && producers.length === 0 && !showForm ? (
        <EmptyState
          title="Nenhum produtor cadastrado"
          description="Comece cadastrando um produtor rural para associar propriedades."
          action={<Button onClick={openCreate}>Cadastrar primeiro produtor</Button>}
        />
      ) : null}

      {producers.length > 0 && filtered.length === 0 ? (
        <EmptyState
          title="Nenhum produtor bate com os filtros"
          description="Ajuste os filtros ou limpe para ver todos os produtores."
          action={
            <Button $variant="secondary" onClick={clearFilters}>
              Limpar filtros
            </Button>
          }
        />
      ) : null}

      {filtered.length > 0 ? (
        <ProducerList
          items={filtered}
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
