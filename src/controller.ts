// ================================================================================================
//                                          Objective Redux
//                 (c) Copyright 2020 by Jason Mace (jmace01). All rights reserved.
//
// This code is provided under the terms of the [object Object] license. See the LICENSE file for
// terms.
// ================================================================================================
import { ReduxRegister } from '.';

/**
 * @internal
 */
type ModelConstructor<T> = new () => T;

/**
 * @internal
 */
export class Controller {
  /**
   * The ReduxController to which the controller belongs.
   */
  protected register: ReduxRegister;

  public constructor(register: ReduxRegister) {
    this.register = register;

    if (!(this.constructor as any).instances) {
      (this.constructor as any).instances = new WeakMap();
    }

    (this.constructor as any).instances.set(register, this);
  }

  /**
   * Gets an instance of the class, creating one if it does not yet exist.
   *
   * This should be used as the method of instantiating controllers.
   *
   * @template T the controller type. Will be inferred from the class instance and does not need to be provided.
   * @param this Implicit this for internal use.
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
}
