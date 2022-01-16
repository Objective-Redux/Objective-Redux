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
import { useSelector } from 'react-redux';
import { metrics } from './metrics';

export default function makeReactReduxHookComponent(controllerClass) {
  return props => {
    const { children } = props;
    const count = useSelector(state => state[controllerClass.getName()].incValue);
    ++metrics.renders;

    return (
      <div className="result" style={{ borderLeft: '1px solid #000', paddingLeft: '1px' }}>
        The count is&nbsp;
        {count}
        {children}
      </div>
    );
  };
}
