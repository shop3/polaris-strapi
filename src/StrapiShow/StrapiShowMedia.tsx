import React from 'react';
import { Stack } from '@shopify/polaris';
import { Media, SkeletonMedia } from '@shop3/polaris-common';
import _ from 'lodash';
import { useResource } from '../hooks';

type Props = {
  resourceUrl: string;
  field: string;
  multiple: boolean;
};

const StrapiShowMedia: React.FC<Props> = ({ resourceUrl, field, multiple }) => {
  const { data: response } = useResource(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data: any = _.get(response, `data.attributes.${field}.data.attributes`, {});

  if (isLoading) {
    return <Stack vertical>{multiple ? _.times(3).map((i) => <SkeletonMedia key={i} />) : <SkeletonMedia />}</Stack>;
  }

  return (
    <Stack vertical>
      {multiple ? (
        data.map(({ url, name, size, mime }: any, i: number) => (
          <Media key={i} url={url} name={name} size={size} mime={mime} />
        ))
      ) : (
        <Media url={data.url} name={data.name} size={data.size} mime={data.mime} />
      )}
    </Stack>
  );
};

export default StrapiShowMedia;
