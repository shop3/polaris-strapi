import React from 'react';
import { rest } from 'msw';
import { Card, Layout, TextContainer } from '@shopify/polaris';
import {
  StrapiShowPage,
  StrapiShowImage,
  StrapiShowTitle,
  StrapiShowText,
  StrapiShowStats,
  StrapiShowJson,
} from '../src';

export default {
  title: 'Show/Strapi Show',
  component: null,
};

const Template = ({ id }: any) => (
  <StrapiShowPage
    resourceUrl={`${process.env.PUBLIC_URL}/api/test/${id}`}
    titleField="title"
    subtitleField="description"
    compactTitle
  >
    <Layout>
      <Layout.Section oneThird>
        <StrapiShowImage resourceUrl={`${process.env.PUBLIC_URL}/api/test/${id}`} field="image" size="large" />
      </Layout.Section>
      <Layout.Section>
        <Card sectioned>
          <StrapiShowStats
            resourceUrl={`${process.env.PUBLIC_URL}/api/test/${id}`}
            stats={[
              { icon: 'ActivitiesMajor', label: 'Games', field: 'games' },
              { icon: 'FavoriteMajor', label: 'Victories', field: 'victories' },
              { icon: 'FinancesMajor', label: 'Earnings', field: 'earnings' },
            ]}
          />
        </Card>
        <Card sectioned>
          <TextContainer>
            <StrapiShowTitle resourceUrl={`${process.env.PUBLIC_URL}/api/test/${id}`} field="title" />
            <StrapiShowText resourceUrl={`${process.env.PUBLIC_URL}/api/test/${id}`} field="description" />
          </TextContainer>
        </Card>
        <Card sectioned>
          <StrapiShowJson resourceUrl={`${process.env.PUBLIC_URL}/api/test/${id}`} field="player" />
        </Card>
      </Layout.Section>
    </Layout>
  </StrapiShowPage>
);

export const Example: any = Template.bind({});

Example.args = {
  id: 1,
};

Example.parameters = {
  msw: {
    handlers: [
      rest.get(process.env.PUBLIC_URL + '/api/test/:id', (req, res, ctx) => {
        const { id } = req.params;
        return res(
          ctx.delay(800),
          ctx.json({
            data: {
              id,
              attributes: {
                title: 'Test Title',
                description:
                  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                image: {
                  data: {
                    attributes: {
                      url: process.env.PUBLIC_URL + '/assets/placeholder-vertical.png',
                    },
                  },
                },
                games: 1210,
                victories: 886,
                earnings: '$11.400',
                player: {
                  strenght: 100,
                  defence: 80,
                  velocity: 90,
                },
              },
            },
          })
        );
      }),
    ],
  },
};

export const Loading: any = Template.bind({});

Loading.args = {
  id: 2,
};

Loading.parameters = {
  msw: {
    handlers: [
      rest.get(process.env.PUBLIC_URL + '/api/test/:id', (req, res, ctx) => {
        return res(ctx.delay('infinite'));
      }),
    ],
  },
};
