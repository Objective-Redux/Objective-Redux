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
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { Controller, ModelConstructor } from './controller';
import { HookSubscriber } from './hook-subscriber';
import { useObjectiveStore } from './use-objective-store';

/**
 * Gets a controller from the ObjectiveStore using hook.
 *
 * @template C The type of controller that will be returned. This type is inferred and does not need to be specified in
 * TypeScript.
 * @param controller The controller class of which an instance should be retrieved.
 * @param selectorFn A state mapping function used to determine if the component needs to re-render. Defaults to
 * (state: any): any => state.
 * @returns An instance of the provided controller or null if there is no ObjectiveStore instance in the components
 * context.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useController } from 'objective-redux';
 * import { SwitchStateController } from './switch-state-controller';
 *
 * export function MyFunctionalComponent() {
 *   const switchStateController = useController(SwitchStateController);
 *   const { isOn } = switchStateController.getStateSlice();
 *
 *   return <p>Switch is { isOn ? 'On' : 'Off' }</p>;
 * }
 * ```
 */
// eslint-disable-next-line max-statements
export const useController = <C extends Controller>(
  controller: typeof Controller & ModelConstructor<C>,
  selectorFn: (state: any) => any = (state: any): any => state
): C|null => {
  const objectiveStore = useObjectiveStore();
  const [, forceUpdate] = useReducer(c => c + 1, 0);

  if (!objectiveStore) {
    return null;
  }

  const instance: any = controller.getInstance(objectiveStore);

  let i = 0;
  let getSlice = (): number => i++;

  if (instance.getStateSlice) {
    getSlice = (): any => selectorFn(instance.getStateSlice());
  }

  const subscription = useMemo(
    () => new HookSubscriber(
      objectiveStore,
      getSlice,
      forceUpdate
    ),
    [objectiveStore]
  );
  subscription.subscribe();

  useEffect(
    () => subscription.unsubscribe.bind(subscription),
    [objectiveStore]
  );

  return instance;
};
