import React from 'react';
import { Card, Page } from '@shopify/polaris';
import { rest } from 'msw';

import { StrapiPlan } from '../src';

export default {
  title: 'Common/Strapi Plan',
  component: null,
};

const Template = ({ resource }: any) => (
  <Page fullWidth>
    <Card>
      <StrapiPlan resourceUrl={`${process.env.PUBLIC_URL}/api/${resource}`} />
    </Card>
  </Page>
);

export const Example: any = Template.bind({});

Example.args = {
  resource: 'plans',
};

Example.parameters = {
  msw: {
    handlers: [
      rest.get(process.env.PUBLIC_URL + '/api/plans', (req, res, ctx) => {
        return res(
          ctx.delay(800),
          ctx.json({
            data: [
              {
                name: 'SILVER PLAN',
                recurringPrice: 50,
                currencyCode: 'USD',
                recurringInterval: 'ANNUAL',
                trialDays: 7,
                usageCappedAmount: 5,
                usageTerms: 'This is a silver plan',
              },
              {
                name: 'GOLD PLAN',
                recurringPrice: 50,
                currencyCode: 'USD',
                recurringInterval: 'ANNUAL',
                trialDays: 7,
                usageCappedAmount: 5,
                usageTerms: 'This is a gold plan',
              },
              {
                name: 'TEST PLAN',
                recurringPrice: 50,
                currencyCode: 'USD',
                recurringInterval: 'ANNUAL',
                trialDays: 7,
                usageCappedAmount: 5,
                usageTerms: 'This is a test plan',
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
