import React from 'react';
import { SkeletonBodyText } from '@shopify/polaris';
import _ from 'lodash';
import { useResource } from '../hooks';

type Props = {
  resourceUrl: string;
  authToken?: string;
  field: string;
};

const StrapiShowText: React.FC<Props> = ({ resourceUrl, authToken, field }) => {
  const { data: response } = useResource(resourceUrl, authToken);

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
