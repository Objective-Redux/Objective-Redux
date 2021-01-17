// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React from 'react';
import { ComponentConnector } from 'objective-redux';

function ConnectedStateComponent(props) {
  const { isOn, count } = props;

  return (
    <div id="connected-state">
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

const selectorFn = state => {
  const {
    TEST_NAMESPACE: {
      switch: {
        count,
        isOn,
      } = {},
    } = {},
  } = state;

  return { count, isOn };
};

export default ComponentConnector
  .addPropsTo(ConnectedStateComponent)
  .fromState(selectorFn)
  .connect();
