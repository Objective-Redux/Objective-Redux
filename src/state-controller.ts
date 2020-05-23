import { ReduxRegister } from './redux-register';
import { Action, createAction, ActionFn, ActionExtendFn } from './action';

export interface ReducerFn<State, Payload> {
  (state: State, action: Payload): State;
}

interface ReducerMap<State, Payload> {
  [actionName: string]: ReducerFn<State, Payload>|null;
}

export abstract class StateController<State> {
  private static count = 0;

  protected readonly stateName: string;

  protected readonly initialState: State;

  protected readonly reducerMap: ReducerMap<State, any>;

  /**
   * Generates and connects a Redux state slice
   * @param stateName the name of the state slice
   * @param initialState the value that will initially populate the state slice
   */
  public constructor(stateName: string, initialState: State) {
    this.stateName = stateName;
    this.initialState = initialState;
    this.reducerMap = {};
    ReduxRegister.registerReducer(this.stateName, this.reducer.bind(this));
  }

  /**
   * Generates a unique, default action name
   * @return an action name
   */
  protected createActionName(): string {
    return `ACTIONS/${this.stateName}/${StateController.count++}`;
  }

  /**
   * Registers a mutator as part of the state slice's reducer and returns the action for calling it
   * @param fn the mutating function to add to the reducer The function should be in the form:
   * ```
   * (state, payload?) => state
   * ```
   * @returns the action producing function for calling the mutating function
   */
  protected registerAction<Payload>(fn: ReducerFn<State, Payload>): ActionExtendFn<Payload> {
    const actionName = this.createActionName();
    this.reducerMap[actionName] = fn;

    const actionFn: ActionExtendFn<Payload> = createAction<Payload>(actionName);

    /**
     * Adds a specific name to the saga so that it can be addressed without calling the specific action returned by this builder
     * @param name the name of the action
     * @returns the action producing function for calling the mutating function
     */
    actionFn.withAddressableName = (name: string): ActionFn<Payload> => {
      this.reducerMap[actionName] = null;
      this.reducerMap[name] = fn;
      return createAction<Payload>(name);
    };

    return actionFn;
  }

  /**
   * The reducer, which handles mutations to the state slice
   * @param state the current state of the state slice
   * @param action the action being performed on the state
   * @return the new state resulting from the action
   */
  protected reducer(state: State = this.initialState, action: Action<any>): State {
    const reducerFn = this.reducerMap[action.type];

    if (!reducerFn) {
      return state;
    }

    return reducerFn(state, action.payload);
  }

  /**
   * Adds the portion of the state pertaining to the slice to the ownProps object
   * @param state the full Redux state
   * @param ownProps an object to which the state slice values will be added
   * @return the part of the state that belongs to the slice plus anything that was previously in ownProps
   */
  public stateSelector(state: { [name: string]: State }, ownProps: any): State {
    return {
      ...ownProps,
      ...state[this.stateName],
    };
  }
}
