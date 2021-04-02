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
import { connect } from 'react-redux';
import { metrics } from './metrics';

function ReactReduxComponent(props) {
  const { count, children } = props;
  ++metrics.renders;

  return (
    <div className="result" style={{ borderLeft: '1px solid #000', paddingLeft: '1px' }}>
      The count is&nbsp;
      {count}
      {children}
    </div>
  );
}

export default function ReactReduxComponentMaker(controller) {
  return connect(
    (state, ownProps) => ({
      ...ownProps,
      count: state[controller.getName()].incValue,
    })
  )(ReactReduxComponent);
}
