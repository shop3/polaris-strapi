import React, { useContext, useMemo } from 'react';
import { Button, Pagination, Select, Stack, TextStyle } from '@shopify/polaris';
import _ from 'lodash';
import context from './context';

const StrapiListPagination: React.FC = () => {
  const { pagination, setPagination, totalItems } = useContext(context);

  // page variables
  const page = useMemo(() => _.get(pagination, 'page', 1), [pagination]);
  const pageSize = useMemo(() => _.get(pagination, 'pageSize', 5), [pagination]);
  // calculate page params
  const pageCount = useMemo(() => calculatePageCount(pageSize, totalItems), [totalItems, pageSize]);
  const { pageLabelCount, pageLabelIndex } = calculatePageLabelParams(page, pageCount);

  return (
    <div className="Polaris-ResourceList__FiltersWrapper">
      <Stack alignment="center">
        <Stack.Item fill>
          <Stack alignment="center" spacing="tight">
            <div style={{ width: '6rem' }}>
              <Select
                label="Entries per page"
                labelHidden
                options={['5', '10', '20', '50']}
                value={pageSize.toString()}
                onChange={(value) =>
                  setPagination({
                    ...pagination,
                    pageSize: Number(value),
                    page: calculatePageModified(page, totalItems, pageSize, Number(value)),
                  })
                }
              />
            </div>
            <TextStyle variation="subdued">Entries per page</TextStyle>
          </Stack>
        </Stack.Item>
        <Pagination
          hasPrevious={page !== 1}
          onPrevious={() => setPagination({ ...pagination, page: page - 1 })}
          hasNext={page !== pageCount}
          onNext={() => setPagination({ ...pagination, page: page + 1 })}
          label={
            <Stack alignment="center" spacing="extraTight">
              {_.times(pageLabelCount, (i) => (
                <Button
                  key={i}
                  plain
                  removeUnderline
                  monochrome={page !== pageLabelIndex + i}
                  onClick={() =>
                    setPagination({
                      ...pagination,
                      page: pageLabelIndex + i,
                    })
                  }
                >
                  {`${i + pageLabelIndex}`}
                </Button>
              ))}
            </Stack>
          }
        />
      </Stack>
    </div>
  );
};

export default StrapiListPagination;

function calculatePageModified(page: number, totalItems: number, prevPageSize: number, nextPageSize: number) {
  if (page === 1) return 1;
  const newPageRatio = prevPageSize / nextPageSize;
  const newPage = Math.ceil(page * newPageRatio);
  if (newPage * nextPageSize > totalItems) {
    return calculatePageCount(nextPageSize, totalItems);
  }
  return newPageRatio > 1 ? newPage - 1 : newPage;
}

function calculatePageCount(pageSize: number, totalItems: number) {
  return totalItems > pageSize ? Math.ceil(totalItems / pageSize) : 1;
}

function calculatePageLabelParams(page: number, pageCount: number, maxLabels = 5) {
  // calculate page label count
  function calculatePageLabelCount(pageCount: number, maxLabels: number) {
    switch (true) {
      case pageCount < maxLabels:
        return pageCount;
      default:
        return maxLabels;
    }
  }
  const pageLabelCount = calculatePageLabelCount(pageCount, maxLabels);
  // calculate page label index
  function calculatePageLabelIndex(page: number, pageCount: number, maxLabels: number, pageLabelCount: number) {
    const pageLabelHalf = Math.floor(pageLabelCount / 2);
    switch (true) {
      case page < maxLabels || pageCount < maxLabels:
        return 1;
      case page + pageLabelHalf > pageCount:
        return pageCount - maxLabels + 1;
      default:
        return page - pageLabelHalf;
    }
  }
  const pageLabelIndex = calculatePageLabelIndex(page, pageCount, maxLabels, pageLabelCount);
  // return params
  return {
    maxLabels,
    pageLabelCount,
    pageLabelIndex,
  };
}
