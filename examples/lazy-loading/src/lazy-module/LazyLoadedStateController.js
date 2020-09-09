// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { StateController } from 'objective-redux';

const initialState = 'No action fired';

export class LazyLoadedStateController extends StateController {
  constructor(register) {
    super(initialState, register);
  }

  static getName() {
    return 'lazy';
  }

  action = this.registerAction(
    () => 'Lazy loaded data worked'
  ).withAddressableName('test');
}

LazyLoadedStateController.initializeOnExternalAction();