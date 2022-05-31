import React from 'react';
import { rest } from 'msw';
import qs from 'qs';
import { Card, FormLayout, Layout, Page } from '@shopify/polaris';
import _ from 'lodash';

import {
  StrapiEdit,
  StrapiSubmit,
  StrapiEnumInput,
  StrapiNumberInput,
  StrapiTextInput,
  StrapiMediaInput,
  StrapiRelationInput,
} from '../src';

export default {
  title: 'Edit/Strapi Edit',
  component: null,
};

const Template = ({ initialValue }: any) => (
  <Page
    title="Form"
    primaryAction={
      <StrapiSubmit primary formId="strapi-edit-form">
        Submit
      </StrapiSubmit>
    }
  >
    <StrapiEdit formId="strapi-edit-form" resourceUrl="/api/test" method="POST" initialValue={initialValue}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <StrapiTextInput label="Title" field="title" minLength={3} maxLength={70} count />
              <StrapiTextInput label="Description" field="description" maxLength={150} lines={2} count />
              <FormLayout.Group>
                <StrapiNumberInput label="Quantity" field="quantity" />
                <StrapiEnumInput
                  label="Color"
                  field="color"
                  options={[
                    { label: 'Red', value: 'RED' },
                    { label: 'Green', value: 'GREEN' },
                    { label: 'Blue', value: 'BLUE' },
                  ]}
                />
              </FormLayout.Group>
              <StrapiMediaInput label="Images" field="images" mediaType="image" multiple={true} />
            </FormLayout>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <FormLayout>
              <StrapiRelationInput
                label="Category"
                field="category"
                resourceUrl="/api/categories"
                displayField="name"
              />
              <StrapiRelationInput label="Tags" field="tags" resourceUrl="/api/tags" displayField="value" multiple />
            </FormLayout>
          </Card>
        </Layout.Section>
      </Layout>
    </StrapiEdit>
  </Page>
);

export const Example: any = Template.bind({});

Example.parameters = {
  msw: {
    handlers: [
      rest.post('/api/upload', async (req, res, ctx) => {
        const response = [];
        const files: File[] | File = _.get(req, 'body.files');
        if (Array.isArray(files)) {
          for (const f of files) {
            response.push({
              id: randomId(),
              name: f.name,
              mime: f.type,
              size: f.size / 1000,
              url: '/assets/placeholder.png',
            });
          }
        } else {
          const f = files;
          response.push({
            id: randomId(),
            name: f.name,
            mime: f.type,
            size: f.size / 1000,
            url: '/assets/placeholder.png',
          });
        }
        return res(ctx.delay(3000), ctx.json(response));
      }),

      rest.post('/api/test', (req, res, ctx) => {
        return res(ctx.delay(800), ctx.json({}));
      }),

      rest.get('/api/categories', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.json({
            data: [
              { id: 1, attributes: { name: 'Clothes' } },
              { id: 2, attributes: { name: 'Pants' } },
              { id: 3, attributes: { name: 'Shirts' } },
            ],
          })
        );
      }),

      rest.get('/api/tags', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.json({
            data: [
              { id: 1, attributes: { value: 'Rock' } },
              { id: 2, attributes: { value: 'Punk' } },
              { id: 3, attributes: { value: 'Pop' } },
            ],
          })
        );
      }),
    ],
  },
};

export const InitialValue: any = Template.bind({});

InitialValue.args = {
  initialValue: {
    title: 'Test Title',
    description: 'Test description',
    quantity: 10,
    color: 'GREEN',
    images: [1, 2],
  },
};

InitialValue.parameters = {
  msw: {
    handlers: [
      rest.post('/api/upload', (req, res, ctx) => {
        const response = [];
        const files: File[] | File = _.get(req, 'body.files');
        if (Array.isArray(files)) {
          for (const f of files) {
            response.push({
              id: randomId(),
              name: f.name,
              mime: f.type,
              size: f.size / 1000,
              url: '/assets/placeholder.png',
            });
          }
        } else {
          const f = files;
          response.push({
            id: randomId(),
            name: f.name,
            mime: f.type,
            size: f.size / 1000,
            url: '/assets/placeholder.png',
          });
        }
        return res(ctx.delay(3000), ctx.json(response));
      }),

      rest.post('/api/test', (req, res, ctx) => {
        return res(ctx.delay(800), ctx.json({}));
      }),

      rest.get('/api/upload/files', (req, res, ctx) => {
        const params = qs.parse(req.url.searchParams.toString());
        const { filters }: any = params;
        if (!filters || !filters.id || !filters.id.$in) return res(ctx.json([]));
        return res(
          ctx.delay(800),
          ctx.json({
            results: filters.id.$in.map((id: number | string) => ({
              id,
              url: '/assets/placeholder.png',
              name: 'placeholder.png',
              mime: 'image/png',
              size: 67.5,
            })),
          })
        );
      }),

      rest.get('/api/categories', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.json({
            data: [
              { id: 1, attributes: { name: 'Clothes' } },
              { id: 2, attributes: { name: 'Pants' } },
              { id: 3, attributes: { name: 'Shirts' } },
            ],
          })
        );
      }),

      rest.get('/api/tags', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.json({
            data: [
              { id: 1, attributes: { value: 'Rock' } },
              { id: 2, attributes: { value: 'Punk' } },
              { id: 3, attributes: { value: 'Pop' } },
            ],
          })
        );
      }),
    ],
  },
};

function randomId() {
  return Math.floor(Math.random() * 1000000) + 1;
}
