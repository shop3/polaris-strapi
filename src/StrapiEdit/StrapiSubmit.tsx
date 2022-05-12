import React from 'react';
import { ButtonProps } from '@shopify/polaris';

type Props = Pick<ButtonProps, 'primary' | 'size'> & {
  formId: string;
};

export const StrapiSubmit: React.FC<Props> = ({ children, primary, size, formId }) => {
  const buttonClassNames = ['Polaris-Button'];
  // primary button
  if (primary) {
    buttonClassNames.push('Polaris-Button--primary');
  }
  // button size
  switch (size) {
    case 'large':
      buttonClassNames.push('Polaris-Button--sizeLarge');
      break;
    case 'slim':
      buttonClassNames.push('Polaris-Button--sizeSlim');
      break;
    default:
      break;
  }
  // return button
  return (
    <button className={buttonClassNames.join(' ')} type="submit" form={formId}>
      <span className="Polaris-Button__Content">{children}</span>
    </button>
  );
};
