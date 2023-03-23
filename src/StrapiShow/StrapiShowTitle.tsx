import React from 'react';
import { Text, DisplayTextProps, SkeletonDisplayText } from '@shopify/polaris';
import _ from 'lodash';
import { useResource } from '../hooks';

type Props = Omit<DisplayTextProps, 'children'> & {
  resourceUrl: string;
  authToken?: string;
  field: string;
};

const StrapiShowTitle: React.FC<Props> = ({ resourceUrl, authToken, field, element, size }) => {
  const { data: response } = useResource(resourceUrl, authToken);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  if (isLoading) {
    return (
      <div style={{ width: '12rem' }}>
        <SkeletonDisplayText size={size} />
      </div>
    );
  }

  return (
    <Text variant="heading2xl" as="h3">
      {_.get(data, field, '')}
    </Text>
  );
};

export default StrapiShowTitle;
