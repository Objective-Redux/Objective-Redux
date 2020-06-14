// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { AnyAction } from 'redux';
import { Controller } from './controller';

/**
 * @internal
 */
interface ControllerMap {
  [key: string]: typeof Controller;
}

/**
 * @internal
 */
export class LazyLoader {
  private static readonly registeredControllers: ControllerMap = {};

  public static registerController(controller: typeof Controller): void {
    this.registeredControllers[controller.getName()] = controller;
  }

  public static getControllerForAction(action: AnyAction): typeof Controller|null {
    let controller = null;
    const type = action?.type;

    if (type) {
      const match = type.match('^OBJECTIVE-REDUX-ACTION/([^/]*)/.*$');
      if (match && match.length === 2) {
        const [, actionName] = match;
        controller = LazyLoader.registeredControllers[actionName];
      }
    }

    return controller;
  }
}
