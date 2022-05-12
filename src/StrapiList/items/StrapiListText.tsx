import React, { useContext } from 'react';
import { TextStyle, TextStyleProps } from '@shopify/polaris';
import _ from 'lodash';
import ItemContext from './context';

type Props = TextStyleProps & {
  textField: string;
};

const StrapiListText: React.FC<Props> = ({ textField, ...rest }) => {
  const { item } = useContext(ItemContext);

  const text = _.get(item, textField, '');

  return <TextStyle {...rest}>{text}</TextStyle>;
};

export default StrapiListText;
