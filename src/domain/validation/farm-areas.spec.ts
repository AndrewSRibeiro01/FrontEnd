import { validateFarmAreas } from './farm-areas';

describe('validateFarmAreas', () => {
  it('aceita quando a soma bate exatamente com o total', () => {
    expect(
      validateFarmAreas({ totalHa: 100, arableHa: 60, vegetationHa: 40 }),
    ).toBeNull();
  });

  it('aceita quando a soma é menor que o total', () => {
    expect(
      validateFarmAreas({ totalHa: 100, arableHa: 40, vegetationHa: 20 }),
    ).toBeNull();
  });

  it('rejeita quando arable + vegetation ultrapassa o total', () => {
    expect(
      validateFarmAreas({ totalHa: 100, arableHa: 70, vegetationHa: 40 }),
    ).toBe('sum-exceeds-total');
  });

  it('rejeita totais negativos', () => {
    expect(
      validateFarmAreas({ totalHa: -1, arableHa: 0, vegetationHa: 0 }),
    ).toBe('total-negative');
  });

  it('rejeita agricultável negativo', () => {
    expect(
      validateFarmAreas({ totalHa: 10, arableHa: -1, vegetationHa: 0 }),
    ).toBe('arable-negative');
  });

  it('rejeita vegetação negativa', () => {
    expect(
      validateFarmAreas({ totalHa: 10, arableHa: 0, vegetationHa: -1 }),
    ).toBe('vegetation-negative');
  });
});
