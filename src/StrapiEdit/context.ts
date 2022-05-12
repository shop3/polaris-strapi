import React from 'react';
import type { Form } from './types';

type Context = {
  form: Form;
  setForm: (data: Form) => void;
  formErrors: { [k in keyof Form]: string };
};

export default React.createContext<Context>({} as Context);
