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
import { useController } from 'objective-redux';
import { SwitchStateController } from './store/switch-state-controller';
import { SwitchStateSagas } from './store/switch-state-sagas';

export default function HookComponent() {
  const switchStateController = useController(SwitchStateController);
  const switchStateSagas = useController(SwitchStateSagas);

  const { isOn, count } = switchStateController?.getStateSlice();

  const sendToggleAction = () => {
    switchStateSagas.toggleSwitch();
  };

  return (
    <div id="hook">
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

HookComponent.displayName = 'HookComponent';
