// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { StatelessController, SagaConfig } from '../controllers/stateless-controller';

/**
 * @internal
 */
export class StatelessControllerMock extends StatelessController {
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
