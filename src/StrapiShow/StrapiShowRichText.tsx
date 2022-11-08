import React from 'react';
import { SkeletonBodyText } from '@shopify/polaris';
import PolarisMarkdown from '@shop3/polaris-markdown';
import _ from 'lodash';
import { useResource } from '../hooks';

type Props = {
  resourceUrl: string;
  authToken?: string;
  field: string;
};

const StrapiShowRichText: React.FC<Props> = ({ resourceUrl, authToken, field }) => {
  const { data: response } = useResource(resourceUrl, authToken);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  if (isLoading) {
    return <SkeletonBodyText lines={6} />;
  }

  return <PolarisMarkdown>{_.get(data, field, '')}</PolarisMarkdown>;
};

export default StrapiShowRichText;
