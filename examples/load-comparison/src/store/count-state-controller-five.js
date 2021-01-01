// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { StateController } from 'objective-redux';

const initialState = 0;

export class CountStateControllerFive extends StateController {
  constructor(objectiveStore) {
    super(initialState, objectiveStore);
  }

  static getName() {
    return 'count-five';
  }

  increment = this.registerAction(
    state => state + 1
  );
}

CountStateControllerFive.initializeOnExternalAction();
