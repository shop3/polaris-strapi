# Shop3 Polaris Strapi

Collection of Polaris components ready to use with Strapi in Shopify applications.

## Installation

```bash
npm install --save @shop3/polaris-strapi
```

## Storybook

Components are documented in Storybook at https://shop3.github.io/polaris-strapi/

# Usage

## Strapi Edit

```jsx
import { Card } from '@shopify/polaris';
import { StrapiEdit } from '@shop3/polaris-strapi';

const App = () => {
  return (
    <Card sectioned>
      <StrapiEdit
        formId="strapi-edit-form"
        resourceUrl='/api/greetings'
        method="POST"
        authToken={/* api auth token */}
      >
        {/* text input */}
        <StrapiTextInput label="From" field="from" maxLength={64} />
        {/* text input */}
        <StrapiTextInput label="Message" field="message" maxLength={128} count />
        {/* number input */}
        <StrapiNumberInput label="Quantity" field="quantity" />
        {/* media input */}
        <StrapiMediaInput label="Image" field="image" mediaType="image" />
        {/* enum input */}
        <StrapiEnumInput
          label="Color"
          field="color"
          options={[
            { label: 'Red', value: 'RED' },
            { label: 'Green', value: 'GREEN' },
            { label: 'Blue', value: 'BLUE' },
          ]}
        />
      </StrapiEdit>
    </Card>
  );
};
```

## Strapi List

```jsx
import { TextContainer } from '@shopify/polaris';
import { StrapiList, StrapiListFilter, StrapiListItem, StrapiListText } from '@shop3/polaris-strapi';

const App = () => {
  return (
    <StrapiList
      resourceUrl='/api/greetings'
      authToken={/* api auth token */}
      sorting={{
        default: { field: 'id', order: 'asc' },
        options: [
          { label: 'From ASC', field: 'from', order: 'asc' },
          { label: 'From DESC', field: 'from', order: 'desc' },
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
              label: 'From',
              field: 'from',
              type: 'string',
            },
          ]}
        />
      }
    >
      <StrapiListItem resourceUrl="/api/greetings" nameField="from" mediaField="image">
        <TextContainer>
          <StrapiListText textField="title" variation="strong" />
          <StrapiListText textField="message" />
        </TextContainer>
      </StrapiListItem>
    </StrapiList>
  );
};
```

## Strapi Show

```jsx
import { Card, Layout } from '@shopify/polaris';
import { StrapiShowPage, StrapiShowText } from '@shop3/polaris-strapi';

const App = () => {
  return (
    <StrapiShowPage
      resourceUrl='/api/greetings/1'
      authToken={/* api auth token */}
      titleField="from"
      mediaField="image"
    >
      <Layout>
        <Layout.Section oneThird>
          <StrapiShowImage resourceUrl="/api/greetings/1" field="image" size="large" authToken={/* api auth token */} />
        </Layout.Section>
        <Layout.Section>
          <Card sectioned>
            <StrapiShowText resourceUrl="/api/greetings/1" field="message" authToken={/* api auth token */} />
          </Card>
        </Layout.Section>
      </Layout>
    </StrapiShowPage>
  );
};
```

# Development

## Installation

```bash
npm install

npm run husky:install
```

## Development

```bash
npm run develop
```
