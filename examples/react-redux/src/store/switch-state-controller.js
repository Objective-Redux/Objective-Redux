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

const initialState = {
  isOn: false,
  count: 0,
};

export class SwitchStateController extends StateController {
  constructor() {
    super(initialState);
  }

  static getName() {
    return 'switch';
  }

  static getNamespace() {
    return 'TEST_NAMESPACE';
  }

  toggleSwitchValue = this.createReducingAction(
    state => ({
      ...state,
      isOn: !state.isOn,
    })
  );

  setSwitch = this.createReducingAction(
    (state, isOn) => ({
      ...state,
      isOn,
    })
  );

  incrementCount = this.createReducingAction(
    state => ({
      ...state,
      count: state.count + state.isOn,
    })
  );
}

SwitchStateController.initializeOnExternalAction();
