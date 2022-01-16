// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================
import React from 'react';
import { connect } from 'react-redux';
import { createAction, getActionNameForController } from 'objective-redux';
import { compose } from 'redux';
import { injectReducer, injectSaga } from 'redux-injectors';

const action = createAction(getActionNameForController('switchSagas', 'update-switch'));

function ReactReduxComponent(props) {
  const { isOn, count, dispatch } = props;

  const sendToggleAction = () => {
    dispatch(action());
  };

  return (
    <div id="react-redux">
      <p>
        <button onClick={sendToggleAction}>Click me</button>
      </p>
      <p className="result">
        Switch is
        {' '}
        {isOn ? 'On' : 'Off'}
        <br />
        Turned on
        {' '}
        {count}
        {' '}
        times
      </p>
    </div>
  );
}

const reducer = (state = { foo: 'bar' }) => state;

const component = connect(
  (state, ownProps) => ({
    ...ownProps,
    ...state.TEST_NAMESPACE.switch,
  })
)(ReactReduxComponent);

const withReducers = injectReducer({
  key: 'TEST_KEY',
  reducer,
});

const withSaga = injectSaga({
  key: 'TEST_KEY_2',
  saga: function* () {},
});

export default compose(
  withReducers,
  withSaga
)(component);
