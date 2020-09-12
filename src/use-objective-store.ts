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
  useContext,
  useReducer,
  useMemo,
  useEffect,
} from 'react';
import { ObjectiveStoreProviderContext } from './context';
import { HookSubscriber } from './hook-subscriber';
import { ObjectiveStore } from '.';

/**
 * Gets the ObjectiveStore from the React context for use in a functional component.
 *
 * As an alternative (for example, in class components where hooks cannot be used), the ComponentConnector may be used
 * instead.
 *
 * @returns An instance of the ObjectiveStore, if one exists.
 *
 * @example
 * ```typescript
 * import React from 'react';
 * import { useObjectiveStore } from 'objective-redux';
 * import { MyStateController } from './store/my-state-controller';
 *
 * export default function() {
 *   const objectiveStore = useObjectiveStore();
 *   const { value } = MyStateController.getInstance(objectiveStore).getStateSlice();
 *
 *   return <p>{ value }</p>;
 * }
 * ```
 */
export const useObjectiveStore = (): ObjectiveStore|null => {
  const objectiveStore = useContext(ObjectiveStoreProviderContext);
  const [, forceUpdate] = useReducer(c => c + 1, 0);

  const subscription = useMemo(() => new HookSubscriber(objectiveStore, forceUpdate), [objectiveStore]);
  subscription.subscribe();

  useEffect(
    () => subscription.unsubscribe.bind(subscription),
    [objectiveStore]
  );

  return objectiveStore;
};
