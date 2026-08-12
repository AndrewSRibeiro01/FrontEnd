import { useState, type FormEvent } from 'react';

import type { NewCrop } from '../../../domain/entities/crop';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { HStack } from '../atoms/Stack';
import { FormField } from '../molecules/FormField';

interface CropFormProps {
  harvestId: string;
  onSubmit: (values: NewCrop) => Promise<void> | void;
}

export function CropForm({ harvestId, onSubmit }: CropFormProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Informe o nome da cultura.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({ harvestId, name: name.trim() });
      setName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cultura.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <HStack $gap="sm" $align="end">
        <div style={{ flex: 1 }}>
          <FormField label="Nova cultura" error={error}>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex.: Soja"
            />
          </FormField>
        </div>
        <Button type="submit" $size="sm" disabled={submitting}>
          Adicionar
        </Button>
      </HStack>
    </form>
  );
}
