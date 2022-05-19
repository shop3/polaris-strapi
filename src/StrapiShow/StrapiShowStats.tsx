import React from 'react';
import { DisplayStats } from '@strapify/polaris-common';
import _ from 'lodash';
import { SkeletonBodyText } from '@shopify/polaris';
import { useResource } from '../hooks';

type Props = {
  resourceUrl: string;
  stats: Array<{
    icon?: string;
    label: string;
    field: string;
  }>;
};

const StrapiShowStats: React.FC<Props> = ({ resourceUrl, stats }) => {
  const { data: response } = useResource(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  if (isLoading) {
    return <SkeletonBodyText />;
  }

  return (
    <DisplayStats
      stats={stats.map((s) => ({
        icon: s.icon,
        label: s.label,
        value: _.get(data, s.field, ''),
      }))}
    />
  );
};

export default StrapiShowStats;
