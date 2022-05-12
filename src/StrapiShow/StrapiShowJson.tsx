import React from 'react';
import { DisplayJson } from '@strapify/polaris-common';
import useSWR from 'swr';
import _ from 'lodash';
import { SkeletonBodyText } from '@shopify/polaris';

type Props = {
  resourceUrl: string;
  field: string;
};

const StrapiShowJson: React.FC<Props> = ({ resourceUrl, field }) => {
  const { data: response } = useSWR(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, `data.attributes.${field}`, {});

  if (isLoading) {
    return <SkeletonBodyText />;
  }

  return <DisplayJson data={data} />;
};

export default StrapiShowJson;
