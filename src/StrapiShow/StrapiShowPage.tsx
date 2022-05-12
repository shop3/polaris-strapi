import React, { useMemo } from 'react';
import { Page, PageProps, SkeletonPage } from '@shopify/polaris';
import useSWR from 'swr';
import _ from 'lodash';

type Props = Omit<PageProps, 'title' | 'subtitle' | 'titleMetadata'> & {
  resourceUrl: string;
  titleField: string;
  subtitleField?: string;
  renderTitleMetadata?: (data: any) => React.ReactNode;
};

const StrapiShowPage: React.FC<Props> = ({ resourceUrl, children, ...props }) => {
  const { data: response } = useSWR(resourceUrl);

  const isLoading = typeof response === 'undefined';
  const data = _.get(response, 'data.attributes', {});

  const titleMetadata = useMemo(() => _.invoke(props, 'renderTitleMetadata', data), [props.renderTitleMetadata, data]);

  if (isLoading) {
    return (
      <SkeletonPage
        breadcrumbs={!!props.breadcrumbs}
        primaryAction={!!props.primaryAction}
        fullWidth={props.fullWidth}
        narrowWidth={props.narrowWidth}
      >
        {children}
      </SkeletonPage>
    );
  }

  return (
    <Page
      {...props}
      title={_.get(data, props.titleField, '')}
      subtitle={_.truncate(_.get(data, props.subtitleField || '', ''), {
        length: 80,
      })}
      titleMetadata={titleMetadata}
    >
      {children}
    </Page>
  );
};

export default StrapiShowPage;
