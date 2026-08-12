import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';

import { theme } from '../../theme/tokens';
import { ProducerForm } from './ProducerForm';

function renderForm(props: Partial<React.ComponentProps<typeof ProducerForm>> = {}) {
  const onSubmit = jest.fn();
  render(
    <ThemeProvider theme={theme}>
      <ProducerForm onSubmit={onSubmit} {...props} />
    </ThemeProvider>,
  );
  return { onSubmit };
}

describe('ProducerForm', () => {
  it('exibe erro quando o documento é inválido', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByLabelText(/nome do produtor/i), 'João');
    await user.type(screen.getByLabelText(/cpf ou cnpj/i), '11111111111');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText(/inválido/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('exige o nome', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(screen.getByLabelText(/cpf ou cnpj/i), '390.533.447-05');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(await screen.findByText(/informe o nome/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('envia com documento normalizado e nome sem espaços quando válido', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderForm();

    await user.type(
      screen.getByLabelText(/nome do produtor/i),
      '  Maria Souza  ',
    );
    await user.type(screen.getByLabelText(/cpf ou cnpj/i), '390.533.447-05');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      document: '39053344705',
      name: 'Maria Souza',
    });
  });
});
