// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { LazyLoader } from './lazy-loader';
import { ControllerNameNotDefined } from './controllernamenotdefined';
import { ReduxRegister, getActionNameForController } from './';

/**
 * @internal
 */
export type ModelConstructor<T> = new (register: ReduxRegister) => T;

/**
 * @internal
 */
export abstract class Controller {
  private count = 0;

  /**
   * The ReduxController to which the controller belongs.
   */
  protected register: ReduxRegister;

  protected constructor(register: ReduxRegister) {
    this.register = register;
    (this.constructor as any).instances.set(register, this);
  }

  /**
   * Gets the name of the state slice.
   *
   * If the controller will be used with lazy loading, the name of the controller must be globally unique.
   *
   * @returns The name of the state slice.
   */
  public static getName(): string {
    throw new ControllerNameNotDefined('No name was defined for this controller');
  }

  /**
   * Generates a unique, default action name.
   *
   * @param name The name of the action or null to generate a unique, default action name.
   * @returns An action name.
   */
  protected createActionName(name: string|null = null): string {
    const actionName = name || `${this.count++}`;
    const controllerName: string = (this.constructor as any).getName();
    return getActionNameForController(controllerName, actionName);
  }

  /**
   * Gets an instance of the class, creating one if it does not yet exist.
   *
   * This should be used as the method of instantiating controllers.
   *
   * @template T the controller type. Will be inferred from the class instance and does not need to be provided.
   * @param this Implicit "this" for internal use. When calling, this parameter should be ignored/skipped.
   * @param register An instance of the ReduxRegister from which to get the controller.
   * @returns An instance of the controller.
   *
   * @example
   * ```typescript
   * const instance = MyController.getInstance(register);
   * ```
   */
  public static getInstance<T extends Controller>(
    this: ModelConstructor<T> & typeof Controller,
    register: ReduxRegister
  ): T {
    if (!(this as any).instances) {
      (this as any).instances = new WeakMap();
    }

    let instance = (this as any).instances.get(register);
    if (!instance) {
      instance = new this(register);
    }

    return instance;
  }

  /**
   * Allows the controller to be lazy loaded by actions triggered outside of Objective-Redux.
   *
   * This can be used in conjunction with the method [[withAddressableName]].
   *
   * @param this Implicit "this" parameter, which does not need to be supplied.
   * @example
   * ```typescript
   * class MyController extends StateController<MySliceType> {
   *   // ...
   * }
   *
   * MyController.lazyLoadOnExternalAction();
   *
   * export MyController;
   * ```
   */
  public static lazyLoadOnExternalAction<T extends typeof Controller>(this: T): void {
    LazyLoader.registerController(this);
  }
}
