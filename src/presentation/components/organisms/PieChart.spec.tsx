import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';

import { theme } from '../../theme/tokens';
import { PieChart } from './PieChart';

function renderChart(data: { label: string; value: number }[]) {
  render(
    <ThemeProvider theme={theme}>
      <PieChart data={data} />
    </ThemeProvider>,
  );
}

describe('PieChart', () => {
  it('exibe mensagem vazia quando o total é zero', () => {
    renderChart([]);
    expect(screen.getByText(/sem dados/i)).toBeInTheDocument();
  });

  it('renderiza um <path> por fatia', () => {
    renderChart([
      { label: 'MG', value: 3 },
      { label: 'SP', value: 1 },
    ]);
    const svg = screen.getByRole('img');
    const paths = svg.querySelectorAll('path');
    expect(paths).toHaveLength(2);
  });

  it('renderiza um item de legenda por fatia', () => {
    renderChart([
      { label: 'Soja', value: 5 },
      { label: 'Milho', value: 2 },
      { label: 'Café', value: 1 },
    ]);
    const legend = screen.getByRole('list');
    expect(legend.querySelectorAll('li')).toHaveLength(3);
    expect(legend).toHaveTextContent(/Soja/);
    expect(legend).toHaveTextContent(/Milho/);
    expect(legend).toHaveTextContent(/Café/);
  });
});
