import React, { useContext } from 'react';
import { Text, Select } from '@shopify/polaris';
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
  const { form, setForm } = useContext(context);

  return (
    <Select
      label={
        <Text variant="headingMd" as="h6">
          {attribute.label}
        </Text>
      }
      helpText={attribute.description}
      placeholder={attribute.placeholder || 'Select'}
      options={attribute.options}
      value={String(_.get(form, attribute.field, ''))}
      onChange={(value) => setForm({ ...form, [attribute.field]: value })}
    />
  );
};

export default StrapiEnumInput;
