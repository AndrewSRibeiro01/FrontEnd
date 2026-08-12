import {
  formatDocument,
  isValidCnpj,
  isValidCpf,
  isValidDocument,
  stripDocument,
} from './document';

describe('stripDocument', () => {
  it('remove tudo que não for dígito', () => {
    expect(stripDocument('123.456.789-09')).toBe('12345678909');
    expect(stripDocument('12.345.678/0001-95')).toBe('12345678000195');
  });
});

describe('formatDocument', () => {
  it('aplica máscara de CPF quando tem 11 dígitos', () => {
    expect(formatDocument('12345678909')).toBe('123.456.789-09');
  });

  it('aplica máscara de CNPJ quando tem 14 dígitos', () => {
    expect(formatDocument('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('retorna dígitos crus quando o tamanho é inválido', () => {
    expect(formatDocument('123')).toBe('123');
  });
});

describe('isValidCpf', () => {
  it('aceita CPFs válidos', () => {
    expect(isValidCpf('39053344705')).toBe(true);
    expect(isValidCpf('52998224725')).toBe(true);
  });

  it('rejeita CPFs inválidos', () => {
    expect(isValidCpf('12345678900')).toBe(false);
    expect(isValidCpf('00000000000')).toBe(false);
    expect(isValidCpf('1234567890')).toBe(false);
  });
});

describe('isValidCnpj', () => {
  it('aceita CNPJs válidos', () => {
    expect(isValidCnpj('11222333000181')).toBe(true);
  });

  it('rejeita CNPJs inválidos', () => {
    expect(isValidCnpj('11111111111111')).toBe(false);
    expect(isValidCnpj('12345678000100')).toBe(false);
  });
});

describe('isValidDocument', () => {
  it('aceita string com máscara', () => {
    expect(isValidDocument('390.533.447-05')).toBe(true);
    expect(isValidDocument('11.222.333/0001-81')).toBe(true);
  });

  it('rejeita quando não tem 11 nem 14 dígitos', () => {
    expect(isValidDocument('123')).toBe(false);
  });
});
