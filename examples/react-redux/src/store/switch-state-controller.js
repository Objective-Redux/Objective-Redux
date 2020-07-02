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

const initialState = {
  isOn: false,
  count: 0,
};

export class SwitchStateController extends StateController {
  constructor(register) {
    super(initialState, register);
  }

  static getName() {
    return 'switch';
  }

  toggleSwitchValue = this.registerAction(
    state => ({
      ...state,
      isOn: !state.isOn,
    })
  );

  setSwitch = this.registerAction(
    (state, isOn) => ({
      ...state,
      isOn,
    })
  );

  incrementCount = this.registerAction(
    state => ({
      ...state,
      count: state.count + state.isOn,
    })
  );
}

SwitchStateController.lazyLoadOnExternalAction();