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
import { useController } from 'objective-redux';
import { LazyLoadedStateController } from './LazyLoadedStateController';

export function LazyComponent() {
  const controller = useController(LazyLoadedStateController);
  const message = controller.getStateSlice();

  return (
    <div id="lazyTarget">
      {message}
    </div>
  );
}
