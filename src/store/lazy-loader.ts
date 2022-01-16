// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2022 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { AnyAction } from 'redux';
import { Controller, ModelConstructor } from '../controllers/controller';
import { StatelessController } from '../controllers/stateless-controller';
import { ObjectiveStore } from './objective-store';

/**
 * @internal
 */
interface ControllerMap {
  [key: string]: typeof Controller;
}

/**
 * @internal
 */
interface NamespacedControllerMap {
  [key: string]: ControllerMap;
}

/**
 * @internal
 */
interface ControllerInstanceMap<T extends Controller> {
  [key: string]: T;
}

/**
 * @internal
 */
interface NamespacedControllerInstanceMap<T extends Controller> {
  [key: string]: ControllerInstanceMap<T>;
}

/**
 * @interface
 */
type ObjectiveStoreToLoadedControllers<T extends Controller> =
  WeakMap<ObjectiveStore, NamespacedControllerInstanceMap<T>>;

/**
 * @internal
 */
type ReducerHandlingFn = (controller: any) => void;

/**
 * @internal
 */
type SagaCancelingFn = (statelessController: StatelessController) => void;

/**
 * @internal
 */
interface StoreHandlingFns {
  registerReducerFn: ReducerHandlingFn;
  unregisterReducerFn: ReducerHandlingFn;
  cancelSagasForController: SagaCancelingFn;
}

/**
 * @internal
 */
type StoreFnsMap = WeakMap<ObjectiveStore, StoreHandlingFns>;

/**
 * @internal
 */
export class LazyLoader {
  private static readonly loadableControllers: NamespacedControllerMap = {};

  private static readonly storeFns: StoreFnsMap = new WeakMap();

  private static readonly controllers: ObjectiveStoreToLoadedControllers<any> = new WeakMap();

  public static registerController(controller: typeof Controller): void {
    const namespace = controller.getNamespace() || '';
    /* istanbul ignore else */
    if (this.loadableControllers[namespace] == null) {
      this.loadableControllers[namespace] = {};
    }
    this.loadableControllers[namespace][controller.getName()] = controller;
  }

  public static getControllerForAction(action: AnyAction): typeof Controller|null {
    let controller = null;
    const type = action?.type || '';

    const match = type.match('^OBJECTIVE-REDUX-ACTION/(.*?)::([^/]*)/.*$');
    if (match && LazyLoader.loadableControllers[match[1]]) {
      controller = LazyLoader.loadableControllers[match[1]][match[2]];
    }

    return controller;
  }

  public static addObjectiveStore(objectiveStore: ObjectiveStore, storeFns: StoreHandlingFns): void {
    this.storeFns.set(objectiveStore, storeFns);
    this.controllers.set(objectiveStore, {});
  }

  // eslint-disable-next-line max-statements
  public static getController<T extends Controller>(
    objectiveStore: ObjectiveStore,
    ControllerClass: ModelConstructor<T> & Required<typeof Controller>
  ): T {
    const name = ControllerClass.getName();
    const namespace = ControllerClass.getNamespace() || '';
    const controllerMap: ControllerInstanceMap<any> = this.controllers.get(objectiveStore) as any;

    /* istanbul ignore else */
    if (controllerMap) {
      if (controllerMap[namespace] == null) {
        controllerMap[namespace] = {};
      }

      const existing = controllerMap[namespace][name];

      if (existing) {
        return existing;
      }
    }

    const instance: any = new ControllerClass();
    instance.setObjectiveStore(objectiveStore);

    /* istanbul ignore else */
    if (controllerMap) {
      controllerMap[namespace][name] = instance;
    }

    if (instance.reducer) {
      (this.storeFns.get(objectiveStore) as any).registerReducerFn(instance);
    }

    return instance;
  }

  public static removeController<T extends Controller>(
    objectiveStore: ObjectiveStore,
    ControllerClass: ModelConstructor<T> & typeof Controller
  ): void {
    const name = ControllerClass.getName();
    const namespace = ControllerClass.getNamespace() || '';
    const controllerMap: ControllerInstanceMap<any> = this.controllers.get(objectiveStore) || {};

    if (controllerMap[namespace] != null && controllerMap[namespace][name] != null) {
      const existing: any = controllerMap[namespace][name];

      if (existing.reducer) {
        (this.storeFns.get(objectiveStore) as any).unregisterReducerFn(existing);
      } else {
        (this.storeFns.get(objectiveStore) as any).cancelSagasForController(existing);
      }

      delete controllerMap[namespace][name];
    }
  }
}
