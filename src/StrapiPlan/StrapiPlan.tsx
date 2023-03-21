import React from 'react';
import { Stack, Card } from '@shopify/polaris';
import { PlanCard } from '@shop3/polaris-common';
import _ from 'lodash';
import { useResource } from '../hooks';

type StrapiPlanProps = {
  resourceUrl: string;
  authToken?: string;
};

type PlanData = {
  name: string;
  recurringPrice: number;
  currencyCode: string;
  recurringInterval: string;
  trialDays: number;
  usageCappedAmount: number;
  usageTerms: string;
  paymentsMode: string;
  oneTimePrice: number;
};

const StrapiPlan: React.FC<StrapiPlanProps> = ({ resourceUrl, authToken }) => {
  const { data: response } = useResource(resourceUrl, authToken);
  const data: PlanData[] = _.get(response, 'data', []);

  return (
    <Stack wrap distribution="center">
      {data.map((plan, index) => (
        <Card.Section key={`sp-${index}`}>
          <PlanCard
            name={plan.name}
            recurringPrice={plan.recurringPrice}
            currencyCode={plan.currencyCode}
            recurringInterval={plan.recurringInterval}
            trialDays={plan.trialDays}
            usageCappedAmount={plan.usageCappedAmount}
            usageTerms={plan.usageTerms}
            paymentsMode={plan.paymentsMode}
            oneTimePrice={plan.oneTimePrice}
          />
        </Card.Section>
      ))}
    </Stack>
  );
};

export default StrapiPlan;
export type { StrapiPlanProps };
