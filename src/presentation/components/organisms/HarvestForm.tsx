import { useState, type FormEvent } from 'react';

import type { NewHarvest } from '../../../domain/entities/harvest';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { HStack } from '../atoms/Stack';
import { FormField } from '../molecules/FormField';

interface HarvestFormProps {
  farmId: string;
  onSubmit: (values: NewHarvest) => Promise<void> | void;
}

export function HarvestForm({ farmId, onSubmit }: HarvestFormProps) {
  const [year, setYear] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = Number(year);
    if (!Number.isInteger(parsed) || parsed < 2000 || parsed > 2100) {
      setError('Informe um ano entre 2000 e 2100.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ farmId, year: parsed });
      setYear('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar safra.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <HStack $gap="sm" $align="end">
        <div style={{ flex: 1 }}>
          <FormField label="Nova safra (ano)" error={error}>
            <Input
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Ex.: 2024"
            />
          </FormField>
        </div>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Adicionando…' : 'Adicionar safra'}
        </Button>
      </HStack>
    </form>
  );
}
