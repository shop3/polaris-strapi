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
    <StrapiEdit
      formId="strapi-edit-form"
      resourceUrl={process.env.PUBLIC_URL + '/api/test'}
      method="POST"
      initialValue={initialValue}
    >
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <FormLayout>
              <StrapiTextInput
                label="Title"
                field="title"
                minLength={3}
                maxLength={70}
                count
                description="Set the title of this entity"
              />
              <StrapiTextInput
                label="Description"
                field="description"
                maxLength={150}
                lines={2}
                count
                description="Add a description for this entity"
              />
              <FormLayout.Group>
                <StrapiNumberInput label="Quantity" field="quantity" description="Set the quantity of this entity" />
                <StrapiEnumInput
                  label="Color"
                  field="color"
                  options={[
                    { label: 'Red', value: 'RED' },
                    { label: 'Green', value: 'GREEN' },
                    { label: 'Blue', value: 'BLUE' },
                  ]}
                  description="Select the color of this entity"
                />
              </FormLayout.Group>
              <StrapiMediaInput
                label="Images"
                field="images"
                mediaType="image"
                multiple={true}
                description="Upload images for this entity"
              />
            </FormLayout>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <FormLayout>
              <StrapiRelationInput
                label="Category"
                field="category"
                resourceUrl={process.env.PUBLIC_URL + '/api/categories'}
                displayField="name"
                description="Select the category of this entity"
              />
              <StrapiRelationInput
                label="Tags"
                field="tags"
                resourceUrl={process.env.PUBLIC_URL + '/api/tags'}
                displayField="value"
                multiple
                description="Select the tags of this entity"
              />
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
      rest.post(process.env.PUBLIC_URL + '/api/upload', async (req, res, ctx) => {
        const response = [];
        const files: File[] | File = _.get(req, 'body.files') as any;
        if (Array.isArray(files)) {
          for (const f of files) {
            response.push({
              id: randomId(),
              name: f.name,
              mime: f.type,
              size: f.size / 1000,
              url: process.env.PUBLIC_URL + '/assets/placeholder.png',
            });
          }
        } else {
          const f = files;
          response.push({
            id: randomId(),
            name: f.name,
            mime: f.type,
            size: f.size / 1000,
            url: process.env.PUBLIC_URL + '/assets/placeholder.png',
          });
        }
        return res(ctx.delay(3000), ctx.json(response));
      }),

      rest.post(process.env.PUBLIC_URL + '/api/test', (req, res, ctx) => {
        return res(ctx.delay(800), ctx.json({}));
      }),

      rest.get(process.env.PUBLIC_URL + '/api/categories', (req, res, ctx) => {
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

      rest.get(process.env.PUBLIC_URL + '/api/tags', (req, res, ctx) => {
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
      rest.post(process.env.PUBLIC_URL + '/api/upload', (req, res, ctx) => {
        const response = [];
        const files: File[] | File = _.get(req, 'body.files') as any;
        if (Array.isArray(files)) {
          for (const f of files) {
            response.push({
              id: randomId(),
              name: f.name,
              mime: f.type,
              size: f.size / 1000,
              url: process.env.PUBLIC_URL + '/assets/placeholder.png',
            });
          }
        } else {
          const f = files;
          response.push({
            id: randomId(),
            name: f.name,
            mime: f.type,
            size: f.size / 1000,
            url: process.env.PUBLIC_URL + '/assets/placeholder.png',
          });
        }
        return res(ctx.delay(3000), ctx.json(response));
      }),

      rest.post(process.env.PUBLIC_URL + '/api/test', (req, res, ctx) => {
        return res(ctx.delay(800), ctx.json({}));
      }),

      rest.get(process.env.PUBLIC_URL + '/api/upload/files', (req, res, ctx) => {
        const params = qs.parse(req.url.searchParams.toString());
        const { filters }: any = params;
        if (!filters || !filters.id || !filters.id.$in) return res(ctx.json([]));
        return res(
          ctx.delay(800),
          ctx.json(
            filters.id.$in.map((id: number | string) => ({
              id,
              url: process.env.PUBLIC_URL + '/assets/placeholder.png',
              name: 'placeholder.png',
              mime: 'image/png',
              size: 67.5,
            }))
          )
        );
      }),

      rest.get(process.env.PUBLIC_URL + '/api/categories', (req, res, ctx) => {
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

      rest.get(process.env.PUBLIC_URL + '/api/tags', (req, res, ctx) => {
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

export const WithError: any = Template.bind({});

WithError.args = {};

WithError.parameters = {
  msw: {
    handlers: [
      rest.post(process.env.PUBLIC_URL + '/api/upload', (req, res, ctx) => {
        return res(ctx.delay(3000), ctx.status(400));
      }),

      rest.post(process.env.PUBLIC_URL + '/api/test', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.status(400),
          ctx.json({
            data: null,
            error: {
              status: 400,
              name: 'ValidationError',
              message: 'An error occurred',
              details: {
                errors: [
                  {
                    path: ['title'],
                    message: 'This is a test error for title field',
                  },
                  {
                    path: ['description'],
                    message: 'This is a test error for description field',
                  },
                  {
                    path: ['quantity'],
                    message: 'This is a test error for quantity field',
                  },
                  {
                    path: ['color'],
                    message: 'This is a test error for color field',
                  },
                  {
                    path: ['images'],
                    message: 'This is a test error for images field',
                  },
                  {
                    path: ['category'],
                    message: 'This is a test error for category field',
                  },
                  {
                    path: ['tags'],
                    message: 'This is a test error for tags field',
                  },
                ],
              },
            },
          })
        );
      }),

      rest.get(process.env.PUBLIC_URL + '/api/upload/files', (req, res, ctx) => {
        const params = qs.parse(req.url.searchParams.toString());
        const { filters }: any = params;
        if (!filters || !filters.id || !filters.id.$in) return res(ctx.json([]));
        return res(
          ctx.delay(800),
          ctx.json(
            filters.id.$in.map((id: number | string) => ({
              id,
              url: process.env.PUBLIC_URL + '/assets/placeholder.png',
              name: 'placeholder.png',
              mime: 'image/png',
              size: 67.5,
            }))
          )
        );
      }),

      rest.get(process.env.PUBLIC_URL + '/api/categories', (req, res, ctx) => {
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

      rest.get(process.env.PUBLIC_URL + '/api/tags', (req, res, ctx) => {
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
