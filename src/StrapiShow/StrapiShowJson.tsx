import React from 'react';
import { DisplayJson } from '@shop3/polaris-common';
import _ from 'lodash';
import { SkeletonBodyText } from '@shopify/polaris';
import { useResource } from '../hooks';

type Props = {
  resourceUrl: string;
  authToken?: string;
  field: string;
};

const StrapiShowJson: React.FC<Props> = ({ resourceUrl, authToken, field }) => {
  const { data: response } = useResource(resourceUrl, authToken);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, `data.attributes.${field}`, {});

  if (isLoading) {
    return <SkeletonBodyText />;
  }

  return <DisplayJson data={data} />;
};

export default StrapiShowJson;
