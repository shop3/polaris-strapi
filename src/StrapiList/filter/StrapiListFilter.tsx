import React, { useContext, useEffect, useState } from 'react';
import { Button, Filters, Select, LegacyStack, TextField } from '@shopify/polaris';
import _ from 'lodash';
import context from './context';
import { FilterOption, ListFilter } from './types';

type Props = {
  search?: boolean;
  defaults?: FilterOption[];
  options?: FilterOption[];
};

type Filter = {
  field: string;
  operator: string;
  value?: string;
};

const StrapiListFilter: React.FC<Props> = ({ search = false, options = [] }) => {
  const { query, setQuery, setFilters } = useContext(context);
  const [searchQuery, setSearchQuery] = useState<string>(query);
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([]);
  const [newFilter, setNewFilter] = useState<Partial<Filter>>({});

  const showFilters = options && !_.isEmpty(options);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if ((searchQuery.length === 0 || searchQuery.length >= 3) && searchQuery !== query) {
        setQuery(searchQuery);
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchQuery]);

  useEffect(() => {
    setFilters(calculateListFilter(currentFilters));
  }, [currentFilters]);

  const appliedFilters = _.map(currentFilters, (x) => ({
    ...toAppliedFilter(options, x),
    onRemove: (key: string) => {
      setCurrentFilters(_.filter(_.cloneDeep(currentFilters), (f) => key !== toAppliedFilter(options, f).key));
    },
  }));

  const filtersMarkup = [
    {
      key: 'filter',
      label: 'Filters',
      filter: (
        <div style={{ minWidth: '12rem' }}>
          <LegacyStack vertical spacing="tight">
            <Select
              label="Field"
              labelHidden
              placeholder=" "
              options={mapFilterOptions(options)}
              value={_.get(newFilter, 'field')}
              onChange={(field) => setNewFilter({ field })}
            />
            <Select
              label="Operator"
              labelHidden
              placeholder=" "
              options={getFilterOperators(getFilterOptionParam(options, newFilter, 'type'))}
              value={_.get(newFilter, 'operator')}
              onChange={(operator) => setNewFilter(_.set(_.cloneDeep(newFilter), 'operator', operator))}
              disabled={_.isUndefined(_.get(newFilter, 'field'))}
            />
            {isFilterBoolean(newFilter) ? null : getFilterOptionParam(options, newFilter, 'type') !== 'enum' ? (
              <TextField
                label="Value"
                labelHidden
                autoComplete="off"
                value={_.get(newFilter, 'value')}
                onChange={(value) => setNewFilter(_.set(_.cloneDeep(newFilter), 'value', value))}
                disabled={_.isUndefined(_.get(newFilter, 'field')) || _.isUndefined(_.get(newFilter, 'operator'))}
              />
            ) : (
              <Select
                label="Value"
                labelHidden
                placeholder=" "
                options={getFilterOptionParam(options, newFilter, 'options')}
                value={_.get(newFilter, 'value')}
                onChange={(value) => setNewFilter(_.set(_.cloneDeep(newFilter), 'value', value))}
                disabled={_.isUndefined(_.get(newFilter, 'field')) || _.isUndefined(_.get(newFilter, 'operator'))}
              />
            )}
            <Button
              fullWidth
              disabled={!isFilterComplete(newFilter)}
              onClick={() => {
                if (isFilterComplete(newFilter)) {
                  setCurrentFilters(_.union(_.cloneDeep(currentFilters), [newFilter]));
                  setNewFilter({});
                }
              }}
            >
              Add Filter
            </Button>
          </LegacyStack>
        </div>
      ),
      shortcut: true,
      hideClearButton: true,
    },
  ];

  return (
    <Filters
      //query
      hideQueryField={!search}
      queryPlaceholder="Search"
      queryValue={searchQuery || ''}
      onQueryChange={(query) => setSearchQuery(query)}
      onQueryClear={() => setSearchQuery('')}
      // filters
      hideTags={!showFilters}
      filters={(showFilters && filtersMarkup) || []}
      appliedFilters={appliedFilters}
      onClearAll={() => setCurrentFilters([])}
    />
  );
};

export default StrapiListFilter;

type FilterMap = {
  [k: string]: string;
};

const filtersMapCommon: FilterMap = {
  $eq: 'is',
  $ne: 'is not',
  $null: 'is null',
  $notNull: 'is not null',
};

const filtersMapNumber: FilterMap = {
  ...filtersMapCommon,
  $lt: 'is less than',
  $lte: 'is less than or equal to',
  $gt: 'is greater than',
  $gte: 'is greater than or equal to',
};

const filtersMapString: FilterMap = {
  ...filtersMapCommon,
  $containsi: 'contains',
  $notContainsi: 'does not contain',
  $startsWith: 'starts with',
  $endsWith: 'ends with',
};

const filtersMapUnion: FilterMap = {
  ...filtersMapNumber,
  ...filtersMapString,
};

function getFilterOperators(type?: 'number' | 'string' | 'enum') {
  function mapOperator(map: FilterMap) {
    return Object.entries(map).map(([k, v]) => ({
      label: v,
      value: k,
    }));
  }
  switch (type) {
    case 'number':
      return mapOperator(filtersMapNumber);
    case 'string':
      return mapOperator(filtersMapString);
    default:
      return mapOperator(filtersMapCommon);
  }
}

function mapFilterOptions(options: FilterOption[]) {
  return _.map(options, (x) => ({ label: x.label, value: x.field }));
}

function getFilterOptionParam(options: FilterOption[], filter: Partial<Filter> | undefined, param: string) {
  if (!filter) return;
  return _.get(
    _.find(options, (x) => x.field === filter.field),
    param
  );
}

function isFilterBoolean(filter?: Partial<Filter>): boolean {
  return _.includes(['$null', '$notNull'], _.get(filter, 'operator'));
}

function isFilterComplete(filter: Partial<Filter> | undefined): filter is Filter {
  if (!filter) return false;
  if (isFilterBoolean(filter)) return !!filter.field && !!filter.operator;
  else return !!filter.field && !!filter.operator && !!filter.value;
}

function calculateListFilter(filters?: Filter[]): ListFilter {
  function getFilterObject(filter: Filter): ListFilter {
    if (isFilterBoolean(filter)) return _.set({}, `${filter.field}.${filter.operator}`, true);
    else return _.set({}, `${filter.field}.${filter.operator}`, filter.value);
  }
  if (!filters || !Array.isArray(filters) || filters.length === 0) {
    return {};
  } else if (filters.length === 1) {
    return getFilterObject(filters[0]);
  } else {
    return {
      $and: filters.map(getFilterObject),
    } as ListFilter;
  }
}

// get applied filter key and label
function toAppliedFilter(options: FilterOption[], filter: Filter) {
  let filterKey;
  let filterLabel;
  if (isFilterBoolean(filter)) {
    filterKey = `${filter.field}-${filter.operator}`;
    filterLabel = `${getFilterOptionParam(options, filter, 'label')} ${filtersMapUnion[filter.operator]}`;
  } else {
    filterKey = `${filter.field}-${filter.operator}-${filter.value}`;
    filterLabel = `${getFilterOptionParam(options, filter, 'label')} ${
      filtersMapUnion[filter.operator]
    } ${JSON.stringify(filter.value)}`;
  }
  return {
    key: filterKey,
    label: filterLabel,
  };
}
