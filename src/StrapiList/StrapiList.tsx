import React, { useEffect, useMemo, useState } from 'react';
import { LegacyCard, ResourceList } from '@shopify/polaris';
import qs from 'qs';
import _ from 'lodash';
import { useResource } from '../hooks';
import { ListFilter, FilterContext } from './filter';
import { ListPagination, PaginationContext, StrapiListPagination } from './pagination';
import { ItemContext } from './items';

type Props = {
  resourceUrl: string;
  authToken?: string;
  children?: React.ReactElement;
  filter?: React.ReactNode;
  sorting?: {
    default: {
      field: string;
      order: 'asc' | 'desc';
    };
    options: Array<{
      label: string;
      field: string;
      order: 'asc' | 'desc';
    }>;
  };
  initialPagination?: {
    page?: number;
    pageSize?: number;
  };
};

type ItemsState = {
  items: any[];
  totalItems: number;
};

const StrapiList: React.FC<Props> = ({
  resourceUrl,
  authToken,
  children,
  sorting,
  initialPagination,
  filter: filterMarkup,
}) => {
  // searching
  const [query, setQuery] = useState<string>('');
  // filtering
  const [filters, setFilters] = useState<ListFilter>();

  // pagination
  const [pagination, setPagination] = useState<ListPagination>({
    page: _.get(initialPagination, 'page', 1),
    pageSize: _.get(initialPagination, 'pageSize', 5),
    withCount: true,
  });

  // sorting
  const initialSort = `${_.get(sorting, 'default.field', 'id')}:${_.get(sorting, 'default.order', 'asc')}`;
  const [sort, setSort] = useState<string>(initialSort);
  const sortOptions = useMemo(() => {
    return _.get(sorting, 'options', []).map((x) => ({ label: x.label, value: `${x.field}:${x.order}` }));
  }, [sorting]);

  // bulk actions
  const [selectedItems, setSelectedItems] = useState<'All' | string[]>([]);

  // items
  const [{ items, totalItems }, setItemsState] = useState<ItemsState>({ items: [], totalItems: 0 });
  // strapi rest query
  const {
    data: response,
    error,
    isValidating,
  } = useResource(
    `${resourceUrl}?${qs.stringify(
      _.merge(query ? { _q: query } : {}, {
        filters,
        pagination,
        sort,
      })
    )}`,
    authToken
  );
  // get is loading
  const isLoading = typeof response === 'undefined' || isValidating;
  // update items state only when is not loading
  useEffect(() => {
    if (!isLoading) {
      setItemsState({
        items: _.get(response, 'data', []),
        totalItems: _.get(response, 'meta.pagination.total', 0),
      });
    }
  }, [response, isLoading]);

  return (
    <LegacyCard>
      <ResourceList
        loading={isLoading}
        items={isLoading ? _.times(3, () => ({})) : items}
        totalItemsCount={isLoading ? 3 : totalItems}
        // render item
        idForItem={(item, index) => String(_.get(item, 'id', index))}
        renderItem={(item, id, index) => (
          <ItemContext.Provider value={{ id, index, item: _.get(item, 'attributes', {}), isLoading }}>
            {children ? React.cloneElement(children) : null}
          </ItemContext.Provider>
        )}
        // filtering
        isFiltered={!_.isEmpty(filters)}
        filterControl={
          <FilterContext.Provider value={{ query, filters, setQuery, setFilters }}>
            {filterMarkup}
          </FilterContext.Provider>
        }
        // sorting
        sortValue={sort}
        sortOptions={sortOptions}
        onSortChange={setSort}
        // bulk actions
        // selectedItems={settings.bulkable ? selectedItems : []}
        // onSelectionChange={settings.bulkable ? setSelectedItems : () => undefined}
        // hasMoreItems={itemsState.totalItems >= pagination.pageSize}
        // promotedBulkActions={settings.bulkable ? promotedBulkActions : []}
      />
      <PaginationContext.Provider value={{ totalItems, pagination, setPagination }}>
        <StrapiListPagination />
      </PaginationContext.Provider>
    </LegacyCard>
  );
};

export default StrapiList;
