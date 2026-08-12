import { useEffect } from 'react';
import styled from 'styled-components';

import {
  useAppDispatch,
  useAppSelector,
} from '../../../application/hooks/use-app-dispatch';
import { loadDashboard } from '../../../application/use-cases/dashboard';
import { Card, CardTitle } from '../../components/atoms/Card';
import { Spinner } from '../../components/atoms/Spinner';
import { VStack } from '../../components/atoms/Stack';
import { StatCard } from '../../components/molecules/StatCard';
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

const landUseLabel = (label: 'arable' | 'vegetation') =>
  label === 'arable' ? 'Área agricultável' : 'Área de vegetação';

const numberFormat = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
});

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    void dispatch(loadDashboard());
  }, [dispatch]);

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
        </>
      ) : null}
    </VStack>
  );
}
