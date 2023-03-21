import React, { useContext } from 'react';
import { Heading, TextField } from '@shopify/polaris';
import _ from 'lodash';
import context from '../context';

type Props = {
  label: string;
  field: string;
  description?: string;
  placeholder?: string;
  autoComplete?: string;
  min?: number;
  max?: number;
};

const StrapiNumberInput: React.FC<Props> = (attribute) => {
  const { form, setForm, formErrors } = useContext(context);

  return (
    <TextField
      label={<Heading>{attribute.label}</Heading>}
      type="number"
      inputMode="numeric"
      autoComplete={attribute.autoComplete || 'off'}
      helpText={attribute.description}
      placeholder={attribute.placeholder}
      value={String(_.get(form, attribute.field, ''))}
      onChange={(value) => setForm({ ...form, [attribute.field]: value })}
      min={attribute.min}
      max={attribute.max}
      error={_.get(formErrors, attribute.field, '')}
    />
  );
};

export default StrapiNumberInput;
