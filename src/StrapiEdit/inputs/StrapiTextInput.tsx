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
  lines?: number;
  count?: boolean;
  minLength?: number;
  maxLength?: number;
};

const StrapiTextInput: React.FC<Props> = (attribute) => {
  const { form, setForm } = useContext(context);

  return (
    <TextField
      label={<Heading>{attribute.label}</Heading>}
      type="text"
      inputMode="text"
      autoComplete={attribute.autoComplete || 'off'}
      helpText={attribute.description}
      placeholder={attribute.placeholder}
      value={String(_.get(form, attribute.field, ''))}
      onChange={(value) => setForm({ ...form, [attribute.field]: value })}
      multiline={attribute.lines}
      minLength={attribute.minLength}
      maxLength={attribute.maxLength}
      showCharacterCount={attribute.count}
    />
  );
};

export default StrapiTextInput;
