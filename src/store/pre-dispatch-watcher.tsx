// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import * as React from 'react';
import { Action } from '../helpers/action';

/**
 * @internal
 */
interface LazyReference {
  promise: (retValue: { default: never } | PromiseLike<{ default: never }>) => void;
  importFn: () => Promise<any>;
}

/**
 * @internal
 */
export class PreDispatchWatcher {
  private readonly importFns: Record<string, LazyReference> = {};

  /**
   * Adds a webpack module with a React component that needs to be lazily-loaded when
   * an action with the value of actionType is fired.
   *
   * @param actionType The name of the action for which Objective Redux will watch.
   * @param importFn A function to import the webpack module.
   * @returns A React.lazy component instance.
   */
  public watchForActionWithComponent(actionType: string, importFn: () => Promise<any>): React.LazyExoticComponent<any> {
    // Add a new entry into our map of actions for which the ObjectiveStore will watch
    (this.importFns as any)[actionType] = {};

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

  /**
   * Determines if a bundle/component needs to be loaded and, if so, loads it.
   *
   * @param action The action that was fired.
   * @returns A promise for the bundle/component being loaded.
   */
  public loadComponentForAction(action: Action<any>): Promise<any>|null {
    // Make sure this is an action we care about
    if (!action?.type || !this.importFns[action.type]) {
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
