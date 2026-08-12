import { useState, type FormEvent } from 'react';

import { BRAZILIAN_STATES } from '../../../domain/entities/brazilian-state';
import type { Farm, NewFarm } from '../../../domain/entities/farm';
import { validateFarmAreas } from '../../../domain/validation/farm-areas';
import { Button } from '../atoms/Button';
import { Input, Select } from '../atoms/Input';
import { HStack, VStack } from '../atoms/Stack';
import { FormField } from '../molecules/FormField';

interface FarmFormProps {
  producerId: string;
  initial?: Farm;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: NewFarm) => Promise<void> | void;
}

interface FormState {
  name: string;
  city: string;
  state: string;
  totalHa: string;
  arableHa: string;
  vegetationHa: string;
}

interface Errors {
  name?: string;
  city?: string;
  state?: string;
  totalHa?: string;
  arableHa?: string;
  vegetationHa?: string;
  areas?: string;
  general?: string;
}

const initialFormState: FormState = {
  name: '',
  city: '',
  state: '',
  totalHa: '',
  arableHa: '',
  vegetationHa: '',
};

function fromFarm(farm: Farm): FormState {
  return {
    name: farm.name,
    city: farm.city,
    state: farm.state,
    totalHa: String(farm.totalHa),
    arableHa: String(farm.arableHa),
    vegetationHa: String(farm.vegetationHa),
  };
}

function parseNumber(value: string): number {
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Informe o nome da fazenda.';
  if (!values.city.trim()) errors.city = 'Informe a cidade.';
  if (!values.state) errors.state = 'Selecione o estado.';

  const total = parseNumber(values.totalHa);
  const arable = parseNumber(values.arableHa);
  const vegetation = parseNumber(values.vegetationHa);
  if (!Number.isFinite(total) || total < 0)
    errors.totalHa = 'Área total inválida.';
  if (!Number.isFinite(arable) || arable < 0)
    errors.arableHa = 'Área agricultável inválida.';
  if (!Number.isFinite(vegetation) || vegetation < 0)
    errors.vegetationHa = 'Área de vegetação inválida.';

  if (!errors.totalHa && !errors.arableHa && !errors.vegetationHa) {
    const areaError = validateFarmAreas({
      totalHa: total,
      arableHa: arable,
      vegetationHa: vegetation,
    });
    if (areaError === 'sum-exceeds-total') {
      errors.areas =
        'A soma das áreas agricultável e de vegetação não pode ultrapassar a área total.';
    }
  }
  return errors;
}

export function FarmForm({
  producerId,
  initial,
  submitLabel = 'Salvar fazenda',
  onCancel,
  onSubmit,
}: FarmFormProps) {
  const [values, setValues] = useState<FormState>(
    initial ? fromFarm(initial) : initialFormState,
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof FormState>(key: K, v: FormState[K]) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSubmitting(true);
    try {
      await onSubmit({
        producerId,
        name: values.name.trim(),
        city: values.city.trim(),
        state: values.state as NewFarm['state'],
        totalHa: parseNumber(values.totalHa),
        arableHa: parseNumber(values.arableHa),
        vegetationHa: parseNumber(values.vegetationHa),
      });
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Erro ao salvar.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <VStack $gap="md">
        <FormField label="Nome da fazenda" error={errors.name}>
          <Input
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ex.: Fazenda Boa Vista"
          />
        </FormField>

        <HStack $gap="md">
          <div style={{ flex: 2 }}>
            <FormField label="Cidade" error={errors.city}>
              <Input
                value={values.city}
                onChange={(e) => update('city', e.target.value)}
              />
            </FormField>
          </div>
          <div style={{ flex: 1 }}>
            <FormField label="Estado" error={errors.state}>
              <Select
                value={values.state}
                onChange={(e) => update('state', e.target.value)}
              >
                <option value="">Selecione</option>
                {BRAZILIAN_STATES.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </HStack>

        <HStack $gap="md">
          <div style={{ flex: 1 }}>
            <FormField label="Área total (ha)" error={errors.totalHa}>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={values.totalHa}
                onChange={(e) => update('totalHa', e.target.value)}
              />
            </FormField>
          </div>
          <div style={{ flex: 1 }}>
            <FormField label="Agricultável (ha)" error={errors.arableHa}>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={values.arableHa}
                onChange={(e) => update('arableHa', e.target.value)}
              />
            </FormField>
          </div>
          <div style={{ flex: 1 }}>
            <FormField label="Vegetação (ha)" error={errors.vegetationHa}>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={values.vegetationHa}
                onChange={(e) => update('vegetationHa', e.target.value)}
              />
            </FormField>
          </div>
        </HStack>

        {errors.areas ? (
          <div role="alert" style={{ color: '#b91c1c' }}>
            {errors.areas}
          </div>
        ) : null}
        {errors.general ? (
          <div role="alert" style={{ color: '#b91c1c' }}>
            {errors.general}
          </div>
        ) : null}

        <HStack $gap="sm" $justify="end">
          {onCancel ? (
            <Button
              type="button"
              $variant="secondary"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Salvando…' : submitLabel}
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
