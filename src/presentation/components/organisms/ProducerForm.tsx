import { useState, type FormEvent } from 'react';
import styled from 'styled-components';

import type {
  NewProducer,
  Producer,
} from '../../../domain/entities/producer';
import {
  formatDocument,
  isValidDocument,
  stripDocument,
} from '../../../domain/validation/document';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { HStack, VStack } from '../atoms/Stack';
import { FormField } from '../molecules/FormField';

const Form = styled.form`
  display: contents;
`;

interface ProducerFormProps {
  initial?: Producer;
  submitLabel?: string;
  onCancel?: () => void;
  onSubmit: (values: NewProducer) => Promise<void> | void;
}

interface FormState {
  document: string;
  name: string;
}

interface Errors {
  document?: string;
  name?: string;
  general?: string;
}

function validate(values: FormState): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = 'Informe o nome do produtor.';
  if (!values.document.trim()) errors.document = 'Informe o CPF ou CNPJ.';
  else if (!isValidDocument(values.document)) {
    errors.document = 'CPF ou CNPJ inválido.';
  }
  return errors;
}

export function ProducerForm({
  initial,
  submitLabel = 'Salvar',
  onCancel,
  onSubmit,
}: ProducerFormProps) {
  const [values, setValues] = useState<FormState>({
    document: initial ? formatDocument(initial.document) : '',
    name: initial?.name ?? '',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit({
        document: stripDocument(values.document),
        name: values.name.trim(),
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
    <Form onSubmit={handleSubmit} noValidate>
      <VStack $gap="md">
        <FormField label="Nome do produtor" error={errors.name}>
          <Input
            value={values.name}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
            placeholder="Ex.: João da Silva"
          />
        </FormField>

        <FormField
          label="CPF ou CNPJ"
          error={errors.document}
          hint="Aceita com ou sem máscara."
        >
          <Input
            value={values.document}
            onChange={(e) =>
              setValues({ ...values, document: e.target.value })
            }
            placeholder="000.000.000-00"
            inputMode="numeric"
          />
        </FormField>

        {errors.general ? (
          <div role="alert" style={{ color: 'var(--danger)' }}>
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
    </Form>
  );
}
