import { useId, type ReactElement, cloneElement } from 'react';

import { ErrorText, HelpText, Label } from '../atoms/Label';

interface FormFieldProps {
  label: string;
  error?: string | null;
  hint?: string;
  children: ReactElement<{ id?: string; 'aria-invalid'?: boolean }>;
}

export function FormField({ label, error, hint, children }: FormFieldProps) {
  const id = useId();
  const control = cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
  });
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {control}
      {error ? <ErrorText>{error}</ErrorText> : null}
      {!error && hint ? <HelpText>{hint}</HelpText> : null}
    </div>
  );
}
