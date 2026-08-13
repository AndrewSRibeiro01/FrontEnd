import brazilMap from '@svg-maps/brazil';
import { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';

interface BrazilMapProps {
  countByState: Record<string, number>;
  selected: string | null;
  onSelect: (state: string | null) => void;
}

interface Location {
  id: string;
  name: string;
  path: string;
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSvg = styled.svg`
  width: 100%;
  height: auto;
  display: block;

  path {
    stroke: ${({ theme }) => theme.colors.surface};
    stroke-width: 0.5;
    transition: fill 0.15s, stroke 0.15s, opacity 0.15s;
    cursor: pointer;
    outline: none;
  }

  path:focus-visible {
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 1.5;
  }

  path[data-selected='true'] {
    stroke: ${({ theme }) => theme.colors.text};
    stroke-width: 1.5;
  }
`;

const Caption = styled.p`
  margin: ${({ theme }) => theme.spacing.xs} 0 0;
  font-size: ${({ theme }) => theme.typography.sizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

function mix(a: string, b: string, ratio: number): string {
  const parse = (hex: string) => {
    const value = hex.replace('#', '');
    const full =
      value.length === 3
        ? value.split('').map((c) => c + c).join('')
        : value;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ] as const;
  };
  const [ar, ag, ab] = parse(a);
  const [br, bg, bb] = parse(b);
  const r = Math.round(ar + (br - ar) * ratio);
  const g = Math.round(ag + (bg - ag) * ratio);
  const bl = Math.round(ab + (bb - ab) * ratio);
  return `rgb(${r}, ${g}, ${bl})`;
}

export function BrazilMap({ countByState, selected, onSelect }: BrazilMapProps) {
  const theme = useTheme();
  const map = brazilMap as unknown as {
    viewBox: string;
    locations: Location[];
  };

  const maxCount = useMemo(() => {
    const values = Object.values(countByState);
    return values.length > 0 ? Math.max(...values) : 0;
  }, [countByState]);

  const fillFor = (uf: string): string => {
    const count = countByState[uf] ?? 0;
    if (count === 0 || maxCount === 0) return theme.colors.surfaceAlt;
    const ratio = count / maxCount;
    return mix(theme.colors.primarySoft, theme.colors.primary, ratio);
  };

  return (
    <Wrapper>
      <StyledSvg
        viewBox={map.viewBox}
        role="img"
        aria-label="Mapa do Brasil por estado"
        onClick={(e) => {
          if (e.target === e.currentTarget) onSelect(null);
        }}
      >
        {map.locations.map((location) => {
          const uf = location.id.toUpperCase();
          const isSelected = selected === uf;
          const count = countByState[uf] ?? 0;
          return (
            <path
              key={uf}
              d={location.path}
              fill={fillFor(uf)}
              data-selected={isSelected}
              tabIndex={0}
              role="button"
              aria-label={`${location.name}: ${count} fazenda${count === 1 ? '' : 's'}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(isSelected ? null : uf);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelect(isSelected ? null : uf);
                }
              }}
            >
              <title>{`${location.name} (${uf}) — ${count} fazenda${count === 1 ? '' : 's'}`}</title>
            </path>
          );
        })}
      </StyledSvg>
      <Caption>Clique num estado para ver as fazendas cadastradas nele.</Caption>
    </Wrapper>
  );
}
