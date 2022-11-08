import React from 'react';
import { DisplayText, DisplayTextProps, SkeletonDisplayText } from '@shopify/polaris';
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
    <DisplayText size={size} element={element}>
      {_.get(data, field, '')}
    </DisplayText>
  );
};

export default StrapiShowTitle;
