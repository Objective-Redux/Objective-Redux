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
import { useRegister, useController } from 'objective-redux';
import { SwitchStateController } from './store/switch-state-controller';
import { SwitchStateSagas } from './store/switch-state-sagas';

export default function HookComponent() {

  const register = useRegister();
  const switchStateController = useController(SwitchStateController);

  const { isOn, count } = switchStateController?.getStateSlice();

  const sendToggleAction = () => {
    SwitchStateSagas.getInstance(register).toggleSwitch();
  };

  return (
    <>
      <p>
        <button onClick={sendToggleAction}>Click me</button>
      </p>
      <p>
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
    </>
  );
}

HookComponent.displayName = 'HookComponent';
