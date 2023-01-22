// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { LazyExoticComponent } from 'react';
import { useObjectiveStore } from './use-objective-store';

/**
 * Begins watching for an action with a particular type to be fired. When the action has been fired,
 * the associated import function will be fired and the lazy component returned will be render-able.
 *
 * @param actionType The type of the Redux action on which the bundle and component should be loaded.
 * @param importFn The import function that will load the bundle.
 * @returns A React lazy component.
 *
 * @example
 * ```
 * const MainComponent = () => {
 *   const LazyComponent = useActionToLoadComponent(
 *     getActionNameForController('My-Controller', 'My-Named-Action'),
 *     () => import('./lazy-module')
 *   );
 *   return (
 *     <>
 *       <Suspense fallback={<div>Click the button</div>}>
 *         <LazyComponent />
 *       </Suspense>
 *       <button onClick={load} id="load-bundle">Click Me</button>
 *     </>
 *   );
 * };
 * ```
 */
export const useActionToLoadComponent = (
  actionType: string,
  importFn: () => Promise<any>
): LazyExoticComponent<any>|null => {
  const objectiveStore = useObjectiveStore();

  const LazyComponent = objectiveStore?.watchForActionWithComponent(
    actionType,
    importFn
  );

  return LazyComponent ?? null;
};
