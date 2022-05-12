import type { Form } from '../types';

export type EditAction = {
  type: 'edit';
  form: Form;
};

export type ResetAction = {
  type: 'reset';
};

export type SendAction = {
  type: 'send';
};

export type DoneAction = {
  type: 'done';
};

export type Action = EditAction | SendAction | ResetAction | DoneAction;
