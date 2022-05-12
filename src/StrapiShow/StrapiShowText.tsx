import React from 'react';
import { SkeletonBodyText } from '@shopify/polaris';
import useSWR from 'swr';
import _ from 'lodash';

type Props = {
  resourceUrl: string;
  field: string;
};

const StrapiShowText: React.FC<Props> = ({ resourceUrl, field }) => {
  const { data: response } = useSWR(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  if (isLoading) {
    return (
      <div style={{ minWidth: '12rem' }}>
        <SkeletonBodyText lines={3} />
      </div>
    );
  }

  return <p>{_.get(data, field, '')}</p>;
};

export default StrapiShowText;
