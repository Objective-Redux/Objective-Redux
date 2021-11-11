// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import {
  StatelessController, configureTakeLatest, getObjectiveStoreFromSagaContext, getControllerFromSagaContext,
} from 'objective-redux';
import { SwitchStateController } from './switch-state-controller';
import { getContext } from 'redux-saga/effects';

export class SwitchStateSagas extends StatelessController {
  static constructedTimes = 0;

  static getName() {
    return 'switchSagas';
  }

  constructor() {
    super();
    SwitchStateSagas.constructedTimes++;
    const elem = document.getElementById('statelessConstructorCount');
    if (elem) {
      elem.innerHTML = `SwitchStateSagas constructed ${SwitchStateSagas.constructedTimes} times`;
    }
  }

  toggleSwitch = this.createSagaAction(function* () {
    const objectiveStore = yield getObjectiveStoreFromSagaContext();
    const testCanary = yield getContext('test');
    if (testCanary !== 'Some Value') {
      throw new Error('Original context is corrupt');
    }
    const switchStateController = yield getControllerFromSagaContext(SwitchStateController);
    yield switchStateController.toggleSwitchValue();
    yield SwitchStateController.getInstance(objectiveStore).incrementCount();
  })
    .withEffect(configureTakeLatest())
    .withAddressableName('update-switch')
    .register();
}

SwitchStateSagas.initializeOnExternalAction();
