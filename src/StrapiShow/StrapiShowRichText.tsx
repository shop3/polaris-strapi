import React from 'react';
import { SkeletonBodyText } from '@shopify/polaris';
import PolarisMarkdown from '@strapify/polaris-markdown';
import _ from 'lodash';
import { useResource } from '../hooks';

type Props = {
  resourceUrl: string;
  field: string;
};

const StrapiShowRichText: React.FC<Props> = ({ resourceUrl, field }) => {
  const { data: response } = useResource(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  if (isLoading) {
    return <SkeletonBodyText lines={6} />;
  }

  return <PolarisMarkdown>{_.get(data, field, '')}</PolarisMarkdown>;
};

export default StrapiShowRichText;
