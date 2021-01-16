// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2021 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import {
  Action, createConnectedAction, ActionFn, ActionExtendFn,
} from '../helpers/action';
import { Controller } from './controller';

/**
 * @internal
 */
export interface ReducerFn<State, Payload> {
  (state: State, action: Payload): State;
}

/**
 * @internal
 */
interface ReducerMap<State, Payload> {
  [actionName: string]: ReducerFn<State, Payload>|null;
}

/**
 * Creates and manages a slice of Redux state.
 *
 * @template State The interface to which the slice of state will adhere.
 *
 * @example JavaScript
 * ```javascript
 * class SwitchStateController extends StateController {
 *   constructor() {
 *     super({ isOn: false });
 *   }
 *
 *   public static getName() {
 *     return 'switch';
 *   }
 *
 *   action = this.registerAction(
 *     (state, payload) => ({
 *       ...state,
 *       ...payload,
 *     })
 *   ).withAddressableName('MY_ACTION');
 * }
 *
 * const objectiveStore = new ObjectiveStore();
 * const controller = SwitchStateController.getInstance(objectiveStore);
 * controller.action({ isOn: true });
 * const slice = controller.getStateSlice();
 * ```
 * @example TypeScript
 * ```typescript
 * interface SwitchState {
 *   isOn: boolean;
 * }
 *
 * class SwitchStateController extends StateController<SwitchState> {
 *   constructor() {
 *     super({ isOn: false });
 *   }
 *
 *   public static getName(): string {
 *     return 'switch';
 *   }
 *
 *   const readonly action = this.registerAction<SwitchState>(
 *     (state, payload) => ({
 *       ...state,
 *       ...payload,
 *     })
 *   ).withAddressableName('MY_ACTION');
 * }
 *
 * const objectiveStore = new ObjectiveStore();
 * const controller = SwitchStateController.getInstance(objectiveStore);
 * controller.action({ isOn: true });
 * const slice = controller.getStateSlice();
 * ```
 */
export abstract class StateController<State> extends Controller {
  /**
   * The initial value of the state slice.
   */
  protected readonly initialState: State;

  /**
   * A map of the reducer action names to the data mutation functions.
   */
  protected readonly reducerMap: ReducerMap<State, any> = {};

  /**
   * Registers the controller, sets up the reducer, and sets the initial state.
   *
   * WARNING: While the constructor can be called directly, controllers are meant to be initialized with the
   * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
   * have adverse affects on the application.
   *
   * @param initialState The initial value of the state slice in Redux.
   * @returns An instance of the controller.
   */
  protected constructor(initialState: State) {
    super();
    this.initialState = initialState;
  }

  /**
   * Specified the name of the reducer/slice in the Redux store. Defaults to the value of getName.
   *
   * @returns The name of the controller in the store. Defaults to the value of getName.
   *
   * @example
   * ```typescript
   * class MyFirstController extends StateController {
   *   // ...
   *
   *   // Since getStoreName is not overloaded, this will be used as the slice name in the store
   *   static getName() {
   *     return 'MY_FIRST_CONTROLLER';
   *   }
   *
   *   // ...
   * }
   *
   * class MySecondController extends StateController {
   *   // ...
   *
   *   // Since getStoreName is overloaded, this will identify the controller but not be used as the slice name
   *   static getName() {
   *     return 'MY_SECOND_CONTROLLER';
   *   }
   *
   *   // This will be used as the slice name in the store
   *   static getStoreName() {
   *     return 'Second';
   *   }
   *
   *   // ...
   * }
   *
   * // Creates a state of the form:
   * //
   * // {
   * //   MY_FIRST_CONTROLLER: {
   * //     // ...
   * //   },
   * //   Second: {
   * //     // ...
   * //   },
   * // }
   * ```
   */
  public static getStoreName(): string {
    return this.getName();
  }

  /**
   * Registers a data mutator as part of the slice's reducer and returns the action for calling it.
   *
   * @template Payload The interface to which the payload of the action will adhere. If the type is void, no payload
   * will be accepted.
   *
   * @param fn The mutating function to add to the reducer.
   *
   * The function should be in the form:
   * ```.
   * (state, payload?) => state
   * ```.
   *
   * @returns The action producing function for calling the mutating function.
   *
   * This action producing function also has a `withAddressableName` function that can be called to change the action
   * name. For example: `myAction.withAddressableName('MY_ACTION_NAME');`.
   */
  protected registerAction<Payload>(fn: ReducerFn<State, Payload>): ActionExtendFn<Payload> {
    const actionName = this.createActionName();
    this.reducerMap[actionName] = fn;

    const actionFn: any = createConnectedAction<Payload>(actionName, () => this.objectiveStore as any);

    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by
     * this builder.
     *
     * @param name The name of the action.
     * @returns The action producing function for calling the mutating function.
     */
    actionFn.withAddressableName = (name: string): ActionFn<Payload> => {
      delete this.reducerMap[actionName];
      const addressableActionName = this.createActionName(name);
      this.reducerMap[addressableActionName] = fn;
      return createConnectedAction<Payload>(addressableActionName, () => this.objectiveStore as any);
    };

    return actionFn;
  }

  /**
   * The reducer, which handles mutations to the state slice.
   *
   * @param state The current state of the state slice.
   * @param action The action being performed on the state.
   * @returns The new state resulting from the action.
   */
  public reducer(state: State = this.initialState, action: Action<any>|null = null): State {
    const reducerFn = this.reducerMap[action?.type || ''];

    if (!reducerFn || !action) {
      return state;
    }

    return reducerFn(state, action.payload);
  }

  /**
   * Gets the current value for this slice of the Redux state.
   *
   * @returns The current slice of the state related to this controller.
   */
  public getStateSlice(): State {
    let state = (this.objectiveStore as any).getState();
    const namespace = (this.constructor as any).getNamespace();
    state = state && namespace ? state[namespace] : state;
    return state && state[(this.constructor as any).getStoreName()];
  }

  /**
   * Fires an action that resets the state back to the controller's initial state.
   *
   * @example
   * ```typescript
   * MyController.getInstance(objectiveStore).reset();
   * ```
   */
  public readonly reset = this.registerAction<void>(
    () => this.initialState
  );
}
