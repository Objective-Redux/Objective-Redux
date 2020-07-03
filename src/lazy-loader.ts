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
import { Controller, ModelConstructor } from './controller';
import { ReduxRegister } from '.';

/**
 * @internal
 */
interface ControllerMap {
  [key: string]: typeof Controller;
}

/**
 * @internal
 */
interface ControllerInstanceMap<T extends Controller> {
  [key: string]: T;
}

/**
 * @interface
 */
type RegisterToLoadedControllers<T extends Controller> = WeakMap<ReduxRegister, ControllerInstanceMap<T>>;

/**
 * @internal
 */
type ReduxRegisterFn = (controller: any) => void;

/**
 * @internal
 */
type RegisterReducerFnMap = WeakMap<ReduxRegister, ReduxRegisterFn>;

/**
 * @internal
 */
export class LazyLoader {
  private static readonly loadableControllers: ControllerMap = {};

  private static readonly reducerFns: RegisterReducerFnMap = new WeakMap();

  private static readonly controllers: RegisterToLoadedControllers<any> = new WeakMap();

  public static registerController(controller: typeof Controller): void {
    this.loadableControllers[controller.getName()] = controller;
  }

  public static getControllerForAction(action: AnyAction): typeof Controller|null {
    let controller = null;
    const type = action?.type || '';

    const match = type.match('^OBJECTIVE-REDUX-ACTION/([^/]*)/.*$');
    if (match) {
      controller = LazyLoader.loadableControllers[match[1]];
    }

    return controller;
  }

  public static addRegister(register: ReduxRegister, registerReducerFn: ReduxRegisterFn): void {
    this.reducerFns.set(register, registerReducerFn);
    this.controllers.set(register, {});
  }

  // eslint-disable-next-line max-statements
  public static getController<T extends Controller>(
    register: ReduxRegister,
    ControllerClass: ModelConstructor<T> & typeof Controller
  ): T {
    const name = ControllerClass.getName();
    const controllerMap: ControllerInstanceMap<any> = this.controllers.get(register) as any;

    const existing = controllerMap[name];

    if (existing) {
      return existing;
    }

    const instance: any = new ControllerClass(register);
    controllerMap[name] = instance;

    if (instance.reducer) {
      (this.reducerFns.get(register) as any)(instance);
    }

    return instance;
  }
}
