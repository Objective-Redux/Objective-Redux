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
import { useSelector } from 'objective-redux';

export default function HookStateComponent() {
  const { isOn, count } = useSelector(state => {
    const {
      TEST_NAMESPACE: {
        switch: {
          count: cnt,
          isOn: on,
        } = {},
      } = {},
    } = state;

    return { count: cnt, isOn: on };
  });

  return (
    <div id="hook-state">
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

HookStateComponent.displayName = 'HookStateComponent';
