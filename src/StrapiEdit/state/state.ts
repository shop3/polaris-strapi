import type { Form } from '../types';

type StateEnum = 'idle' | 'edit' | 'send';

export type State = {
  state: StateEnum;
  form: Form;
};
