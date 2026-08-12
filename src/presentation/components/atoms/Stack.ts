import styled, { css } from 'styled-components';

import type { AppTheme } from '../../theme/tokens';

type SpaceKey = keyof AppTheme['spacing'];

interface StackProps {
  $gap?: SpaceKey;
  $align?: 'start' | 'center' | 'end' | 'stretch';
  $justify?: 'start' | 'center' | 'end' | 'space-between';
  $wrap?: boolean;
}

const alignMap: Record<NonNullable<StackProps['$align']>, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const justifyMap: Record<NonNullable<StackProps['$justify']>, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
};

const base = css<StackProps>`
  display: flex;
  gap: ${({ theme, $gap = 'md' }) => theme.spacing[$gap]};
  align-items: ${({ $align = 'stretch' }) => alignMap[$align]};
  justify-content: ${({ $justify = 'start' }) => justifyMap[$justify]};
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
`;

export const HStack = styled.div<StackProps>`
  ${base}
  flex-direction: row;
`;

export const VStack = styled.div<StackProps>`
  ${base}
  flex-direction: column;
`;
