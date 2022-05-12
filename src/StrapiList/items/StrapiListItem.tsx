import React, { useContext } from 'react';
import { ResourceItem, SkeletonBodyText, SkeletonThumbnail, Thumbnail } from '@shopify/polaris';
import _ from 'lodash';
import ItemContext from './context';

type Props = {
  resourceUrl: string;
  nameField?: string;
  mediaField?: string;
  children: React.ReactNode;
};

const StrapiListItem: React.FC<Props> = ({ resourceUrl, nameField, mediaField, children }) => {
  const { id, index, item, isLoading } = useContext(ItemContext);

  const url = `${resourceUrl.replace(/\/$/g, '')}/${id}`;
  const name = nameField ? _.get(item, nameField, '') : '';
  const mediaUrl = mediaField ? _.get(item, `${mediaField}.data.attributes.url`, '') : '';
  const mediaAlt = mediaField ? _.get(item, `${mediaField}.data.attributes.alternativeText`, '') : '';

  if (isLoading) {
    return (
      <ResourceItem
        id={String(id)}
        onClick={() => undefined}
        media={mediaField ? <SkeletonThumbnail size="medium" /> : undefined}
        verticalAlignment="center"
      >
        <SkeletonBodyText />
      </ResourceItem>
    );
  }

  return (
    <ResourceItem
      id={String(id)}
      url={url}
      name={name}
      accessibilityLabel={`View details for ${name}`}
      media={mediaField ? <Thumbnail size="medium" source={mediaUrl} alt={mediaAlt} /> : undefined}
      verticalAlignment="leading"
    >
      {children}
    </ResourceItem>
  );
};

export default StrapiListItem;
