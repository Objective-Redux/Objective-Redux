// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React from 'react';
import { ComponentConnector } from 'objective-redux';
import { SwitchStateController } from './store/switch-state-controller';
import { SwitchStateSagas } from './store/switch-state-sagas';

function ConnectedComponent(props) {
  const { isOn, count, register } = props;

  const sendToggleAction = () => {
    SwitchStateSagas.getInstance(register).toggleSwitch();
  };

  return (
    <div id="connected">
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

export default ComponentConnector
  .addPropsTo(ConnectedComponent)
  .from(SwitchStateController)
  .connect();
