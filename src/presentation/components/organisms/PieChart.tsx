import styled, { useTheme } from 'styled-components';

export interface PieDatum {
  label: string;
  value: number;
}

interface PieChartProps {
  data: PieDatum[];
  size?: number;
  formatValue?: (value: number) => string;
}

const Wrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  flex-wrap: wrap;
`;

const Legend = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  min-width: 160px;
`;

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

const Swatch = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 2px;
  background: ${({ $color }) => $color};
`;

const Empty = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.typography.sizes.sm};
`;

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export function PieChart({
  data,
  size = 180,
  formatValue = (v) => v.toString(),
}: PieChartProps) {
  const theme = useTheme();
  const total = data.reduce((acc, d) => acc + d.value, 0);

  if (total === 0) {
    return <Empty>Sem dados para exibir.</Empty>;
  }

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  let angle = 0;
  const slices = data.map((d, i) => {
    const share = d.value / total;
    const start = angle;
    const end = angle + share * 360;
    angle = end;
    const color = theme.chart[i % theme.chart.length];
    const path =
      data.length === 1
        ? `M ${cx - r},${cy} a ${r},${r} 0 1,0 ${2 * r},0 a ${r},${r} 0 1,0 ${-2 * r},0`
        : arcPath(cx, cy, r, start, end);
    return { d, path, color, percentage: share * 100 };
  });

  return (
    <Wrapper>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label="Gráfico de pizza"
      >
        {slices.map((s) => (
          <path key={s.d.label} d={s.path} fill={s.color}>
            <title>{`${s.d.label}: ${formatValue(s.d.value)} (${s.percentage.toFixed(1)}%)`}</title>
          </path>
        ))}
      </svg>
      <Legend>
        {slices.map((s) => (
          <LegendItem key={s.d.label}>
            <Swatch $color={s.color} />
            <span>
              {s.d.label} — {formatValue(s.d.value)} ({s.percentage.toFixed(1)}%)
            </span>
          </LegendItem>
        ))}
      </Legend>
    </Wrapper>
  );
}
