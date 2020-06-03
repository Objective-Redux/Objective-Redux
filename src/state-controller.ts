// ================================================================================================
//                                          OBJECTIVE REDUX
//                                  Redux made better, objectively.
//
// (c) Copyright 2020 by Jason Mace (https://github.com/jmace01)
//
// This project is provided under the terms of the MIT license. The license details can be found in
// the LICENSE file, found in the project's root directory.
// ================================================================================================

import { ReduxRegister } from './redux-register';
import {
  Action, createConnectedAction, ActionFn, ActionExtendFn,
} from './action';
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
 * @example
 * JavaScript
 * ```javascript
 * class SwitchStateController extends StateController {
 *   constructor(register) {
 *     super('switch', { isOn: false }, register);
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
 * const register = new ReduxRegister();
 * const controller = SwitchStateController.getInstance(register);
 * controller.action({ isOn: true });
 * const slice = controller.getStateSlice();
 * ```
 * TypeScript
 * ```typescript
 * interface SwitchState {
 *   isOn: boolean;
 * }
 *
 * class SwitchStateController extends StateController<SwitchState> {
 *   constructor(register: ReduxRegister) {
 *     super('switch', { isOn: false }, register);
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
 * const register = new ReduxRegister();
 * const controller = SwitchStateController.getInstance(register);
 * controller.action({ isOn: true });
 * const slice = controller.getStateSlice();
 * ```
 */
export abstract class StateController<State> extends Controller {
  private static count = 0;

  /**
   * The name of the reducer/state slice.
   */
  protected readonly stateName: string;

  /**
   * The initial value of the state slice.
   */
  protected readonly initialState: State;

  /**
   * A map of the reducer action names to the data mutation functions.
   */
  protected readonly reducerMap: ReducerMap<State, any>;

  /**
   * Registers the controller, sets up the reducer, and sets the initial state.
   *
   * _WARNING: While the constructor can be called directly, state controllers are meant to be initialized with the
   * [[getInstance]] method. Creating instances directly can lead to having more than one instance at a time, which may
   * have adverse affects on the application.
   *
   * @param stateName The type or interface of state slice for which the controller will be managing.
   * @param initialState The initial value of the state slice in Redux.
   * @param register The redux register instance to which the component is being connected.
   * @returns The ReduxRegister instance to which the controller will be connected.
   */
  // eslint-disable-next-line max-params
  protected constructor(stateName: string, initialState: State, register: ReduxRegister) {
    super(register);
    this.stateName = stateName;
    this.initialState = initialState;
    this.reducerMap = {};
    this.register.registerReducer(this.stateName, this.reducer.bind(this));
  }

  /**
   * Generates a unique, default action name that can be used for a reducing function.
   *
   * @returns A unique name for an action.
   */
  private createActionName(): string {
    return `ACTIONS/${this.stateName}/${StateController.count++}`;
  }

  /**
   * Registers a data mutator as part of the slice's reducer and returns the action for calling it.
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

    const actionFn: any = createConnectedAction<Payload>(actionName, this.register);

    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by
     * this builder.
     *
     * @param name The name of the action.
     * @returns The action producing function for calling the mutating function.
     */
    actionFn.withAddressableName = (name: string): ActionFn<Payload> => {
      this.reducerMap[actionName] = null;
      this.reducerMap[name] = fn;
      return createConnectedAction<Payload>(name, this.register);
    };

    const extendedActionFn: ActionExtendFn<Payload> = actionFn;

    return extendedActionFn;
  }

  /**
   * The reducer, which handles mutations to the state slice.
   *
   * @param state The current state of the state slice.
   * @param action The action being performed on the state.
   * @returns The new state resulting from the action.
   */
  protected reducer(state: State = this.initialState, action: Action<any>|null = null): State {
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
    return this.register
      .getStore()
      .getState()[this.stateName];
  }
}
