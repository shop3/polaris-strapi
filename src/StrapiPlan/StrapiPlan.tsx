import React from 'react';
import { Columns, Box } from '@shopify/polaris';
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
    <Columns gap="4" columns={3}>
      {data.map((plan, index) => (
        <Box key={`sp-${index}`}>
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
        </Box>
      ))}
    </Columns>
  );
};

export default StrapiPlan;
export type { StrapiPlanProps };
