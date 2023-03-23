import React, { useContext } from 'react';
import { TextStyleProps } from '@shopify/polaris';
import _ from 'lodash';
import ItemContext from './context';

type Props = TextStyleProps & {
  textField: string;
};

const StrapiListText: React.FC<Props> = ({ textField }) => {
  const { item } = useContext(ItemContext);

  const text = _.get(item, textField, '');

  return <>{text}</>;
};

export default StrapiListText;
