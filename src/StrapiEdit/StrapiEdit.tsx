import React, { SyntheticEvent, useCallback, useReducer } from 'react';
import _ from 'lodash';
import reducer from './state';
import context from './context';
import { Form, DbEntity } from './types';
import { isFileArray, uploadFiles } from './media';

type Props = {
  formId: string;
  resourceUrl: string;
  method: 'POST' | 'PUT';
  initialValue?: Form;
  beforeSubmit?: (form: Form) => Promise<void> | void;
  afterSubmit?: (entity: DbEntity) => Promise<void> | void;
};

export const StrapiEdit: React.FC<Props> = ({
  resourceUrl,
  method,
  formId,
  initialValue,
  beforeSubmit,
  afterSubmit,
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, { state: 'idle', form: initialValue || {} });
  const formErrors = {};

  const setForm = useCallback(
    (form: Form) => {
      dispatch({ type: 'edit', form });
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: SyntheticEvent) => {
      e.preventDefault();
      dispatch({ type: 'send' });
      const formReq = _.cloneDeep(state.form);
      if (beforeSubmit) await beforeSubmit(formReq);
      const result = await sendRequest(resourceUrl, method, formReq);
      if (afterSubmit) await afterSubmit(result);
      dispatch({ type: 'done' });
    },
    [resourceUrl, method, state, beforeSubmit, afterSubmit]
  );

  return (
    <context.Provider value={{ form: state.form, setForm, formErrors }}>
      <form id={formId} method={method} onSubmit={handleSubmit}>
        {children}
      </form>
    </context.Provider>
  );
};

async function sendRequest(resourceUrl: string, httpMethod: 'POST' | 'PUT', form: Form) {
  const files = await uploadRequest(form);
  const response = await fetch(resourceUrl, {
    method: (httpMethod || 'POST').toLowerCase(),
    body: JSON.stringify({ data: _.merge(form, files) }),
    headers: new Headers({
      'Content-Type': 'application/json',
    }),
  });
  if (response.status >= 400) {
    throw new Error('failed to send request');
  }
  const result = await response.json();
  return result;
}

async function uploadRequest(form: Form) {
  const inputs = Object.entries(form);
  const outputs: { [k: string]: number | number[] } = {};
  for (const [key, value] of inputs) {
    if (value instanceof File) {
      const file = await uploadFiles(value);
      outputs[key] = file.id;
    } else if (isFileArray(value)) {
      const files = await uploadFiles(value);
      outputs[key] = files.map((file) => file.id);
    }
  }
  return outputs;
}
