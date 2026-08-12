import 'styled-components';
import type { AppTheme } from './tokens';

declare module 'styled-components' {
  export interface DefaultTheme extends AppTheme {}
}
