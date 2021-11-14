// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import React from 'react';

/**
 * A simple example implementation for a React.lazy pre-dispatch hook.
 * This allows you to lazy-load React components along with their controllers
 * when an action targeting the lazy-loaded bundle is fired.
 *
 * @example
 * ```
 * const preDispatchManager = new PreDispatchManager();
 *
 * const myActionName = getActionNameForController('MyControllerInBundle', 'action-name-on-controller');
 * const LazyComponent = preDispatchManager.watchForActionWithComponent(
 *   myActionType,
 *   () => import('./lazy-module')
 * );
 *
 * const objectiveStore = new ObjectiveStore({
 *   preDispatchHook: preDispatchManager.loadComponentForAction.bind(preDispatchManager),
 * });
 * ```
 *
 * See the index.js file for more.
 */
export class PreDispatchManager {
  importFns = {};

  /**
   * Adds a webpack module with a React component that needs to be lazily-loaded when
   * an action with the value of actionType is fired.
   *
   * @param actionType The name of the action for which Objective Redux will watch.
   * @param importFn A function to import the webpack module.
   * @returns A React.lazy component instance.
   */
  watchForActionWithComponent(actionType, importFn) {
    // Add a new entry into our map of actions for which the ObjectiveStore will watch
    this.importFns[actionType] = {};

    // Create a React.lazy component that will resolve when the action is fired and the
    // bundle has been initialized/setup
    const lazy = React.lazy(() => new Promise(
      rs => {
        this.importFns[actionType].promise = rs;
      }
    ));

    // Add the webpack import function
    this.importFns[actionType].importFn = importFn;

    // Return the React.lazy component so it can be used in the DOM
    return lazy;
  }

  loadComponentForAction(action) {
    // Make sure this is an action we care about
    if (action && action.type && !this.importFns[action.type]) {
      // Returning a non-promise tells the ObjectiveStore not to wait before
      // firing the action.
      return null;
    }

    // Get the previously saved date for the action
    const {
      importFn,
      promise,
    } = this.importFns[action.type];

    // Import the webpack module
    const importPromise = importFn().then(imported => promise(imported));

    // Stop watching for the action-- no need to try importing more than once
    delete this.importFns[action.type];

    // Return the promise to let the ObjectiveStore know when we're finished
    return importPromise;
  }
}
