import React, { useContext } from 'react';
import { Heading, Select } from '@shopify/polaris';
import _ from 'lodash';
import context from '../context';

type Props = {
  label: string;
  field: string;
  description?: string;
  placeholder?: string;
  options: Array<{
    label: string;
    value: string;
  }>;
};

const StrapiEnumInput: React.FC<Props> = (attribute) => {
  const { form, setForm, formErrors } = useContext(context);

  return (
    <Select
      label={<Heading>{attribute.label}</Heading>}
      helpText={attribute.description}
      placeholder={attribute.placeholder || 'Select'}
      options={attribute.options}
      value={String(_.get(form, attribute.field, ''))}
      onChange={(value) => setForm({ ...form, [attribute.field]: value })}
      error={_.get(formErrors, attribute.field, '')}
    />
  );
};

export default StrapiEnumInput;
