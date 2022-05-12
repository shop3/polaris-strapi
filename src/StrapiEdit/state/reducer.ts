import _ from 'lodash';
import { Action } from './actions';
import { State } from './state';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    // edit action
    case 'edit':
      if (state.state === 'send') return _.cloneDeep(state);
      return { state: 'edit', form: action.form };
    // reset action
    case 'reset':
      if (state.state === 'send') return _.cloneDeep(state);
      return { state: 'idle', form: {} };
    // send action
    case 'send':
      if (state.state !== 'edit') return _.cloneDeep(state);
      return { state: 'send', form: state.form };
    // done action
    case 'done':
      if (state.state !== 'send') return _.cloneDeep(state);
      return { state: 'idle', form: state.form };
    // default action
    default:
      throw new Error('invalid action');
  }
}

export default reducer;
