// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { ObjectiveStoreProviderContext } from './context';
import { ObjectiveStore } from '.';

/**
 * Provides an ObjectiveStore to child React components.
 *
 * @param object The properties being passed to the component.
 * @param object.children The child components of the provider.
 * @param object.objectiveStore An instance of the ObjectiveStore.
 *
 * @example
 * ```typescript
 * export const store = new ObjectiveStore();
 *
 * ReactDOM.render(
 *   <ObjectiveStoreProvider objectiveStore={objectiveStore}>
 *     <App />
 *   </ObjectiveStoreProvider>,
 *   document.getElementById('root')
 * );
 * ```
 *
 * @returns The provider that will render with its child components.
 */
export function ObjectiveStoreProvider(
  { objectiveStore, children }: { objectiveStore: ObjectiveStore; children: any }
): JSX.Element {
  return (
    <ObjectiveStoreProviderContext.Provider value={objectiveStore}>
      {children}
    </ObjectiveStoreProviderContext.Provider>
  );
}
