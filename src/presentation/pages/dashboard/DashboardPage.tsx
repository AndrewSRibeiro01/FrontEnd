import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/hooks/use-app-dispatch';
import { loadDashboard } from '../../../application/use-cases/dashboard';
import { loadFarms } from '../../../application/use-cases/farms';
import { loadProducers } from '../../../application/use-cases/producers';
import { Badge } from '../../components/atoms/Badge';
import { Card, CardTitle } from '../../components/atoms/Card';
import { Spinner } from '../../components/atoms/Spinner';
import { VStack } from '../../components/atoms/Stack';
import { EmptyState } from '../../components/molecules/EmptyState';
import { StatCard } from '../../components/molecules/StatCard';
import { BrazilMap } from '../../components/organisms/BrazilMap';
import { PieChart } from '../../components/organisms/PieChart';

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const MapGrid = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PageTitle = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.sizes.xl};
`;

const ErrorBox = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.dangerSoft};
  color: ${({ theme }) => theme.colors.danger};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StateHeader = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StateTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.sizes.lg};
`;

const FarmsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FarmItem = styled.li`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const FarmName = styled(Link)`
  font-weight: ${({ theme }) => theme.typography.weights.medium};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FarmMeta = styled.span`
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Placeholder = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const landUseLabel = (label: 'arable' | 'vegetation') =>
  label === 'arable' ? 'Área agricultável' : 'Área de vegetação';

const numberFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.dashboard);
  const farms = useAppSelector((state) =>
    state.farms.ids.map((id) => state.farms.byId[id]),
  );
  const producersById = useAppSelector((state) => state.producers.byId);

  const [selectedState, setSelectedState] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(loadDashboard());
    void dispatch(loadFarms());
    void dispatch(loadProducers());
  }, [dispatch]);

  const countByState = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const farm of farms) {
      counts[farm.state] = (counts[farm.state] ?? 0) + 1;
    }
    return counts;
  }, [farms]);

  const farmsInSelectedState = useMemo(
    () =>
      selectedState
        ? farms.filter((f) => f.state === selectedState)
        : [],
    [farms, selectedState],
  );

  return (
    <VStack $gap="lg">
      <PageTitle>Dashboard</PageTitle>

      {status === 'loading' && !data ? <Spinner /> : null}
      {error ? <ErrorBox role="alert">{error}</ErrorBox> : null}

      {data ? (
        <>
          <StatsGrid>
            <StatCard
              label="Fazendas cadastradas"
              value={numberFormat.format(data.totalFarms)}
            />
            <StatCard
              label="Hectares totais"
              value={numberFormat.format(data.totalHectares)}
              hint="Soma da área total de todas as fazendas."
            />
          </StatsGrid>

          <ChartsGrid>
            <Card>
              <CardTitle>Fazendas por estado</CardTitle>
              <PieChart data={data.farmsByState} />
            </Card>
            <Card>
              <CardTitle>Culturas plantadas</CardTitle>
              <PieChart data={data.cropsByName} />
            </Card>
            <Card>
              <CardTitle>Uso do solo</CardTitle>
              <PieChart
                data={data.landUse.map((slice) => ({
                  label: landUseLabel(slice.label),
                  value: slice.hectares,
                }))}
                formatValue={(v) => `${numberFormat.format(v)} ha`}
              />
            </Card>
          </ChartsGrid>

          <Card>
            <CardTitle>Mapa por estado</CardTitle>
            <MapGrid>
              <BrazilMap
                countByState={countByState}
                selected={selectedState}
                onSelect={setSelectedState}
              />
              <SidePanel>
                {selectedState ? (
                  <>
                    <StateHeader>
                      <StateTitle>Estado: {selectedState}</StateTitle>
                      <Badge>
                        {farmsInSelectedState.length} fazenda
                        {farmsInSelectedState.length === 1 ? '' : 's'}
                      </Badge>
                    </StateHeader>
                    {farmsInSelectedState.length === 0 ? (
                      <EmptyState
                        title="Sem fazendas neste estado"
                        description="Nenhum produtor tem propriedade cadastrada aqui."
                      />
                    ) : (
                      <FarmsList>
                        {farmsInSelectedState.map((farm) => {
                          const producer = producersById[farm.producerId];
                          return (
                            <FarmItem key={farm.id}>
                              <FarmName to={`/farms/${farm.id}`}>
                                {farm.name}
                              </FarmName>
                              <FarmMeta>
                                {farm.city} ·{' '}
                                {numberFormat.format(farm.totalHa)} ha
                                {producer ? ` · ${producer.name}` : ''}
                              </FarmMeta>
                            </FarmItem>
                          );
                        })}
                      </FarmsList>
                    )}
                  </>
                ) : (
                  <Placeholder>
                    Selecione um estado no mapa para ver as fazendas cadastradas
                    ali.
                  </Placeholder>
                )}
              </SidePanel>
            </MapGrid>
          </Card>
        </>
      ) : null}
    </VStack>
  );
}
