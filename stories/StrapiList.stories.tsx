import React from 'react';
import { rest } from 'msw';
import { Page, TextContainer } from '@shopify/polaris';
import _ from 'lodash';

import { StrapiList, StrapiListFilter, StrapiListItem, StrapiListText } from '../src';

export default {
  title: 'List/Strapi List',
  component: null,
};

const Template = ({ resource }: any) => (
  <Page title="List">
    <StrapiList
      resourceUrl={`${process.env.PUBLIC_URL}/api/${resource}`}
      sorting={{
        default: { field: 'id', order: 'asc' },
        options: [
          { label: 'Name ASC', field: 'name', order: 'asc' },
          { label: 'Name DESC', field: 'name', order: 'desc' },
        ],
      }}
      initialPagination={{
        pageSize: 5,
      }}
      filter={
        <StrapiListFilter
          search
          options={[
            {
              label: 'Name',
              field: 'name',
              type: 'string',
            },
            {
              label: 'Description',
              field: 'description',
              type: 'string',
            },
          ]}
        />
      }
    >
      <StrapiListItem resourceUrl={`${process.env.PUBLIC_URL}/api/${resource}`} nameField="name" mediaField="image">
        <TextContainer>
          <h2>
            <StrapiListText textField="name" variation="strong" />
            <br />
          </h2>
          <StrapiListText textField="description" variation="subdued" />
        </TextContainer>
      </StrapiListItem>
    </StrapiList>
  </Page>
);

export const Example: any = Template.bind({});

Example.args = {
  resource: 'tests',
};

Example.parameters = {
  msw: {
    handlers: [
      rest.get(process.env.PUBLIC_URL + '/api/tests', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.json({
            data: [
              {
                id: 1,
                attributes: {
                  name: 'Name 1',
                  description: 'this is a test description 1',
                  image: {
                    data: {
                      attributes: {
                        url: process.env.PUBLIC_URL + '/assets/placeholder.png',
                      },
                    },
                  },
                },
              },
              {
                id: 2,
                attributes: {
                  name: 'Name 2',
                  description: 'this is a test description 2',
                  image: {
                    data: {
                      attributes: {
                        url: process.env.PUBLIC_URL + '/assets/placeholder.png',
                      },
                    },
                  },
                },
              },
              {
                id: 3,
                attributes: {
                  name: 'Name 3',
                  description: 'this is a test description 3',
                  image: {
                    data: {
                      attributes: {
                        url: process.env.PUBLIC_URL + '/assets/placeholder.png',
                      },
                    },
                  },
                },
              },
            ],
          })
        );
      }),
    ],
  },
};

export const Loading: any = Template.bind({});

Loading.args = {
  resource: 'loadings',
};

Loading.parameters = {
  msw: {
    handlers: [
      rest.get(process.env.PUBLIC_URL + '/api/loadings', (req, res, ctx) => {
        return res(ctx.delay('infinite'));
      }),
    ],
  },
};
