import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/hooks/use-app-dispatch';
import {
  createCrop,
  deleteCrop,
  loadCrops,
} from '../../../application/use-cases/crops';
import { loadDashboard } from '../../../application/use-cases/dashboard';
import { loadFarms } from '../../../application/use-cases/farms';
import {
  createHarvest,
  deleteHarvest,
  loadHarvests,
} from '../../../application/use-cases/harvests';
import { loadProducers } from '../../../application/use-cases/producers';
import { Badge } from '../../components/atoms/Badge';
import { Button } from '../../components/atoms/Button';
import { Card, CardTitle } from '../../components/atoms/Card';
import { Divider } from '../../components/atoms/Divider';
import { Spinner } from '../../components/atoms/Spinner';
import { HStack, VStack } from '../../components/atoms/Stack';
import { EmptyState } from '../../components/molecules/EmptyState';
import { CropForm } from '../../components/organisms/CropForm';
import { HarvestForm } from '../../components/organisms/HarvestForm';

const Title = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const Meta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const BackLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const CropList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CropChip = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.primarySoft};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radii.pill};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

export function FarmDetailsPage() {
  const { farmId = '' } = useParams<{ farmId: string }>();
  const dispatch = useAppDispatch();

  const farm = useAppSelector((state) => state.farms.byId[farmId]);
  const producer = useAppSelector((state) =>
    farm ? state.producers.byId[farm.producerId] : undefined,
  );
  const harvests = useAppSelector((state) =>
    state.harvests.ids
      .map((id) => state.harvests.byId[id])
      .filter((h) => h.farmId === farmId)
      .sort((a, b) => b.year - a.year),
  );
  const cropsByHarvest = useAppSelector((state) => {
    const map = new Map<string, typeof state.crops.byId[string][]>();
    for (const id of state.crops.ids) {
      const crop = state.crops.byId[id];
      const bucket = map.get(crop.harvestId) ?? [];
      bucket.push(crop);
      map.set(crop.harvestId, bucket);
    }
    return map;
  });

  useEffect(() => {
    if (!farm) {
      void dispatch(loadFarms());
      void dispatch(loadProducers());
    }
  }, [dispatch, farm]);

  useEffect(() => {
    if (farmId) void dispatch(loadHarvests(farmId));
  }, [dispatch, farmId]);

  useEffect(() => {
    for (const h of harvests) {
      void dispatch(loadCrops(h.id));
    }
    // We intentionally reload crops when harvest list changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, harvests.length]);

  if (!farm) {
    return (
      <VStack $gap="lg">
        <BackLink to="/producers">← Voltar</BackLink>
        <Spinner />
      </VStack>
    );
  }

  const handleAddHarvest = async (values: {
    farmId: string;
    year: number;
  }) => {
    await dispatch(createHarvest(values));
    void dispatch(loadDashboard());
  };

  const handleAddCrop = async (values: { harvestId: string; name: string }) => {
    await dispatch(createCrop(values));
    void dispatch(loadDashboard());
  };

  const handleDeleteCrop = async (id: string) => {
    await dispatch(deleteCrop(id));
    void dispatch(loadDashboard());
  };

  const handleDeleteHarvest = async (id: string) => {
    await dispatch(deleteHarvest(id));
    void dispatch(loadDashboard());
  };

  return (
    <VStack $gap="lg">
      {producer ? (
        <BackLink to={`/producers/${producer.id}`}>
          ← {producer.name}
        </BackLink>
      ) : (
        <BackLink to="/producers">← Produtores</BackLink>
      )}

      <div>
        <HStack $gap="sm" $align="center">
          <Title>{farm.name}</Title>
          <Badge>{farm.state}</Badge>
        </HStack>
        <Meta>{farm.city}</Meta>
        <Meta>
          {farm.totalHa} ha totais · {farm.arableHa} agricultável ·{' '}
          {farm.vegetationHa} vegetação
        </Meta>
      </div>

      <Card>
        <CardTitle>Safras</CardTitle>
        <HarvestForm farmId={farm.id} onSubmit={handleAddHarvest} />
        <Divider />

        {harvests.length === 0 ? (
          <EmptyState
            title="Sem safras registradas"
            description="Adicione a primeira safra desta fazenda para lançar culturas."
          />
        ) : (
          <VStack $gap="lg">
            {harvests.map((harvest) => {
              const crops = cropsByHarvest.get(harvest.id) ?? [];
              return (
                <div key={harvest.id}>
                  <HStack $gap="sm" $justify="space-between" $align="center">
                    <strong>{harvest.label}</strong>
                    <Button
                      type="button"
                      $variant="ghost"
                      $size="sm"
                      onClick={() => handleDeleteHarvest(harvest.id)}
                    >
                      Remover safra
                    </Button>
                  </HStack>
                  {crops.length > 0 ? (
                    <CropList>
                      {crops.map((crop) => (
                        <CropChip key={crop.id}>
                          {crop.name}
                          <button
                            type="button"
                            onClick={() => handleDeleteCrop(crop.id)}
                            aria-label={`Remover ${crop.name}`}
                            style={{
                              background: 'transparent',
                              border: 0,
                              color: 'inherit',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            ×
                          </button>
                        </CropChip>
                      ))}
                    </CropList>
                  ) : (
                    <Meta>Nenhuma cultura plantada nesta safra.</Meta>
                  )}
                  <div style={{ marginTop: '0.5rem' }}>
                    <CropForm
                      harvestId={harvest.id}
                      onSubmit={handleAddCrop}
                    />
                  </div>
                </div>
              );
            })}
          </VStack>
        )}
      </Card>
    </VStack>
  );
}
