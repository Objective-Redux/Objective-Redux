// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import {
  StatelessController, configureTakeLatest, getRegisterFromSagaContext, getControllerFromSagaContext,
} from 'objective-redux';
import { SwitchStateController } from './switch-state-controller';

export class SwitchStateSagas extends StatelessController {
  static getName() {
    return 'switchSagas';
  }

  toggleSwitch = this.createSaga()
    .withTake(configureTakeLatest())
    .withAddressableName('update-switch')
    .register(
      function* () {
        const register = yield getRegisterFromSagaContext();
        const switchStateController = yield getControllerFromSagaContext(SwitchStateController);
        yield switchStateController.toggleSwitchValue();
        yield SwitchStateController.getInstance(register).incrementCount();
      }
    );
}

SwitchStateSagas.lazyLoadOnExternalAction();
