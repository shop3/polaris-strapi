import React from 'react';
import useSWR from 'swr';
import _ from 'lodash';

type Props = {
  resourceUrl: string;
  field: string;
  size?: 'small' | 'medium' | 'large';
};

const StrapiShowImage: React.FC<Props> = ({ resourceUrl, field, size }) => {
  const { data: response } = useSWR(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  if (isLoading) {
    return (
      <div
        className="Polaris-Card"
        style={{
          overflow: 'hidden',
        }}
      >
        <div
          className="Polaris-Card Polaris-Thumbnail"
          style={{
            backgroundColor: 'var(--p-surface-neutral)',
            border: 'none',
            borderRadius: 'unset',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="Polaris-Card"
      style={{
        overflow: 'hidden',
      }}
    >
      <span
        className="Polaris-Thumbnail"
        style={{
          border: 'none',
          borderRadius: 'unset',
        }}
      >
        <img src={getUrl(_.get(data, field), size)} alt={_.get(data, `${field}.data.attributes.name`)} />
      </span>
    </div>
  );
};

function getUrl(data: any, size?: 'small' | 'medium' | 'large') {
  const fallbackUrl = _.get(data, 'data.attributes.url');
  switch (size) {
    case 'medium':
      return _.get(data, 'data.attributes.formats.medium.url', fallbackUrl);
    case 'large':
      return _.get(data, 'data.attributes.formats.large.url', fallbackUrl);
    default:
      return _.get(data, 'data.attributes.formats.small.url', fallbackUrl);
  }
}

export default StrapiShowImage;
