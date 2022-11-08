import React, { useMemo } from 'react';
import { Page, PageProps, SkeletonPage } from '@shopify/polaris';
import _ from 'lodash';
import { useResource } from '../hooks';

type Props = Omit<PageProps, 'title' | 'subtitle' | 'titleMetadata'> & {
  resourceUrl: string;
  authToken?: string;
  titleField: string;
  subtitleField?: string;
  renderTitleMetadata?: (data: any) => React.ReactNode;
};

const StrapiShowPage: React.FC<Props> = ({ resourceUrl, authToken, children, ...props }) => {
  const { data: response } = useResource(resourceUrl, authToken);

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
