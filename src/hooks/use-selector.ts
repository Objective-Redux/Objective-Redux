// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import {
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { HookSubscriber } from './hook-subscriber';
import { useObjectiveStore } from './use-objective-store';

/**
 * Gets a selection of the state from the store.
 *
 * @param selectorFn A selector/mapping function used to select values out of the state.
 * @returns The selected piece of state from the store.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useSelector } from 'objective-redux';
 *
 * export function MyFunctionalComponent() {
 *   const { isOn } = useSelector(state => ({ isOn: state.switch.isOn }));
 *
 *   return <p>Switch is { isOn ? 'On' : 'Off' }</p>;
 * }
 * ```
 */
export const useSelector = <T>(selectorFn: (state: any) => T): any => {
  const objectiveStore = useObjectiveStore();
  const [, forceUpdate] = useReducer(c => c + 1, 0);

  if (!objectiveStore) {
    return null;
  }

  const getSlice = (): T => selectorFn(objectiveStore.getState());

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

  return getSlice();
};
