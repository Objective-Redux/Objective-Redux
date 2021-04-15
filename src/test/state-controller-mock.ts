// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { StateController, ReducerFn } from '../controllers/state-controller';
import { SagaConfig } from '../controllers/stateless-controller';
import { ActionExtendFn, ActionFn } from '../helpers/action';

/**
 * @internal
 */
export class StateControllerMock<State> extends StateController<State> {
  protected createReducingAction<Payload>(fn: ReducerFn<State, Payload>): ActionExtendFn<Payload> {
    let mutationFn: any = fn;

    mutationFn.withAddressableName = (name: string): ActionFn<Payload> => {
      mutationFn = fn;
      mutationFn.actionName = name;
      return mutationFn;
    };

    return mutationFn;
  }

  protected internalBuildSaga<Payload>(config: SagaConfig): any {
    const {
      name,
      effectBuilder,
      sagaFn,
    } = config;

    const resultFn: any = sagaFn;
    resultFn.actionName = name;
    resultFn.effect = effectBuilder;
    resultFn.effectType = effectBuilder?.name;

    return resultFn;
  }
}
