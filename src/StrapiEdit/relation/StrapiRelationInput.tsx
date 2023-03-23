import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Combobox, Text, Listbox, LegacyStack, Tag } from '@shopify/polaris';
import qs from 'qs';
import _ from 'lodash';
import context from '../context';
import { useResource } from '../../hooks';

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  field: string;
  resourceUrl: string;
  authToken?: string;
  displayField: string;
  multiple?: boolean;
  description?: string;
  placeholder?: string;
};

const StrapiInputRelation: React.FC<Props> = (relation) => {
  const { form, setForm } = useContext(context);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

  // query to find relations
  const {
    data: response,
    error,
    isValidating,
  } = useResource(
    `${relation.resourceUrl}?${qs.stringify({
      _q: searchQuery,
      populate: relation.field,
    })}`,
    relation.authToken
  );

  const isLoading = typeof response === 'undefined' || isValidating;
  const options: Option[] = useMemo(() => {
    return _.map(_.get(response, 'data', []), (x: any) => ({
      value: String(x.id),
      label: _.get(x, `attributes.${relation.displayField}`),
    }));
  }, [response]);

  const handleOnSelect = useCallback(
    (value: string) => {
      // use number for relations
      const newValue = Number(value);
      const newOption = _.find(options, (x) => Number(x.value) === newValue) || {
        label: String(newValue),
        value: String(newValue),
      };
      // update selected
      if (relation.multiple) {
        const selectedValues = _.castArray(_.get(form, relation.field, []));
        setForm({ ...form, [relation.field]: _.union(selectedValues, [newValue]) });
        setSelectedOptions(_.union(selectedOptions, [newOption]));
      } else {
        setForm({ ...form, [relation.field]: newValue });
        setSelectedOptions([newOption]);
      }
    },
    [form, options, selectedOptions]
  );

  const handleOnRemove = useCallback(
    (value: string) => {
      // update selected
      if (relation.multiple) {
        const selectedValues = _.castArray(_.get(form, relation.field, []));
        setForm({ ...form, [relation.field]: _.filter(selectedValues, (x) => x !== Number(value)) });
        setSelectedOptions(_.filter(selectedOptions, (x) => x.value !== String(value)));
      } else {
        setForm({ ...form, [relation.field]: undefined });
        setSelectedOptions([]);
      }
    },
    [form, selectedOptions]
  );

  const updateSelection = useCallback(
    (value: string) => {
      if (selectedOptions.find((x) => x.value === value)) {
        handleOnRemove(value);
      } else {
        handleOnSelect(value);
      }
    },
    [selectedOptions, handleOnSelect, handleOnRemove]
  );

  const searchMarkup = (
    <Combobox.TextField
      label={
        <Text variant="headingMd" as="h6">
          {relation.label}
        </Text>
      }
      autoComplete="off"
      placeholder="Search"
      value={searchQuery}
      onChange={setSearchQuery}
    />
  );

  const optionsMarkup = _.map(options, (option) => {
    const { label, value } = option;
    return (
      <Listbox.Option
        key={`option${value}`}
        value={value}
        selected={_.includes(selectedOptions, option)}
        accessibilityLabel={label}
      >
        {label}
      </Listbox.Option>
    );
  });

  const loadingMarkup = <Listbox.Loading accessibilityLabel="loading" />;

  const tagsMarkup = selectedOptions.map((option) => {
    return (
      <Tag key={`tag${option.value}`} onRemove={() => handleOnRemove(option.value)}>
        {option.label}
      </Tag>
    );
  });

  return (
    <div>
      <Combobox allowMultiple={relation.multiple} activator={searchMarkup}>
        <Listbox onSelect={updateSelection}>{isLoading ? loadingMarkup : optionsMarkup}</Listbox>
      </Combobox>
      {tagsMarkup.length > 0 && (
        <div style={{ marginTop: '0.8rem' }}>
          <LegacyStack spacing="tight">{tagsMarkup}</LegacyStack>
        </div>
      )}
      {relation.description && (
        <div style={{ marginTop: '0.4rem' }}>
          <Text variant="headingMd" as="h6">
            {relation.description}
          </Text>
        </div>
      )}
    </div>
  );
};

export default StrapiInputRelation;
